# TEAM-LINK

TEAM LINK app - production source code and assets.

## LINE rich menu

The production rich menu uses two 2500 × 1686 PNG images and LINE Messaging API
`richmenuswitch` actions.

- `images/richmenu/main.png`: check-in and member actions
- `images/richmenu/teamlink.png`: lounge, EXTENSION, and recommended products
- `images/richmenu/source/*.svg`: editable 2500 × 1686 vector templates
- `scripts/generate-richmenu-images.py`: regenerates SVG and PNG assets from
  existing TEAM LINK artwork and the verified Kimikea Connect extension visual
- `scripts/setup-richmenu.gs`: idempotent Google Apps Script installer
- `scripts/validate-richmenu-assets.py`: validates image dimensions, file size, and
  all tap-area bounds

The installer reads `LINE_CHANNEL_ACCESS_TOKEN` from Apps Script Properties. Never
put a channel access token in this repository. It reuses menus with the current
versioned names, updates the two aliases (`teamlink-main` and
`teamlink-service`), and never deletes an existing menu automatically.

Generate and validate previews with:

```sh
python3 scripts/generate-richmenu-images.py
python3 scripts/validate-richmenu-assets.py
```

Publish approved assets on GitHub Pages before running
`setupTeamLinkRichMenus()` so Apps Script can fetch the image URLs. The service
menu uses TEAM LINK lounge plus verified Kimikea Connect routes for stylebook,
map, ranking, academy, and AI diagnosis. The products card uses its configured
direct URL. The Instagram card links to the official TEAM hair profile.
Member-only actions use LINE
message/postback events so the webhook can identify `source.userId` and reuse the
existing member authentication and check-in logic.

## Mac admin Web Push (local implementation)

The admin notification feature is additive and is not deployed automatically.

- `manifest.webmanifest` makes `?view=admin` the standalone app entry point.
- `service-worker.js` receives Push API events and opens the relevant admin page.
- `apps-script/WebPush.gs` stores device subscriptions in `PushSubscriptions`,
  scans existing booking/consultation/visit sheets once per minute, and records
  deduplication results in `PushNotificationLog`.
- `apps-script/Code.gs.integration.patch` adds the three new API actions to the
  current production router without changing existing response formats.
- `workers/web-push-relay/worker.mjs` is a separate Cloudflare Worker. It performs
  standards-based VAPID signing and `aes128gcm` Web Push encryption. It does not
  modify or share code with `team-link-line-webhook`.

Required Apps Script properties:

- `TEAM_LINK_WEB_PUSH_VAPID_PUBLIC_KEY`
- `TEAM_LINK_WEB_PUSH_RELAY_URL`
- `TEAM_LINK_WEB_PUSH_RELAY_SECRET`

Required Worker secrets:

- `TEAM_LINK_WEB_PUSH_RELAY_SECRET`
- `WEB_PUSH_VAPID_PUBLIC_KEY`
- `WEB_PUSH_VAPID_PRIVATE_KEY`
- `WEB_PUSH_CONTACT` (for example a `mailto:` contact)

After adding `WebPush.gs` and applying the small router patch, run
`installTeamLinkWebPushTrigger()` once. Existing pending items are marked as seen
before the one-minute trigger starts, preventing a first-deploy notification
storm. Web Push delivery is isolated from reservation saves, email, LINE, and
check-in processing; delivery failure is logged and never changes those results.
