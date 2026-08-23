# TEAM-LINK

TEAM LINK app - production source code and assets.

## LINE rich menu

The production rich menu uses two 2500 × 1686 PNG images and LINE Messaging API
`richmenuswitch` actions.

- `images/richmenu/main.png`: check-in and member actions
- `images/richmenu/teamlink.png`: lounge, EXTENSION, and recommended products
- `scripts/generate-richmenu-images.py`: regenerates both PNG assets from existing
  TEAM LINK artwork
- `scripts/setup-richmenu.gs`: idempotent Google Apps Script installer
- `scripts/validate-richmenu-assets.py`: validates image dimensions, file size, and
  all tap-area bounds

The installer reads `LINE_CHANNEL_ACCESS_TOKEN` from Apps Script Properties. Never
put a channel access token in this repository. It reuses menus with the current
versioned names, updates the two aliases (`teamlink-main` and
`teamlink-service`), and never deletes an existing menu automatically.

Publish these assets on GitHub Pages before running `setupTeamLinkRichMenus()` so
Apps Script can fetch the image URLs. The public routes used by the service menu
are `?view=lounge`, `?view=extension`, and `?view=products`. Member-only actions
use LINE message/postback events so the webhook can identify `source.userId` and
reuse the existing member authentication and check-in logic.
