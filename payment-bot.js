const { Client, GatewayIntentBits } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuration
const BOT_TOKEN = process.env.PAYMENT_BOT_TOKEN || 'YOUR_PAYMENT_BOT_TOKEN';
const PROBOT_ID = '282859044593598464'; // ProBot's official ID
const RECIPIENT_ID = '675332512414695441'; // The user who receives payments
const CREDITS_PER_PAYMENT = 10; // Credits given per 5000 ProBot credits
const REQUIRED_AMOUNT = 5000; // Required ProBot credits

// Database setup
const dbPath = path.join(__dirname, 'broadcaster.db');
const db = new sqlite3.Database(dbPath);

// Discord client setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Bot ready event
client.once('ready', () => {
    console.log(`Payment monitoring bot is ready! Logged in as ${client.user.tag}`);
    console.log(`Monitoring ProBot transactions for user: ${RECIPIENT_ID}`);
    
    // Set bot status
    client.user.setActivity('ProBot transactions', { type: 'WATCHING' });
});

// Message event handler
client.on('messageCreate', async (message) => {
    // Only process messages from ProBot
    if (message.author.id !== PROBOT_ID) return;
    
    // Only process embed messages (ProBot uses embeds for credit transfers)
    if (!message.embeds || message.embeds.length === 0) return;
    
    const embed = message.embeds[0];
    
    // Check if this is a credit transfer notification
    if (!embed.description || !embed.description.includes('transferred')) return;
    
    try {
        await processProBotTransaction(message, embed);
    } catch (error) {
        console.error('Error processing ProBot transaction:', error);
    }
});

async function processProBotTransaction(message, embed) {
    const description = embed.description;
    
    // Parse the transaction details
    // ProBot format: "**User** transferred **amount** credits to **recipient**"
    const transferRegex = /\*\*(.+?)\*\* transferred \*\*(\d+(?:,\d+)*)\*\* credits to \*\*(.+?)\*\*/;
    const match = description.match(transferRegex);
    
    if (!match) {
        console.log('Could not parse ProBot transaction format');
        return;
    }
    
    const [, senderName, amountStr, recipientName] = match;
    const amount = parseInt(amountStr.replace(/,/g, ''));
    
    console.log(`ProBot transaction detected:`);
    console.log(`- Sender: ${senderName}`);
    console.log(`- Amount: ${amount} credits`);
    console.log(`- Recipient: ${recipientName}`);
    
    // Check if the recipient is our target user
    if (!description.includes(RECIPIENT_ID)) {
        console.log('Transaction not for our recipient, ignoring');
        return;
    }
    
    // Check if the amount meets our requirement
    if (amount < REQUIRED_AMOUNT) {
        console.log(`Amount ${amount} is less than required ${REQUIRED_AMOUNT}, ignoring`);
        return;
    }
    
    // Try to extract sender's Discord ID from the message
    const senderMention = message.content.match(/<@!?(\d+)>/);
    let senderId = null;
    
    if (senderMention) {
        senderId = senderMention[1];
    } else {
        // Try to find the sender ID from the embed or message context
        // This might require additional parsing depending on ProBot's format
        console.log('Could not extract sender Discord ID from message');
        return;
    }
    
    console.log(`Processing payment from Discord ID: ${senderId}`);
    
    // Check if we have a pending payment monitoring for this user
    const paymentMonitoring = await checkPaymentMonitoring(senderId, amount);
    
    if (paymentMonitoring) {
        console.log(`Found pending payment monitoring for user ${senderId}`);
        await processPayment(senderId, amount, paymentMonitoring.id, message.id);
    } else {
        console.log(`No pending payment monitoring found for user ${senderId} with amount ${amount}`);
        // Still process the payment but without specific monitoring
        await processPayment(senderId, amount, null, message.id);
    }
}

function checkPaymentMonitoring(discordId, amount) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM payment_monitoring 
            WHERE discord_id = ? AND expected_amount = ? AND status = 'waiting' 
            AND expires_at > datetime('now')
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        
        db.get(query, [discordId, amount], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function processPayment(discordId, amount, monitoringId, transactionId) {
    try {
        // Calculate credits to give
        const creditsToGive = Math.floor(amount / REQUIRED_AMOUNT) * CREDITS_PER_PAYMENT;
        
        console.log(`Giving ${creditsToGive} credits to user ${discordId}`);
        
        // Start database transaction
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                
                // Check if user exists, create if not
                const checkUserQuery = 'SELECT id FROM users WHERE discord_id = ?';
                db.get(checkUserQuery, [discordId], (err, user) => {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    
                    if (!user) {
                        // Create user with minimal info
                        const createUserQuery = `
                            INSERT INTO users (discord_id, username, discriminator, credits, created_at, updated_at)
                            VALUES (?, 'Unknown', '0000', ?, datetime('now'), datetime('now'))
                        `;
                        
                        db.run(createUserQuery, [discordId, creditsToGive], function(err) {
                            if (err) {
                                db.run('ROLLBACK');
                                reject(err);
                                return;
                            }
                            
                            const userId = this.lastID;
                            finishTransaction(userId);
                        });
                    } else {
                        // Update existing user
                        const updateUserQuery = `
                            UPDATE users 
                            SET credits = credits + ?, updated_at = datetime('now')
                            WHERE id = ?
                        `;
                        
                        db.run(updateUserQuery, [creditsToGive, user.id], (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                reject(err);
                                return;
                            }
                            
                            finishTransaction(user.id);
                        });
                    }
                });
                
                function finishTransaction(userId) {
                    // Record transaction
                    const transactionQuery = `
                        INSERT INTO transactions (user_id, discord_id, type, amount, description, probot_transaction_id, status, created_at)
                        VALUES (?, ?, 'purchase', ?, ?, ?, 'completed', datetime('now'))
                    `;
                    
                    const description = `ProBot credit purchase - ${amount} credits received`;
                    
                    db.run(transactionQuery, [userId, discordId, creditsToGive, description, transactionId], (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        
                        // Mark payment monitoring as received if exists
                        if (monitoringId) {
                            const updateMonitoringQuery = `
                                UPDATE payment_monitoring 
                                SET status = 'received' 
                                WHERE id = ?
                            `;
                            
                            db.run(updateMonitoringQuery, [monitoringId], (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    reject(err);
                                    return;
                                }
                                
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        } else {
                            db.run('COMMIT', (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        }
                    });
                }
            });
        });
        
        console.log(`Successfully processed payment for user ${discordId}: +${creditsToGive} credits`);
        
        // Try to notify the user (if they're in a mutual server)
        try {
            const user = await client.users.fetch(discordId);
            if (user) {
                await user.send(`🎉 **Payment Received!**\n\nYour ProBot credit transfer of **${amount.toLocaleString()}** credits has been processed.\n\n✅ **${creditsToGive} broadcast credits** have been added to your wallet!\n\nYou can now use these credits at: https://your-domain.com/broadcast.php`);
            }
        } catch (dmError) {
            console.log(`Could not send DM to user ${discordId}:`, dmError.message);
        }
        
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}

// Error handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
    console.log('Shutting down payment monitoring bot...');
    client.destroy();
    db.close();
    process.exit(0);
});

// Start the bot
if (BOT_TOKEN && BOT_TOKEN !== 'YOUR_PAYMENT_BOT_TOKEN') {
    client.login(BOT_TOKEN);
} else {
    console.error('Please set the PAYMENT_BOT_TOKEN environment variable');
    process.exit(1);
}

module.exports = client;
