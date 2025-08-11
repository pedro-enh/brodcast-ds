// Global variables
let currentBotToken = '';
let selectedGuildId = '';
let isConnected = false;

// DOM elements
const botTokenInput = document.getElementById('botToken');
const toggleTokenBtn = document.getElementById('toggleToken');
const connectBtn = document.getElementById('connectBtn');
const serverSection = document.getElementById('serverSection');
const serverSelect = document.getElementById('serverSelect');
const messageSection = document.getElementById('messageSection');
const messageText = document.getElementById('messageText');
const charCount = document.getElementById('charCount');
const sendBtn = document.getElementById('sendBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const loadingSubtext = document.getElementById('loadingSubtext');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Toggle token visibility
    toggleTokenBtn.addEventListener('click', toggleTokenVisibility);
    
    // Connect bot
    connectBtn.addEventListener('click', connectBot);
    
    // Server selection
    serverSelect.addEventListener('change', onServerSelect);
    
    // Message input
    messageText.addEventListener('input', updateCharacterCount);
    
    // Send broadcast
    sendBtn.addEventListener('click', sendBroadcast);
    
    // Enter key shortcuts
    botTokenInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            connectBot();
        }
    });
    
    messageText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendBroadcast();
        }
    });
}

function toggleTokenVisibility() {
    const isPassword = botTokenInput.type === 'password';
    botTokenInput.type = isPassword ? 'text' : 'password';
    toggleTokenBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
}

async function connectBot() {
    const token = botTokenInput.value.trim();
    
    if (!token) {
        showToast('Please enter a bot token', 'error');
        return;
    }
    
    showLoading('Connecting Bot...', 'Verifying token and fetching servers...');
    
    try {
        // Store the token temporarily
        currentBotToken = token;
        
        // Fetch guilds
        const response = await fetch('broadcast.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_guilds',
                bot_token: currentBotToken
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            populateServerList(result.guilds);
            isConnected = true;
            updateConnectionStatus(true);
            showServerSection();
            showToast('Bot connected successfully!', 'success');
        } else {
            throw new Error(result.error || 'Failed to connect bot');
        }
    } catch (error) {
        showToast('Failed to connect bot: ' + error.message, 'error');
        currentBotToken = '';
        isConnected = false;
        updateConnectionStatus(false);
    } finally {
        hideLoading();
    }
}

function populateServerList(guilds) {
    serverSelect.innerHTML = '<option value="">Choose a server...</option>';
    
    guilds.forEach(guild => {
        const option = document.createElement('option');
        option.value = guild.id;
        option.textContent = `${guild.name} (${guild.approximate_member_count || 'Unknown'} members)`;
        serverSelect.appendChild(option);
    });
}

function showServerSection() {
    serverSection.style.display = 'block';
    serverSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function onServerSelect() {
    selectedGuildId = serverSelect.value;
    
    if (selectedGuildId) {
        showMessageSection();
    } else {
        hideMessageSection();
    }
}

function showMessageSection() {
    messageSection.style.display = 'block';
    messageSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideMessageSection() {
    messageSection.style.display = 'none';
    resultsSection.style.display = 'none';
}

function updateCharacterCount() {
    const count = messageText.value.length;
    charCount.textContent = count;
    
    if (count > 1900) {
        charCount.style.color = '#ff6b6b';
    } else if (count > 1500) {
        charCount.style.color = '#ffa726';
    } else {
        charCount.style.color = '#4caf50';
    }
}

async function sendBroadcast() {
    const message = messageText.value.trim();
    const targetType = document.querySelector('input[name="targetType"]:checked').value;
    
    if (!message) {
        showToast('Please enter a message to broadcast', 'error');
        return;
    }
    
    if (!selectedGuildId) {
        showToast('Please select a server first', 'error');
        return;
    }
    
    // Confirmation dialog
    if (!confirm(`Are you sure you want to send this message to ${targetType} members in the selected server?`)) {
        return;
    }
    
    showLoading('Sending Broadcast...', 'This may take a while depending on server size...');
    
    try {
        const response = await fetch('broadcast.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'send_broadcast',
                guild_id: selectedGuildId,
                message: message,
                target_type: targetType,
                bot_token: currentBotToken
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showResults(result);
            showToast('Broadcast completed!', 'success');
        } else {
            throw new Error(result.error || 'Failed to send broadcast');
        }
    } catch (error) {
        showToast('Failed to send broadcast: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function showResults(results) {
    document.getElementById('sentCount').textContent = results.sent_count;
    document.getElementById('failedCount').textContent = results.failed_count;
    document.getElementById('totalCount').textContent = results.total_targeted;
    
    // Show failed users if any
    if (results.failed_count > 0) {
        const failedUsersList = document.getElementById('failedUsersList');
        const failedUsers = document.getElementById('failedUsers');
        
        failedUsers.innerHTML = '';
        results.failed_users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'failed-user';
            userDiv.innerHTML = `
                <span class="user-name">${user.user}</span>
                <span class="failure-reason">${user.reason}</span>
            `;
            failedUsers.appendChild(userDiv);
        });
        
        failedUsersList.style.display = 'block';
    } else {
        document.getElementById('failedUsersList').style.display = 'none';
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateConnectionStatus(connected) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (connected) {
        statusIndicator.className = 'status-indicator online';
        statusText.textContent = 'Bot Connected';
        connectBtn.innerHTML = '<i class="fas fa-check"></i> Connected';
        connectBtn.disabled = true;
        connectBtn.className = 'btn btn-success';
    } else {
        statusIndicator.className = 'status-indicator offline';
        statusText.textContent = 'Ready to Connect Bot';
        connectBtn.innerHTML = '<i class="fas fa-plug"></i> Connect Bot';
        connectBtn.disabled = false;
        connectBtn.className = 'btn btn-primary';
    }
}

function showLoading(title, subtitle) {
    loadingText.textContent = title;
    loadingSubtext.textContent = subtitle;
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
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

function getToastIcon(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-times-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close loading overlay
    if (e.key === 'Escape' && loadingOverlay.style.display === 'flex') {
        // Don't close if actively broadcasting
        if (!loadingText.textContent.includes('Sending Broadcast')) {
            hideLoading();
        }
    }
});
