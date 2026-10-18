# EPI LIGHT Mini App — demo

Static frontend: https://agievotar.github.io/epi-light-miniapp-demo/
Telegram: https://t.me/epi_light_bot

The UI uses synthetic availability and browser-local reservations. It does **not** book a real appointment or notify the studio.

## Bot backend

A minimal Node.js (>=18) Telegram polling process in `bot/index.cjs` replies to `/start` with an inline Web App button. It also sets the chat menu button. No database and no dependencies.

Set `TELEGRAM_BOT_TOKEN` in the **server environment** (never commit or send it in chat), then run `node bot/index.cjs` under a service manager. The token is validated against `epi_light_bot` before configuring anything. Only one polling instance should run. This backend does not receive or persist booking data. Do not use real clients with this demo.

Next: configure secret privately, run service, test `/start` in Telegram, then iterate on UI; actual scheduling/notifications require separate scope and Telegram initData validation.
