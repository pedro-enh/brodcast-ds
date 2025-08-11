# Discord Broadcaster Pro - Web Edition

🚀 **Professional Discord Broadcasting Tool with Web Interface**

A powerful, web-based Discord broadcasting solution that allows users to send mass direct messages to Discord server members through an intuitive web interface. Built with PHP and modern web technologies.

## ✨ Features

### 🌐 Web Interface
- **Modern UI/UX**: Clean, responsive design with Discord-inspired styling
- **Real-time Progress**: Live broadcast status updates and progress tracking
- **Queue System**: Background processing for reliable message delivery
- **User Authentication**: Secure Discord OAuth2 integration

### 📨 Broadcasting Capabilities
- **Mass DM**: Send messages to all server members
- **Target Filtering**: Choose between all, online, or offline members
- **Anti-Ban Protection**: Configurable delays between messages
- **Message Personalization**: Support for user mentions and placeholders
- **Progress Tracking**: Real-time delivery status and statistics

### 💰 Payment Integration
- **Credit System**: Built-in wallet and payment processing
- **Multiple Packages**: Flexible pricing tiers
- **Transaction History**: Complete payment and usage tracking
- **Automatic Processing**: Seamless credit management

### 🔧 Technical Features
- **Queue Processing**: Background worker for reliable delivery
- **Database Management**: SQLite-based data storage
- **Error Handling**: Comprehensive error tracking and reporting
- **Rate Limiting**: Built-in Discord API rate limit protection

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- Web server (Apache/Nginx)
- SQLite support
- cURL extension
- Discord Bot Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/discord-broadcaster-pro.git
   cd discord-broadcaster-pro
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   cp config.php.example config.php
   ```

3. **Edit configuration files**
   - Update `.env` with your Discord application credentials
   - Configure `config.php` with your settings

4. **Set up Discord Application**
   - Create a Discord application at https://discord.com/developers/applications
   - Add OAuth2 redirect URL: `https://yourdomain.com/complete-auth.php`
   - Get your Client ID, Client Secret, and Bot Token

5. **Deploy to web server**
   - Upload files to your web hosting
   - Ensure proper file permissions
   - Configure your web server

6. **Start the broadcast worker** (if supported by hosting)
   ```bash
   php start-broadcast-worker.php
   ```

## 🌐 Deployment Options

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Traditional Web Hosting
1. Upload all files to your web hosting
2. Configure environment variables through hosting panel
3. Set up cron job for broadcast worker (if supported)

### VPS/Dedicated Server
1. Set up web server (Apache/Nginx)
2. Configure PHP and required extensions
3. Run broadcast worker as background service

## 📁 Project Structure

```
discord-broadcaster-pro/
├── 📄 index.php              # Main landing page
├── 📄 broadcast.php          # Broadcasting interface
├── 📄 wallet.php             # Payment and credits
├── 📄 auth.php               # Discord OAuth handler
├── 📄 database.php           # Database management
├── 📄 broadcast-queue.php    # Queue management
├── 📄 broadcast-worker.php   # Background processor
├── 📄 start-broadcast-worker.php # Worker starter
├── 📄 config.php             # Configuration
├── 📄 styles.css             # Styling
├── 📄 broadcast.js           # Frontend logic
├── 📄 .env                   # Environment variables
├── 📁 public/                # Public assets
└── 📁 release/               # Desktop version files
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_REDIRECT_URI=https://yourdomain.com/complete-auth.php
```

### Config File (config.php)
```php
<?php
return [
    'CLIENT_ID' => $_ENV['DISCORD_CLIENT_ID'],
    'CLIENT_SECRET' => $_ENV['DISCORD_CLIENT_SECRET'],
    'BOT_TOKEN' => $_ENV['DISCORD_BOT_TOKEN'],
    'REDIRECT_URI' => $_ENV['DISCORD_REDIRECT_URI'],
    'DATABASE_PATH' => 'broadcaster.db'
];
?>
```

## 🔄 Queue System

The application uses a sophisticated queue system for reliable message delivery:

### How it Works
1. **Queue Creation**: Broadcasts are added to a processing queue
2. **Background Processing**: Worker processes messages in the background
3. **Progress Tracking**: Real-time status updates via AJAX polling
4. **Error Handling**: Failed messages are tracked and reported

### Starting the Worker
```bash
# Command line
php start-broadcast-worker.php

# Or via npm script
npm run broadcast-worker
```

## 💳 Payment Integration

### Supported Features
- Credit-based system
- Multiple payment packages
- Transaction history
- Automatic credit deduction
- Payment verification

### Payment Flow
1. User selects credit package
2. Payment instructions displayed
3. User sends payment
4. System verifies and adds credits
5. Credits used for broadcasts

## 🛡️ Security Features

- **OAuth2 Authentication**: Secure Discord login
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: Discord API rate limit compliance
- **Error Handling**: Comprehensive error management
- **Session Management**: Secure session handling

## 📊 Monitoring & Analytics

- **Real-time Progress**: Live broadcast status
- **Delivery Statistics**: Success/failure rates
- **User Analytics**: Usage tracking
- **Error Reporting**: Detailed error logs

## 🔧 API Endpoints

### Broadcasting
- `POST /broadcast.php` - Queue new broadcast
- `GET /broadcast.php?action=status&id=X` - Get broadcast status
- `GET /broadcast.php?action=history` - Get user broadcast history

### Authentication
- `GET /auth.php` - Initiate Discord OAuth
- `GET /complete-auth.php` - Complete OAuth flow
- `GET /logout.php` - User logout

### Wallet
- `POST /wallet.php` - Payment operations
- `GET /wallet.php?action=balance` - Get user balance
- `GET /wallet.php?action=history` - Get transaction history

## 🚨 Troubleshooting

### Common Issues

**Bot Token Invalid**
- Verify bot token in Discord Developer Portal
- Ensure bot has necessary permissions

**Database Errors**
- Check file permissions on database directory
- Ensure SQLite extension is installed

**Worker Not Processing**
- Verify worker is running: `ps aux | grep broadcast-worker`
- Check worker logs for errors
- Restart worker if needed

**OAuth Errors**
- Verify redirect URI matches exactly
- Check client ID and secret
- Ensure application is configured correctly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Discord**: Join our support server (link in bio)

## 🔄 Updates

### Version 2.0.0
- ✅ Complete web interface
- ✅ Queue-based processing
- ✅ Payment integration
- ✅ Real-time progress tracking
- ✅ Modern responsive design

### Roadmap
- [ ] Advanced targeting options
- [ ] Scheduled broadcasts
- [ ] Template system
- [ ] Analytics dashboard
- [ ] Multi-language support

## ⚠️ Disclaimer

This tool is for educational and legitimate business purposes only. Users are responsible for complying with Discord's Terms of Service and applicable laws. The developers are not responsible for any misuse of this software.

---

**Made with ❤️ for the Discord community**

🌟 **Star this repository if you find it useful!**
