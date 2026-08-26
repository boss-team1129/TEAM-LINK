const TEAM_LINK_NOTIFICATION_ICON = "./assets/icons/icon-192.png";
const TEAM_LINK_NOTIFICATION_BADGE = "./assets/icons/icon-192.png";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = { title: "TEAM LINK", body: event.data ? event.data.text() : "新しいお知らせがあります。" };
  }
  const title = String(payload.title || "TEAM LINK");
  const options = {
    body: String(payload.body || "管理画面をご確認ください。"),
    icon: payload.icon || TEAM_LINK_NOTIFICATION_ICON,
    badge: payload.badge || TEAM_LINK_NOTIFICATION_BADGE,
    tag: String(payload.tag || payload.eventKey || "team-link-admin"),
    renotify: false,
    data: {
      url: String(payload.url || "./?view=admin"),
      eventType: String(payload.eventType || "")
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "./?view=admin", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windows.find((client) => new URL(client.url).origin === new URL(targetUrl).origin);
    if (existing) {
      await existing.navigate(targetUrl);
      return existing.focus();
    }
    return self.clients.openWindow(targetUrl);
  })());
});
