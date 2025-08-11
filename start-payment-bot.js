#!/usr/bin/env node

/**
 * Discord Broadcaster Pro - Payment Bot Starter
 * This script starts the payment monitoring bot
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('📝 Please copy .env.example to .env and configure your settings:');
    console.log('   cp .env.example .env');
    console.log('');
    console.log('🔧 Required environment variables:');
    console.log('   - PAYMENT_BOT_TOKEN: Your Discord bot token for payment monitoring');
    console.log('   - RECIPIENT_ID: Discord user ID that receives ProBot credits');
    process.exit(1);
}

// Check required environment variables
const requiredVars = ['PAYMENT_BOT_TOKEN'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.log('');
    console.log('📝 Please update your .env file with the missing variables.');
    process.exit(1);
}

// Check if database file exists, create directory if needed
const dbPath = process.env.DATABASE_PATH || 'broadcaster.db';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir) && dbDir !== '.') {
    fs.mkdirSync(dbDir, { recursive: true });
}

console.log('🚀 Starting Discord Broadcaster Pro Payment Bot...');
console.log('');
console.log('📊 Configuration:');
console.log(`   - Bot Token: ${process.env.PAYMENT_BOT_TOKEN ? '✅ Configured' : '❌ Missing'}`);
console.log(`   - Recipient ID: ${process.env.RECIPIENT_ID || '675332512414695441'}`);
console.log(`   - Credits per Payment: ${process.env.CREDITS_PER_PAYMENT || '10'}`);
console.log(`   - Required Amount: ${process.env.REQUIRED_AMOUNT || '5000'} ProBot Credits`);
console.log(`   - Database: ${dbPath}`);
console.log('');

// Start the payment bot
try {
    require('./payment-bot.js');
} catch (error) {
    console.error('❌ Failed to start payment bot:', error.message);
    
    if (error.code === 'MODULE_NOT_FOUND') {
        console.log('');
        console.log('📦 Missing dependencies. Please install them:');
        console.log('   npm install');
    }
    
    process.exit(1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down payment bot...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down payment bot...');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
