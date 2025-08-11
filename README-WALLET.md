# Discord Broadcaster Pro - Web Version with Wallet System

A professional Discord broadcasting tool with a complete web interface and ProBot Credits payment system.

## 🌟 Features

### 💰 Wallet System
- **ProBot Credits Integration**: Pay with ProBot credits for broadcast messages
- **Automatic Payment Detection**: Bot automatically detects and processes payments
- **Real-time Credit Updates**: Instant credit addition to user wallets
- **Transaction History**: Complete history of all purchases and usage
- **Secure Payment Processing**: Safe and reliable payment system

### 📡 Broadcasting Features
- **Mass Direct Messages**: Send messages to all server members
- **Smart Targeting**: Target online/offline members specifically
- **Anti-Ban Protection**: Built-in delays and safety measures
- **Real-time Progress**: Live updates during broadcast operations
- **Detailed Statistics**: Complete success/failure reports

### 🔐 Security & Authentication
- **Discord OAuth2**: Secure login with Discord
- **Session Management**: Persistent user sessions
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive security measures

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- SQLite support
- Discord Application with OAuth2
- ProBot Credits payment system access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/discord-broadcaster-pro.git
cd discord-broadcaster-pro
```

2. **Configure Discord Application**
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application
- Add OAuth2 redirect URL: `https://yourdomain.com/auth.php`
- Copy Client ID and Client Secret

3. **Setup Configuration**
```bash
cp config.php.example config.php
```

Edit `config.php` with your settings:
```php
<?php
return [
    'discord' => [
        'client_id' => 'YOUR_DISCORD_CLIENT_ID',
        'client_secret' => 'YOUR_DISCORD_CLIENT_SECRET',
        'redirect_uri' => 'https://yourdomain.com/auth.php',
        'bot_token' => 'YOUR_BOT_TOKEN'
    ],
    'app' => [
        'url' => 'https://yourdomain.com',
        'name' => 'Discord Broadcaster Pro'
    ]
];
?>
```

4. **Setup Payment Bot (Optional)**
```bash
# Install Node.js dependencies
npm install

# Configure payment bot
cp .env.example .env
```

Edit `.env`:
```
PAYMENT_BOT_TOKEN=your_payment_bot_token_here
```

5. **Deploy to Railway**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

Or manually:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 💳 Payment System

### How It Works

1. **User Purchases Credits**
   - User clicks "Purchase Now" in wallet
   - System generates payment instructions
   - User sends ProBot credits to specified ID

2. **Automatic Detection**
   - Payment bot monitors ProBot transactions
   - Automatically detects payments to recipient ID
   - Adds credits to user's wallet instantly

3. **Credit Usage**
   - 1 credit = 1 broadcast message
   - Credits deducted automatically during broadcasts
   - Real-time balance updates

### Pricing
- **5,000 ProBot Credits** = **10 Broadcast Messages**
- Instant activation
- No expiration
- Secure transactions

## 🛠️ File Structure

```
discord-broadcaster-pro/
├── 📁 public/              # Public web assets
├── 📄 index.php           # Main dashboard
├── 📄 auth.php            # Discord OAuth handler
├── 📄 wallet.php          # Wallet management
├── 📄 broadcast.php       # Broadcasting interface
├── 📄 database.php        # Database handler
├── 📄 payment-bot.js      # Payment monitoring bot
├── 📄 config.php          # Configuration
├── 📄 styles.css          # Styling
└── 📄 wallet.js           # Wallet JavaScript
```

## 🔧 Configuration Options

### Discord Settings
```php
'discord' => [
    'client_id' => 'YOUR_CLIENT_ID',
    'client_secret' => 'YOUR_CLIENT_SECRET',
    'redirect_uri' => 'https://yourdomain.com/auth.php',
    'bot_token' => 'YOUR_BOT_TOKEN'
]
```

### Payment Settings
```php
'payment' => [
    'recipient_id' => '675332512414695441',
    'credits_per_payment' => 10,
    'required_amount' => 5000
]
```

### Security Settings
```php
'security' => [
    'session_timeout' => 3600,
    'max_message_length' => 2000,
    'rate_limit' => 100
]
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    credits INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Broadcasts Table
```sql
CREATE TABLE broadcasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    guild_id TEXT NOT NULL,
    message TEXT NOT NULL,
    messages_sent INTEGER DEFAULT 0,
    credits_used INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Features

### Authentication
- Discord OAuth2 integration
- Secure session management
- CSRF protection
- Input sanitization

### Rate Limiting
- Request rate limiting
- Broadcast cooldowns
- Anti-spam measures
- User-based restrictions

### Data Protection
- SQLite database encryption
- Secure credential storage
- Session encryption
- XSS protection

## 🚀 Deployment

### Railway Deployment

1. **Connect Repository**
   - Fork this repository
   - Connect to Railway
   - Configure environment variables

2. **Environment Variables**
```
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_BOT_TOKEN=your_bot_token
PAYMENT_BOT_TOKEN=your_payment_bot_token
APP_URL=https://your-app.railway.app
```

3. **Deploy**
   - Railway automatically builds and deploys
   - Database is created automatically
   - SSL certificate is provided

### Manual Deployment

1. **Web Server Setup**
   - Apache/Nginx with PHP support
   - SQLite extension enabled
   - SSL certificate configured

2. **File Permissions**
```bash
chmod 755 *.php
chmod 644 *.css *.js
chmod 666 broadcaster.db
```

3. **Database Initialization**
   - Database is created automatically on first run
   - Tables are created by the Database class

## 📱 Usage Guide

### For Users

1. **Login**
   - Visit the website
   - Click "Login with Discord"
   - Authorize the application

2. **Purchase Credits**
   - Go to Wallet section
   - Click "Purchase Now"
   - Follow payment instructions
   - Credits added automatically

3. **Send Broadcasts**
   - Go to Broadcast section
   - Select target server
   - Choose targeting options
   - Write your message
   - Send broadcast

### For Administrators

1. **Monitor Payments**
   - Payment bot runs automatically
   - Check logs for payment processing
   - Monitor user transactions

2. **Manage Users**
   - View user statistics
   - Check broadcast history
   - Monitor credit usage

## 🔧 Troubleshooting

### Common Issues

**Payment Not Detected**
- Check payment bot is running
- Verify ProBot transaction format
- Check recipient ID matches

**Discord Authentication Failed**
- Verify client ID and secret
- Check redirect URI configuration
- Ensure bot has proper permissions

**Database Errors**
- Check SQLite extension is enabled
- Verify file permissions
- Check disk space

### Debug Mode

Enable debug mode in `config.php`:
```php
'debug' => true
```

This will show detailed error messages and logs.

## 📞 Support

### Getting Help
- Check the troubleshooting section
- Review configuration settings
- Check server logs for errors

### Feature Requests
- Open an issue on GitHub
- Describe the requested feature
- Provide use case examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔄 Updates

### Version 2.0.0
- Added wallet system
- ProBot Credits integration
- Automatic payment processing
- Enhanced security features
- Improved user interface

### Upcoming Features
- Multiple payment methods
- Advanced targeting options
- Scheduled broadcasts
- Analytics dashboard
- API access

---

**Discord Broadcaster Pro** - Professional broadcasting made simple and secure.
