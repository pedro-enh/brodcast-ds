<?php
session_start();

// Load configuration
try {
    $config = require_once 'config.php';
} catch (Exception $e) {
    die('Configuration file not found. Please check your environment variables.');
}

// Check if user is logged in
$user = isset($_SESSION['discord_user']) ? $_SESSION['discord_user'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discord Broadcaster Pro</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <i class="fab fa-discord"></i>
                    <h1>Discord Broadcaster Pro</h1>
                </div>
                <div class="user-section" id="userSection">
                    <?php if (!$user): ?>
                    <!-- Login button (shown when not logged in) -->
                    <div class="login-section" id="loginSection">
                        <a href="login.php" class="btn btn-discord">
                            <i class="fab fa-discord"></i>
                            Login with Discord
                        </a>
                    </div>
                    <?php else: ?>
                    <!-- User profile (shown when logged in) -->
                    <div class="user-profile" id="userProfile">
                        <div class="user-info">
                            <img src="<?php echo htmlspecialchars($user['avatar_url']); ?>" alt="User Avatar" class="user-avatar">
                            <div class="user-details">
                                <span class="user-name"><?php echo htmlspecialchars($user['username'] . '#' . $user['discriminator']); ?></span>
                                <div class="connection-status" id="connectionStatus">
                                    <span class="status-indicator offline"></span>
                                    <span class="status-text">Ready to Connect Bot</span>
                                </div>
                            </div>
                        </div>
                        <a href="broadcast.php" class="btn btn-primary btn-small">
                            <i class="fas fa-broadcast-tower"></i>
                            Start Broadcasting
                        </a>
                        <a href="logout.php" class="btn btn-secondary btn-small">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </a>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <?php if (!$user): ?>
            <!-- Welcome/Login Message -->
            <section class="card welcome-card">
                <div class="card-header">
                    <h2><i class="fab fa-discord"></i> Welcome to Discord Broadcaster Pro</h2>
                </div>
                <div class="card-body">
                    <div class="welcome-content">
                        <p>Please login with your Discord account to access the broadcasting features.</p>
                        <div class="features-list">
                            <div class="feature-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure Discord OAuth Authentication</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-broadcast-tower"></i>
                                <span>Mass Direct Message Broadcasting</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-users"></i>
                                <span>Target Online/Offline/All Members</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-robot"></i>
                                <span>Bot Integration & Management</span>
                            </div>
                        </div>
                        <a href="login.php" class="btn btn-discord btn-large">
                            <i class="fab fa-discord"></i>
                            Get Started - Login with Discord
                        </a>
                    </div>
                </div>
            </section>
            <?php else: ?>
            <!-- Bot Connection Section -->
            <section class="card connection-card">
                <div class="card-header">
                    <h2><i class="fas fa-robot"></i> Bot Configuration</h2>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <strong>Note:</strong> Due to hosting limitations, this version uses a simplified interface. 
                        For full bot functionality, please use the local Node.js version.
                    </div>
                    
                    <div class="input-group">
                        <label for="botToken">Discord Bot Token</label>
                        <div class="input-wrapper">
                            <input type="password" id="botToken" placeholder="Enter your Discord bot token..." class="input-field">
                            <button type="button" id="toggleToken" class="toggle-btn">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button id="connectBtn" class="btn btn-primary" onclick="testBotConnection()">
                            <i class="fas fa-plug"></i>
                            Test Bot Connection
                        </button>
                        <button id="helpBtn" class="btn btn-info" onclick="toggleHelp()">
                            <i class="fas fa-question-circle"></i>
                            Bot Setup Help
                        </button>
                    </div>
                    
                    <!-- Bot Setup Help -->
                    <div class="help-section" id="helpSection" style="display: none;">
                        <h3><i class="fas fa-info-circle"></i> Bot Setup Instructions</h3>
                        <ol>
                            <li>Go to <a href="https://discord.com/developers/applications" target="_blank">Discord Developer Portal</a></li>
                            <li>Create a new application or select existing one</li>
                            <li>Go to "Bot" section and create a bot</li>
                            <li>Copy the bot token and paste it above</li>
                            <li>Enable these <strong>Privileged Gateway Intents</strong>:
                                <ul>
                                    <li>✅ Server Members Intent</li>
                                    <li>✅ Presence Intent</li>
                                </ul>
                            </li>
                            <li>Add bot to your server with these permissions:
                                <ul>
                                    <li>✅ Send Messages</li>
                                    <li>✅ Read Message History</li>
                                    <li>✅ View Channels</li>
                                </ul>
                            </li>
                        </ol>
                        <p><strong>Note:</strong> For full functionality, download and run the Node.js version locally.</p>
                    </div>
                </div>
            </section>

            <!-- Bot Features Section -->
            <section class="card features-card">
                <div class="card-header">
                    <h2><i class="fas fa-cogs"></i> Available Bot Features</h2>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <strong>Web Version Features:</strong> These features work with basic Discord API calls.
                    </div>
                    
                    <div class="feature-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-server"></i>
                            </div>
                            <h4>Bot Information</h4>
                            <p>Get basic bot details and status</p>
                            <button class="btn btn-outline" onclick="getBotInfo()">
                                <i class="fas fa-info"></i> Get Bot Info
                            </button>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h4>Server List</h4>
                            <p>View servers your bot is in</p>
                            <button class="btn btn-outline" onclick="getServerList()">
                                <i class="fas fa-list"></i> List Servers
                            </button>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-paper-plane"></i>
                            </div>
                            <h4>Send Message</h4>
                            <p>Send a test message to a channel</p>
                            <button class="btn btn-outline" onclick="showSendMessage()">
                                <i class="fas fa-paper-plane"></i> Send Message
                            </button>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-download"></i>
                            </div>
                            <h4>Full Version</h4>
                            <p>Download Node.js version for all features</p>
                            <button class="btn btn-outline" onclick="showDownloadInfo()">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                    
                    <!-- Results Area -->
                    <div id="resultsArea" class="results-area" style="display: none;">
                        <h4>Results:</h4>
                        <div id="resultsContent" class="results-content"></div>
                    </div>
                    
                    <!-- Send Message Form -->
                    <div id="sendMessageForm" class="send-message-form" style="display: none;">
                        <h4>Send Test Message</h4>
                        <div class="input-group">
                            <label for="channelId">Channel ID</label>
                            <input type="text" id="channelId" placeholder="Enter Discord channel ID..." class="input-field">
                        </div>
                        <div class="input-group">
                            <label for="messageText">Message</label>
                            <textarea id="messageText" placeholder="Enter your message..." class="input-field" rows="3"></textarea>
                        </div>
                        <div class="button-group">
                            <button class="btn btn-primary" onclick="sendTestMessage()">
                                <i class="fas fa-paper-plane"></i> Send Message
                            </button>
                            <button class="btn btn-secondary" onclick="hideSendMessage()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <?php endif; ?>
        </main>

        <!-- Toast Notifications -->
        <div class="toast-container" id="toastContainer"></div>
    </div>

    <script>
        // Toggle token visibility
        document.getElementById('toggleToken')?.addEventListener('click', function() {
            const tokenInput = document.getElementById('botToken');
            const isPassword = tokenInput.type === 'password';
            tokenInput.type = isPassword ? 'text' : 'password';
            this.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });

        // Toggle help section
        function toggleHelp() {
            const helpSection = document.getElementById('helpSection');
            const isVisible = helpSection.style.display !== 'none';
            helpSection.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                helpSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        // Test bot connection
        async function testBotConnection() {
            const botToken = document.getElementById('botToken').value;
            if (!botToken) {
                showToast('Please enter a bot token first.', 'warning');
                return;
            }
            
            showToast('Testing bot connection...', 'info');
            
            try {
                const response = await fetch('bot-api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'test_connection',
                        token: botToken
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showToast('Bot connection successful!', 'success');
                    document.getElementById('connectionStatus').innerHTML = 
                        '<span class="status-indicator online"></span><span class="status-text">Bot Connected</span>';
                } else {
                    showToast('Bot connection failed: ' + result.error, 'error');
                }
            } catch (error) {
                showToast('Connection test failed: ' + error.message, 'error');
            }
        }
        
        // Get bot information
        async function getBotInfo() {
            const botToken = document.getElementById('botToken').value;
            if (!botToken) {
                showToast('Please enter a bot token first.', 'warning');
                return;
            }
            
            try {
                const response = await fetch('bot-api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'get_bot_info',
                        token: botToken
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showResults(result.data);
                } else {
                    showToast('Failed to get bot info: ' + result.error, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        
        // Get server list
        async function getServerList() {
            const botToken = document.getElementById('botToken').value;
            if (!botToken) {
                showToast('Please enter a bot token first.', 'warning');
                return;
            }
            
            try {
                const response = await fetch('bot-api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'get_servers',
                        token: botToken
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showResults(result.data);
                } else {
                    showToast('Failed to get servers: ' + result.error, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        
        // Show send message form
        function showSendMessage() {
            document.getElementById('sendMessageForm').style.display = 'block';
            document.getElementById('sendMessageForm').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Hide send message form
        function hideSendMessage() {
            document.getElementById('sendMessageForm').style.display = 'none';
        }
        
        // Send test message
        async function sendTestMessage() {
            const botToken = document.getElementById('botToken').value;
            const channelId = document.getElementById('channelId').value;
            const messageText = document.getElementById('messageText').value;
            
            if (!botToken || !channelId || !messageText) {
                showToast('Please fill in all fields.', 'warning');
                return;
            }
            
            try {
                const response = await fetch('bot-api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'send_message',
                        token: botToken,
                        channel_id: channelId,
                        message: messageText
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showToast('Message sent successfully!', 'success');
                    hideSendMessage();
                } else {
                    showToast('Failed to send message: ' + result.error, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        
        // Show download info
        function showDownloadInfo() {
            showToast('For full bot functionality, download the Node.js version and run locally.', 'info');
        }
        
        // Show results
        function showResults(data) {
            const resultsArea = document.getElementById('resultsArea');
            const resultsContent = document.getElementById('resultsContent');
            
            resultsContent.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            resultsArea.style.display = 'block';
            resultsArea.scrollIntoView({ behavior: 'smooth' });
        }

        // Toast notification function
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            
            const container = document.getElementById('toastContainer');
            container.appendChild(toast);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideIn 0.3s ease reverse';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            container.removeChild(toast);
                        }
                    }, 300);
                }
            }, 5000);
        }

        // Show login success message if redirected from auth
        <?php if (isset($_GET['login']) && $_GET['login'] === 'success'): ?>
        showToast('Successfully logged in with Discord!', 'success');
        <?php endif; ?>
    </script>
</body>
</html>
