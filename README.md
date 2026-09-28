# Boppers 12-hour promo bot

Posts the promo, waits 12 hours, deletes the old message, posts again.

## Setup

1. https://discord.com/developers/applications → New Application → Bot
2. Enable the bot, copy the token
3. OAuth2 → URL Generator
   - Scope: `bot`
   - Permissions: **Send Messages**, **Manage Messages**, **Mention Everyone**, **Embed Links**
4. Open the invite URL and add the bot to your server
5. Copy the channel ID (Discord Settings → Advanced → Developer Mode → right click channel → Copy ID)

```bash
cd discord-promo-bot
cp .env.example .env
# put token + channel id in .env
npm install
npm start
```

## Edit the message

In `index.js`:

- Replace `<:name:id>` if your emoji names differ (IDs can stay)
- Replace `<#PREVIEW_CHANNEL_ID>` and `<#SUPPORT_CHANNEL_ID>` with the real channel IDs  
  Example: `<#1494322227443929218>`  
  `#channel-name` in a bot message is not clickable unless you use `<#id>`

Keep the process running (PM2, a VPS, or Railway). If the bot is offline it will not post.

```bash
npx pm2 start index.js --name boppers-promo
```
