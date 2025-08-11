const express = require('express');
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const axios = require('axios');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Discord Bot Client
let discordBot = null;
let botStatus = {
    connected: false,
    user: null,
    guilds: 0,
    error: null
};

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://cdn.discordapp.com", "https://discord.com"],
            connectSrc: ["'self'", "https://discord.com", "https://discordapp.com"]
        }
    }
}));

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Discord Bot
async function initializeBot(token) {
    try {
        if (discordBot) {
            discordBot.destroy();
        }

        discordBot = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.DirectMessages
            ]
        });

        discordBot.once('ready', () => {
            console.log(`Bot logged in as ${discordBot.user.tag}`);
            botStatus = {
                connected: true,
                user: {
                    id: discordBot.user.id,
                    username: discordBot.user.username,
                    discriminator: discordBot.user.discriminator,
                    avatar: discordBot.user.displayAvatarURL()
                },
                guilds: discordBot.guilds.cache.size,
                error: null
            };
        });

        discordBot.on('error', (error) => {
            console.error('Discord bot error:', error);
            botStatus.error = error.message;
            botStatus.connected = false;
        });

        await discordBot.login(token);
        return { success: true };
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        botStatus = {
            connected: false,
            user: null,
            guilds: 0,
            error: error.message
        };
        return { success: false, error: error.message };
    }
}

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Discord OAuth login
app.get('/auth/discord', (req, res) => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.APP_URL + '/auth/discord/callback')}&response_type=code&scope=identify`;
    res.redirect(discordAuthUrl);
});

// Discord OAuth callback
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect('/?error=no_code');
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.APP_URL + '/auth/discord/callback'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = tokenResponse.data;

        // Get user information
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const userData = userResponse.data;

        // Store user data in session
        req.session.user = {
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            avatar_url: userData.avatar 
                ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`
        };

        res.redirect('/?login=success');
    } catch (error) {
        console.error('OAuth error:', error);
        res.redirect('/?error=auth_failed');
    }
});

// Logout
app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// API Routes

// Get user session
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false, error: 'Not logged in' });
    }
});

// Connect bot
app.post('/api/bot/connect', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.json({ success: false, error: 'Bot token is required' });
    }

    const result = await initializeBot(token);
    res.json(result);
});

// Get bot status
app.get('/api/bot/status', (req, res) => {
    res.json({ success: true, status: botStatus });
});

// Get bot guilds
app.get('/api/bot/guilds', (req, res) => {
    if (!discordBot || !botStatus.connected) {
        return res.json({ success: false, error: 'Bot not connected' });
    }

    const guilds = discordBot.guilds.cache.map(guild => ({
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
        icon: guild.iconURL(),
        owner: guild.ownerId === discordBot.user.id
    }));

    res.json({ success: true, guilds });
});

// Get guild members
app.get('/api/bot/guilds/:guildId/members', async (req, res) => {
    const { guildId } = req.params;
    const { status } = req.query; // 'online', 'offline', 'all'

    if (!discordBot || !botStatus.connected) {
        return res.json({ success: false, error: 'Bot not connected' });
    }

    try {
        const guild = discordBot.guilds.cache.get(guildId);
        if (!guild) {
            return res.json({ success: false, error: 'Guild not found' });
        }

        // Fetch all members
        await guild.members.fetch();

        let members = guild.members.cache
            .filter(member => !member.user.bot)
            .map(member => ({
                id: member.user.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                avatar: member.user.displayAvatarURL(),
                status: member.presence?.status || 'offline',
                nickname: member.nickname
            }));

        // Filter by status if specified
        if (status && status !== 'all') {
            members = members.filter(member => member.status === status);
        }

        res.json({ 
            success: true, 
            members,
            total: members.length,
            guild: {
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount
            }
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.json({ success: false, error: error.message });
    }
});

// Send mass DM
app.post('/api/bot/broadcast', async (req, res) => {
    const { guildId, message, targetStatus, delay, maxConcurrent } = req.body;

    if (!discordBot || !botStatus.connected) {
        return res.json({ success: false, error: 'Bot not connected' });
    }

    if (!message || !guildId) {
        return res.json({ success: false, error: 'Message and guild ID are required' });
    }

    try {
        const guild = discordBot.guilds.cache.get(guildId);
        if (!guild) {
            return res.json({ success: false, error: 'Guild not found' });
        }

        // Fetch all members
        await guild.members.fetch();

        let targetMembers = guild.members.cache
            .filter(member => !member.user.bot)
            .filter(member => {
                if (targetStatus === 'all') return true;
                return member.presence?.status === targetStatus;
            })
            .map(member => member.user);

        const results = {
            total: targetMembers.size,
            sent: 0,
            failed: 0,
            errors: []
        };

        // Send DMs with rate limiting
        const delayMs = parseInt(delay) || 1000;
        const concurrent = parseInt(maxConcurrent) || 5;
        
        const chunks = [];
        const membersArray = Array.from(targetMembers.values());
        
        for (let i = 0; i < membersArray.length; i += concurrent) {
            chunks.push(membersArray.slice(i, i + concurrent));
        }

        for (const chunk of chunks) {
            const promises = chunk.map(async (user) => {
                try {
                    await user.send(message);
                    results.sent++;
                    return { success: true, user: user.username };
                } catch (error) {
                    results.failed++;
                    results.errors.push({
                        user: user.username,
                        error: error.message
                    });
                    return { success: false, user: user.username, error: error.message };
                }
            });

            await Promise.allSettled(promises);
            
            // Delay between chunks
            if (chunks.indexOf(chunk) < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        res.json({ success: true, results });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.json({ success: false, error: error.message });
    }
});

// Send test message
app.post('/api/bot/test-message', async (req, res) => {
    const { userId, message } = req.body;

    if (!discordBot || !botStatus.connected) {
        return res.json({ success: false, error: 'Bot not connected' });
    }

    if (!message || !userId) {
        return res.json({ success: false, error: 'Message and user ID are required' });
    }

    try {
        const user = await discordBot.users.fetch(userId);
        await user.send(message);
        res.json({ success: true, message: 'Test message sent successfully' });
    } catch (error) {
        console.error('Test message error:', error);
        res.json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Discord Broadcaster Pro running on port ${PORT}`);
    console.log(`🌐 Access at: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
    
    // Initialize bot if token is provided
    if (process.env.DISCORD_BOT_TOKEN) {
        console.log('🤖 Initializing Discord bot...');
        initializeBot(process.env.DISCORD_BOT_TOKEN);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (discordBot) {
        discordBot.destroy();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (discordBot) {
        discordBot.destroy();
    }
    process.exit(0);
});
