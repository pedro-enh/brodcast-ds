# Discord Broadcaster Pro 🚀

A powerful web-based Discord broadcasting application built with PHP that allows you to send direct messages to all members of your Discord server.

## ⚠️ Important Notice

**GitHub Pages does not support PHP!** If you deployed this project on GitHub Pages, it will only show a static HTML page and won't work properly.

### ✅ Recommended Solution: Deploy on Railway

Railway is a free platform that supports PHP and is perfect for this project.

**Quick Deploy:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## 🌟 Features

- **Discord OAuth Integration** - Secure login with Discord
- **Mass Direct Messaging** - Send messages to all server members
- **Modern UI** - Beautiful glassmorphism design
- **Real-time Progress** - Track message delivery status
- **Environment Variables** - Secure configuration management
- **Rate Limiting** - Respects Discord API limits
- **Error Handling** - Comprehensive error reporting

## 🚀 Quick Start

### Option 1: Deploy on Railway (Recommended)

1. **Fork this repository**
2. **Go to [Railway.app](https://railway.app)**
3. **Sign in with GitHub**
4. **Create new project from GitHub repo**
5. **Add environment variables:**
   ```
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   REDIRECT_URI=https://your-app.up.railway.app/auth.php
   BOT_TOKEN=your_bot_token
   ```
6. **Deploy and enjoy!**

### Option 2: Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/discord-broadcaster-pro.git
   cd discord-broadcaster-pro
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your Discord credentials:**
   ```env
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   REDIRECT_URI=http://localhost:8000/auth.php
   BOT_TOKEN=your_bot_token
   ```

4. **Start PHP server:**
   ```bash
   php -S localhost:8000
   ```

5. **Open http://localhost:8000**

## 🔧 Discord Setup

### 1. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Go to **OAuth2** section:
   - Add redirect URI: `https://your-domain.com/auth.php`
   - Select scopes: `identify`, `guilds`

### 2. Create Discord Bot
1. Go to **Bot** section
2. Create bot
3. Copy bot token
4. Enable **Server Members Intent**

### 3. Invite Bot to Server
Generate invite link with permissions:
- Send Messages
- Read Message History
- View Channels

## 📁 Project Structure

```
discord-broadcaster-pro/
├── index.php              # Main landing page
├── broadcast.php          # Broadcasting interface
├── auth.php              # OAuth handler
├── login.php             # Login redirect
├── logout.php            # Logout handler
├── config.php            # Configuration loader
├── env-loader.php        # Environment variables loader
├── styles.css            # Styling
├── broadcast.js          # Frontend JavaScript
├── .env.example          # Environment template
├── railway.json          # Railway configuration
└── README.md             # This file
```

## 🔒 Security Features

- **Environment Variables** - No hardcoded secrets
- **OAuth 2.0** - Secure Discord authentication
- **Session Management** - Secure user sessions
- **Input Validation** - Prevents malicious input
- **Rate Limiting** - Respects API limits

## 🌐 Deployment Options

### ✅ Supported Platforms:
- **Railway** (Recommended - Free PHP hosting)
- **Heroku** (Free tier available)
- **InfinityFree** (Free PHP hosting)
- **000webhost** (Free PHP hosting)
- **Any PHP hosting provider**

### ❌ Not Supported:
- **GitHub Pages** (Static hosting only)
- **Netlify** (Static hosting only)
- **Vercel** (Requires serverless functions)

## 📖 Documentation

- [Deployment Options](DEPLOYMENT-OPTIONS.md)
- [Railway Deployment Guide](RAILWAY-DEPLOYMENT.md)
- [Environment Variables](.env.example)

## 🐛 Troubleshooting

### Common Issues:

**"Configuration file not found"**
- Ensure all environment variables are set
- Check variable names match exactly

**OAuth login fails**
- Verify Discord Client ID and Secret
- Check redirect URI matches Discord settings

**Bot commands fail**
- Verify bot token is correct
- Ensure Server Members Intent is enabled
- Check bot has required permissions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you find this project helpful, please give it a star! ⭐

## 🔗 Links

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Railway Deployment](https://railway.app)
- [PHP Documentation](https://php.net/docs.php)

---

**Made with ❤️ for the Discord community**
