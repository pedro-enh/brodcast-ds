# 🚀 Quick Start Guide - Discord Broadcaster Pro

## ⚡ Fast Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Configure Discord App

#### A. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Enter name → Create
3. Copy **Application ID** (Client ID)

#### B. Setup OAuth2
1. Go to "OAuth2" → "General"
2. Add Redirect URI: `http://localhost:3000/auth/discord/callback`
3. Copy **Client Secret**

#### C. Create Bot
1. Go to "Bot" section → "Add Bot"
2. Copy **Bot Token**
3. Enable **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Presence Intent

#### D. Invite Bot to Server
1. Go to "OAuth2" → "URL Generator"
2. Scopes: `bot`
3. Permissions: `Send Messages`, `Read Message History`, `View Channels`
4. Copy URL and invite bot to your server

### 4. Update .env File
```env
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_BOT_TOKEN=your_bot_token_here
APP_URL=http://localhost:3000
SESSION_SECRET=your_random_secret_here
```

### 5. Start Application
```bash
npm start
```

### 6. Access Application
Open browser: `http://localhost:3000`

## 🎯 Usage Steps

1. **Login** → Click "Login with Discord"
2. **Connect Bot** → Enter bot token → Click "Connect Bot"
3. **Select Server** → Choose from dropdown
4. **Configure Message** → Write message, select targets
5. **Send** → Test first, then broadcast

## 🚀 Deploy to Railway

1. Fork this repository
2. Connect to [Railway](https://railway.app)
3. Add environment variables (same as above, but change APP_URL)
4. Deploy automatically

## ⚠️ Important Notes

- **Rate Limits**: Respect Discord's rate limits
- **Permissions**: Ensure bot has proper permissions
- **Privacy**: Only message users who consent
- **Terms**: Follow Discord Terms of Service

## 🆘 Troubleshooting

**Bot won't connect?**
- Check token is correct
- Enable privileged intents
- Bot must be in at least one server

**Members not loading?**
- Enable "Server Members Intent"
- Check bot permissions
- Try refreshing the page

**Messages failing?**
- Users may have DMs disabled
- Bot may be blocked
- Check rate limits

## 📞 Support

- GitHub Issues: Report bugs
- Discord: Join support server
- Documentation: Full README.md

---
**Ready to broadcast! 🎉**
