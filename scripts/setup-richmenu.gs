/**
 * TEAM LINK rich-menu installer for Google Apps Script.
 * Uses LINE_CHANNEL_ACCESS_TOKEN from Script Properties. Never hard-code the token.
 * Safe to run repeatedly: it reuses matching owned menus and updates aliases in place.
 */
const TEAM_LINK_RICHMENU_CONFIG = Object.freeze({
  version: "20260823-2",
  publicUrl: "https://boss-team1129.github.io/TEAM-LINK/",
  kimikeaUrl: "https://boss-team1129.github.io/Kimikea-Connect/",
  recommendedProductsUrl: "https://fordays-shop.jp/?intro=vbej6z1xoyzppojfd277",
  instagramUrl: "https://www.instagram.com/teamhair_1129/",
  aliases: { main: "teamlink-main", service: "teamlink-service" },
  images: {
    main: "https://boss-team1129.github.io/TEAM-LINK/images/richmenu/main.png",
    service: "https://boss-team1129.github.io/TEAM-LINK/images/richmenu/teamlink.png"
  }
});

function setupTeamLinkRichMenus() {
  if (!TEAM_LINK_RICHMENU_CONFIG.instagramUrl) {
    throw new Error("Instagramの正式URLをTEAM_LINK_RICHMENU_CONFIG.instagramUrlへ設定してください。API登録はまだ実行していません。");
  }
  const token = String(PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN") || "").trim();
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN がScript Propertiesに設定されていません。");
  const before = listTeamLinkRichMenus_(token);
  console.log("[RICHMENU_BEFORE] " + JSON.stringify(before));

  const definitions = buildTeamLinkRichMenuDefinitions_();
  const mainId = ensureTeamLinkRichMenu_(token, definitions.main, TEAM_LINK_RICHMENU_CONFIG.images.main, before.richMenus);
  const serviceId = ensureTeamLinkRichMenu_(token, definitions.service, TEAM_LINK_RICHMENU_CONFIG.images.service, before.richMenus);

  upsertTeamLinkRichMenuAlias_(token, TEAM_LINK_RICHMENU_CONFIG.aliases.main, mainId, before.aliases);
  upsertTeamLinkRichMenuAlias_(token, TEAM_LINK_RICHMENU_CONFIG.aliases.service, serviceId, before.aliases);
  lineRichMenuRequest_(token, "https://api.line.me/v2/bot/user/all/richmenu/" + encodeURIComponent(mainId), {
    method: "post",
    muteHttpExceptions: true
  }, [200]);

  const after = listTeamLinkRichMenus_(token);
  const result = {
    success: true,
    mainRichMenuId: mainId,
    serviceRichMenuId: serviceId,
    aliases: after.aliases.filter(function(alias) {
      return [TEAM_LINK_RICHMENU_CONFIG.aliases.main, TEAM_LINK_RICHMENU_CONFIG.aliases.service]
        .includes(alias.richMenuAliasId);
    }),
    richMenuCount: after.richMenus.length,
    note: "既存リッチメニューは削除していません"
  };
  console.log("[RICHMENU_SETUP_COMPLETE] " + JSON.stringify(result));
  return result;
}

function inspectTeamLinkRichMenus() {
  const token = String(PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN") || "").trim();
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN がScript Propertiesに設定されていません。");
  const result = listTeamLinkRichMenus_(token);
  console.log("[RICHMENU_INSPECT] " + JSON.stringify(result));
  return result;
}

function buildTeamLinkRichMenuDefinitions_() {
  const config = TEAM_LINK_RICHMENU_CONFIG;
  const publicUrl = config.publicUrl;
  const kimikeaUrl = config.kimikeaUrl;
  const tabMain = {
    bounds: { x: 0, y: 0, width: 1250, height: 220 },
    action: { type: "richmenuswitch", richMenuAliasId: config.aliases.main, data: "action=richMenuSwitch&tab=main" }
  };
  const tabService = {
    bounds: { x: 1250, y: 0, width: 1250, height: 220 },
    action: { type: "richmenuswitch", richMenuAliasId: config.aliases.service, data: "action=richMenuSwitch&tab=service" }
  };
  function messageArea(bounds, label, text) {
    return { bounds, action: { type: "message", label, text } };
  }
  function uriArea(bounds, label, uri) {
    return { bounds, action: { type: "uri", label, uri } };
  }
  return {
    main: {
      size: { width: 2500, height: 1686 },
      selected: true,
      name: "TEAM LINK MAIN " + config.version,
      chatBarText: "メニューを開く",
      areas: [
        tabMain,
        tabService,
        {
          bounds: { x: 60, y: 250, width: 2380, height: 340 },
          action: { type: "postback", label: "来店しました", data: "action=customerCheckIn&source=richmenu", displayText: "来店しました" }
        },
        messageArea({ x: 60, y: 620, width: 773, height: 470 }, "予約をする", "予約をする"),
        messageArea({ x: 863, y: 620, width: 774, height: 470 }, "予約確認", "予約確認"),
        messageArea({ x: 1666, y: 620, width: 774, height: 470 }, "クーポン", "クーポン"),
        messageArea({ x: 60, y: 1120, width: 773, height: 470 }, "今月のガチャ", "ガチャ"),
        messageArea({ x: 863, y: 1120, width: 774, height: 470 }, "占い", "占い"),
        messageArea({ x: 1666, y: 1120, width: 774, height: 470 }, "マイページ", "マイページ")
      ]
    },
    service: {
      size: { width: 2500, height: 1686 },
      selected: true,
      name: "TEAM LINK SERVICE " + config.version,
      chatBarText: "TEAM LINKを開く",
      areas: [
        tabMain,
        tabService,
        uriArea({ x: 60, y: 250, width: 2380, height: 390 }, "ご縁ラウンジ", publicUrl + "?view=lounge"),
        uriArea({ x: 95, y: 1020, width: 1050, height: 102 }, "スタイル図鑑", kimikeaUrl + "stylebook/"),
        uriArea({ x: 95, y: 1134, width: 1050, height: 102 }, "マップ", kimikeaUrl + "?view=map"),
        uriArea({ x: 95, y: 1248, width: 1050, height: 102 }, "ランキング", kimikeaUrl + "?view=popular"),
        uriArea({ x: 95, y: 1362, width: 1050, height: 102 }, "講習案内", kimikeaUrl + "?view=academy"),
        uriArea({ x: 95, y: 1476, width: 1050, height: 102 }, "AI診断", kimikeaUrl + "?view=ai-diagnosis"),
        uriArea({ x: 1210, y: 670, width: 590, height: 956 }, "おすすめ商品", config.recommendedProductsUrl),
        uriArea({ x: 1830, y: 670, width: 610, height: 956 }, "Instagram", config.instagramUrl)
      ]
    }
  };
}

function ensureTeamLinkRichMenu_(token, definition, imageUrl, existingMenus) {
  const existing = (existingMenus || []).find(function(menu) { return String(menu.name || "") === definition.name; });
  if (existing) return existing.richMenuId;
  const created = lineRichMenuRequest_(token, "https://api.line.me/v2/bot/richmenu", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(definition),
    muteHttpExceptions: true
  }, [200]);
  const richMenuId = String(created.body.richMenuId || "");
  if (!richMenuId) throw new Error("リッチメニューIDを取得できませんでした。");
  const imageResponse = UrlFetchApp.fetch(imageUrl, { method: "get", muteHttpExceptions: true });
  if (imageResponse.getResponseCode() !== 200) throw new Error("リッチメニュー画像を取得できませんでした: HTTP " + imageResponse.getResponseCode());
  lineRichMenuRequest_(token, "https://api-data.line.me/v2/bot/richmenu/" + encodeURIComponent(richMenuId) + "/content", {
    method: "post",
    contentType: "image/png",
    payload: imageResponse.getBlob().getBytes(),
    muteHttpExceptions: true
  }, [200]);
  return richMenuId;
}

function upsertTeamLinkRichMenuAlias_(token, aliasId, richMenuId, aliases) {
  const existing = (aliases || []).find(function(alias) { return alias.richMenuAliasId === aliasId; });
  if (existing && existing.richMenuId === richMenuId) return;
  const url = existing
    ? "https://api.line.me/v2/bot/richmenu/alias/" + encodeURIComponent(aliasId)
    : "https://api.line.me/v2/bot/richmenu/alias";
  const body = existing ? { richMenuId } : { richMenuAliasId: aliasId, richMenuId };
  lineRichMenuRequest_(token, url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  }, [200]);
}

function listTeamLinkRichMenus_(token) {
  const menus = lineRichMenuRequest_(token, "https://api.line.me/v2/bot/richmenu/list", {
    method: "get", muteHttpExceptions: true
  }, [200]);
  const aliases = lineRichMenuRequest_(token, "https://api.line.me/v2/bot/richmenu/alias/list", {
    method: "get", muteHttpExceptions: true
  }, [200]);
  return {
    richMenus: (menus.body.richmenus || []).map(function(menu) {
      return {
        richMenuId: String(menu.richMenuId || ""),
        name: String(menu.name || ""),
        chatBarText: String(menu.chatBarText || ""),
        areaCount: Array.isArray(menu.areas) ? menu.areas.length : 0
      };
    }),
    aliases: (aliases.body.aliases || []).map(function(alias) {
      return { richMenuAliasId: String(alias.richMenuAliasId || ""), richMenuId: String(alias.richMenuId || "") };
    })
  };
}

function lineRichMenuRequest_(token, url, options, acceptedStatuses) {
  const request = Object.assign({}, options || {});
  request.headers = Object.assign({}, request.headers || {}, { Authorization: "Bearer " + token });
  const response = UrlFetchApp.fetch(url, request);
  const status = Number(response.getResponseCode());
  const text = String(response.getContentText() || "");
  let body = {};
  try { body = JSON.parse(text || "{}"); } catch (error) {}
  if (!(acceptedStatuses || [200]).includes(status)) {
    throw new Error("LINE Rich Menu API HTTP " + status + ": " + text.slice(0, 500));
  }
  return { status, body };
}
