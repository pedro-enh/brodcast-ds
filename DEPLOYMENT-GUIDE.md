# Discord Broadcaster Pro - InfinityFree Deployment Guide

This guide will help you deploy Discord Broadcaster Pro to InfinityFree hosting at `brodcast-discord-pro.42web.io`.

## 📋 Prerequisites

1. InfinityFree hosting account
2. Discord Developer Application
3. FTP client (FileZilla recommended)

## 🚀 Step 1: Discord Application Setup

### Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Discord Broadcaster Pro"
4. Click "Create"

### Configure OAuth2
1. Go to **OAuth2** section
2. Add this redirect URL:
   ```
   https://brodcast-discord-pro.42web.io/auth.php
   ```
3. Copy your **Client ID** and **Client Secret**

### Create Bot (Optional)
1. Go to **Bot** section
2. Click "Add Bot"
3. Copy the **Bot Token**
4. Enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Presence Intent

## 📁 Step 2: Prepare Files for Upload

### Files to Upload to InfinityFree:
```
📁 htdocs/
├── index.php          ✅ Main page
├── login.php          ✅ Login handler
├── auth.php           ✅ OAuth callback
├── logout.php         ✅ Logout handler
├── styles.css         ✅ Stylesheet
├── config.php         ✅ Configuration (create from example)
└── .htaccess          ✅ URL rewriting (optional)
```

### Create config.php
1. Copy `config.php.example` to `config.php`
2. Edit `config.php` with your Discord credentials:
   ```php
   <?php
   return [
       'DISCORD_CLIENT_ID' => 'your_actual_client_id',
       'DISCORD_CLIENT_SECRET' => 'your_actual_client_secret',
       'REDIRECT_URI' => 'https://brodcast-discord-pro.42web.io/auth.php',
       'BOT_TOKEN' => 'your_bot_token_if_needed'
   ];
   ?>
   ```

## 🌐 Step 3: Upload to InfinityFree

### Using FileZilla (Recommended)
1. Download and install [FileZilla](https://filezilla-project.org/)
2. Get FTP credentials from InfinityFree control panel
3. Connect to your hosting:
   - **Host:** Your FTP server (e.g., ftpupload.net)
   - **Username:** Your FTP username
   - **Password:** Your FTP password
   - **Port:** 21

### Upload Files
1. Navigate to `/htdocs/` folder on the server
2. Upload these files:
   - `index.php`
   - `login.php`
   - `auth.php`
   - `logout.php`
   - `styles.css`
   - `config.php` (with your credentials)

## 🔧 Step 4: Update Configuration Files

### Update all PHP files to use config.php
Replace the hardcoded config arrays in each PHP file:

**In index.php, login.php, auth.php:**
```php
// Replace this:
$config = [
    'DISCORD_CLIENT_ID' => 'YOUR_DISCORD_CLIENT_ID',
    // ...
];

// With this:
$config = require_once 'config.php';
```

## ✅ Step 5: Test Your Deployment

1. Visit `https://brodcast-discord-pro.42web.io`
2. You should see the welcome page
3. Click "Login with Discord"
4. Complete Discord OAuth flow
5. You should be redirected back with your Discord profile

## 🚨 Important Limitations

### InfinityFree Restrictions:
- ❌ **No Node.js support** - Only PHP/HTML/CSS/JS
- ❌ **No real-time bot connections** - Discord.js requires Node.js
- ❌ **No WebSocket support** - Limited real-time features
- ❌ **No background processes** - Can't run persistent bots

### What Works:
- ✅ **Discord OAuth login** - User authentication
- ✅ **Beautiful UI** - Full responsive design
- ✅ **User profiles** - Display Discord avatars and usernames
- ✅ **Static content** - Information and setup guides

## 🔄 Alternative Solutions

For full bot functionality, consider these alternatives:

### 1. **Local Development** (Recommended)
- Run the Node.js version locally
- Full bot functionality
- Real-time broadcasting
- Complete Discord API access

### 2. **Node.js Hosting Services**
- **Heroku** (Free tier available)
- **Railway** (Free tier available)
- **Render** (Free tier available)
- **Vercel** (Free tier available)

### 3. **VPS Hosting**
- **DigitalOcean** ($5/month)
- **Linode** ($5/month)
- **Vultr** ($2.50/month)

## 🛠️ Troubleshooting

### Common Issues:

**1. "OAuth Failed" Error**
- Check Discord Client ID and Secret
- Verify redirect URI matches exactly
- Ensure config.php has correct credentials

**2. "Page Not Found" Error**
- Check file names are correct
- Ensure files are in `/htdocs/` directory
- Verify FTP upload was successful

**3. "Session Issues"**
- InfinityFree supports PHP sessions
- Clear browser cookies and try again
- Check PHP error logs in control panel

**4. "Permission Denied"**
- Set file permissions to 644 for PHP files
- Set directory permissions to 755

## 📞 Support

If you encounter issues:

1. Check InfinityFree documentation
2. Review Discord Developer Portal settings
3. Test locally first with the Node.js version
4. Consider upgrading to a Node.js hosting service for full functionality

## 🎯 Next Steps

1. Upload files to InfinityFree
2. Configure Discord application
3. Test OAuth login flow
4. For full bot features, consider Node.js hosting

---

**Note:** This PHP version provides a beautiful interface and Discord authentication, but for actual message broadcasting, you'll need the Node.js version on a compatible hosting service.
