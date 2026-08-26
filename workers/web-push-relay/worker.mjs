const textEncoder = new TextEncoder();

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return jsonResponse({ success: true, service: "TEAM LINK Web Push Relay" });
    }
    if (request.method !== "POST") return jsonResponse({ success: false, error: "METHOD_NOT_ALLOWED" }, 405);
    const rawBody = await request.text();
    const signature = request.headers.get("X-Team-Link-Signature") || "";
    if (!env.TEAM_LINK_WEB_PUSH_RELAY_SECRET || !(await verifyRelaySignature(rawBody, signature, env.TEAM_LINK_WEB_PUSH_RELAY_SECRET))) {
      return jsonResponse({ success: false, error: "UNAUTHORIZED" }, 401);
    }
    let input;
    try {
      input = JSON.parse(rawBody);
    } catch (error) {
      return jsonResponse({ success: false, error: "INVALID_JSON" }, 400);
    }
    try {
      const pushRequest = await buildWebPushRequest(input.subscription, input.event, env);
      const response = await fetch(pushRequest.endpoint, {
        method: "POST",
        headers: pushRequest.headers,
        body: pushRequest.body,
        redirect: "manual"
      });
      const expired = response.status === 404 || response.status === 410;
      return jsonResponse({
        success: response.status === 201 || response.status === 202,
        httpStatus: response.status,
        expired
      }, response.status === 201 || response.status === 202 || expired ? 200 : 502);
    } catch (error) {
      return jsonResponse({ success: false, error: "PUSH_FAILED", message: String(error?.message || error).slice(0, 240) }, 502);
    }
  }
};

export async function buildWebPushRequest(subscription, event, env, nowSeconds = Math.floor(Date.now() / 1000)) {
  validateSubscription(subscription);
  const publicKey = String(env.WEB_PUSH_VAPID_PUBLIC_KEY || "");
  const privateKey = String(env.WEB_PUSH_VAPID_PRIVATE_KEY || "");
  const subject = String(env.WEB_PUSH_CONTACT || "mailto:team-link@example.invalid");
  if (!publicKey || !privateKey) throw new Error("VAPID keys are not configured");
  const endpoint = String(subscription.endpoint);
  const audience = new URL(endpoint).origin;
  const jwt = await createVapidJwt({ audience, subject, publicKey, privateKey, nowSeconds });
  const payload = textEncoder.encode(JSON.stringify(normalizeEvent(event)));
  const body = await encryptWebPushPayload(payload, subscription.keys.p256dh, subscription.keys.auth);
  return {
    endpoint,
    body,
    headers: {
      Authorization: `vapid t=${jwt}, k=${publicKey}`,
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      TTL: "86400",
      Urgency: "high"
    }
  };
}

export function normalizeEvent(event = {}) {
  return {
    title: String(event.title || "TEAM LINK"),
    body: String(event.body || "管理画面をご確認ください。"),
    url: String(event.url || "https://boss-team1129.github.io/TEAM-LINK/?view=admin"),
    tag: String(event.tag || event.eventKey || "team-link-admin"),
    eventKey: String(event.eventKey || ""),
    eventType: String(event.eventType || "")
  };
}

export async function createVapidJwt({ audience, subject, publicKey, privateKey, nowSeconds }) {
  const publicBytes = base64UrlDecode(publicKey);
  const privateBytes = base64UrlDecode(privateKey);
  if (publicBytes.length !== 65 || publicBytes[0] !== 4 || privateBytes.length !== 32) throw new Error("Invalid VAPID key material");
  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: base64UrlEncode(publicBytes.slice(1, 33)),
    y: base64UrlEncode(publicBytes.slice(33, 65)),
    d: base64UrlEncode(privateBytes),
    ext: true
  };
  const signingKey = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const header = base64UrlEncode(textEncoder.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const claims = base64UrlEncode(textEncoder.encode(JSON.stringify({ aud: audience, exp: nowSeconds + 12 * 60 * 60, sub: subject })));
  const signingInput = `${header}.${claims}`;
  const signature = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, signingKey, textEncoder.encode(signingInput)));
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export async function encryptWebPushPayload(payload, clientPublicKey, authSecret) {
  const clientPublicBytes = base64UrlDecode(clientPublicKey);
  const authBytes = base64UrlDecode(authSecret);
  if (clientPublicBytes.length !== 65 || clientPublicBytes[0] !== 4 || authBytes.length !== 16) throw new Error("Invalid subscription key material");
  const clientKey = await crypto.subtle.importKey("raw", clientPublicBytes, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const serverKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const serverPublicBytes = new Uint8Array(await crypto.subtle.exportKey("raw", serverKeys.publicKey));
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: clientKey }, serverKeys.privateKey, 256));
  const keyInfo = concatBytes(textEncoder.encode("WebPush: info\0"), clientPublicBytes, serverPublicBytes);
  const ikm = await hkdf(sharedSecret, authBytes, keyInfo, 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const contentEncryptionKey = await hkdf(ikm, salt, textEncoder.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(ikm, salt, textEncoder.encode("Content-Encoding: nonce\0"), 12);
  const aesKey = await crypto.subtle.importKey("raw", contentEncryptionKey, "AES-GCM", false, ["encrypt"]);
  const plaintext = concatBytes(payload, new Uint8Array([2]));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, plaintext));
  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, 4096, false);
  return concatBytes(salt, recordSize, new Uint8Array([serverPublicBytes.length]), serverPublicBytes, ciphertext);
}

export async function verifyRelaySignature(body, signature, secret) {
  const expected = await createRelaySignature(body, secret);
  return timingSafeEqual(expected, String(signature || ""));
}

export async function createRelaySignature(body, secret) {
  const key = await crypto.subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(body))));
}

async function hkdf(inputKeyMaterial, salt, info, length) {
  const key = await crypto.subtle.importKey("raw", inputKeyMaterial, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, length * 8));
}

function validateSubscription(subscription) {
  if (!subscription || !/^https:\/\//.test(String(subscription.endpoint || ""))) throw new Error("Invalid subscription endpoint");
  if (!subscription.keys?.p256dh || !subscription.keys?.auth) throw new Error("Subscription keys are required");
}

function concatBytes(...chunks) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json;charset=utf-8" } });
}
