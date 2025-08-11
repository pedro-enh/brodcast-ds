// Global variables
let currentPaymentId = null;
let paymentTimer = null;
let paymentTimeLeft = 1800; // 30 minutes in seconds

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWallet();
});

function initializeWallet() {
    // Load wallet info
    loadWalletInfo();
    
    // Set up auto-refresh for wallet info every 30 seconds
    setInterval(loadWalletInfo, 30000);
}

async function loadWalletInfo() {
    try {
        const response = await fetch('wallet.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_wallet_info'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            updateWalletDisplay(result.stats);
        }
    } catch (error) {
        console.error('Failed to load wallet info:', error);
    }
}

function updateWalletDisplay(stats) {
    // Update credit display
    const creditElements = document.querySelectorAll('.stat-card.primary .stat-info h3');
    if (creditElements.length > 0) {
        creditElements[0].textContent = numberFormat(stats.credits || 0);
    }
    
    // Update messages remaining
    const messageElements = document.querySelectorAll('.stat-card.primary .stat-info small');
    if (messageElements.length > 0) {
        messageElements[0].textContent = `${stats.credits || 0} messages remaining`;
    }
    
    // Update total messages sent
    const sentElements = document.querySelectorAll('.stat-card.success .stat-info h3');
    if (sentElements.length > 0) {
        sentElements[0].textContent = numberFormat(stats.total_messages_sent || 0);
    }
    
    // Update broadcasts completed
    const broadcastElements = document.querySelectorAll('.stat-card.success .stat-info small');
    if (broadcastElements.length > 0) {
        broadcastElements[0].textContent = `${stats.total_broadcasts || 0} broadcasts completed`;
    }
    
    // Update total spent
    const spentElements = document.querySelectorAll('.stat-card.info .stat-info h3');
    if (spentElements.length > 0) {
        spentElements[0].textContent = numberFormat(stats.total_spent || 0);
    }
}

async function startPaymentProcess(amount, credits) {
    try {
        const response = await fetch('wallet.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create_payment_request',
                amount: amount,
                credits: credits
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentPaymentId = result.payment_id;
            showPaymentModal(result.amount, result.credits, result.recipient_id);
            startPaymentTimer();
            startPaymentMonitoring();
        } else {
            showToast('Failed to create payment request: ' + result.error, 'error');
        }
    } catch (error) {
        showToast('Error creating payment request: ' + error.message, 'error');
    }
}

function showPaymentModal(amount, credits, recipientId) {
    // Update modal content
    document.getElementById('paymentAmount').textContent = amount;
    document.getElementById('recipientId').textContent = recipientId;
    
    // Reset payment status
    const statusElement = document.getElementById('paymentStatus');
    statusElement.innerHTML = '<i class="fas fa-clock"></i><span>Waiting for payment...</span>';
    statusElement.className = 'payment-status waiting';
    
    // Show modal
    document.getElementById('paymentModal').style.display = 'flex';
    
    // Reset timer
    paymentTimeLeft = 1800; // 30 minutes
    updateTimerDisplay();
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    
    // Clear timers
    if (paymentTimer) {
        clearInterval(paymentTimer);
        paymentTimer = null;
    }
    
    currentPaymentId = null;
}

function startPaymentTimer() {
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
    
    paymentTimer = setInterval(() => {
        paymentTimeLeft--;
        updateTimerDisplay();
        
        if (paymentTimeLeft <= 0) {
            clearInterval(paymentTimer);
            showToast('Payment request expired. Please try again.', 'warning');
            closePaymentModal();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(paymentTimeLeft / 60);
    const seconds = paymentTimeLeft % 60;
    const timerElement = document.getElementById('paymentTimer');
    
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function startPaymentMonitoring() {
    // Check payment status every 10 seconds
    const monitoringInterval = setInterval(async () => {
        if (!currentPaymentId) {
            clearInterval(monitoringInterval);
            return;
        }
        
        try {
            const response = await fetch('wallet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'check_payment_status',
                    payment_id: currentPaymentId,
                    amount: parseInt(document.getElementById('paymentAmount').textContent)
                })
            });
            
            const result = await response.json();
            
            if (result.success && result.status === 'completed') {
                clearInterval(monitoringInterval);
                paymentCompleted();
            }
        } catch (error) {
            console.error('Payment monitoring error:', error);
        }
    }, 10000);
}

function paymentCompleted() {
    // Update payment status
    const statusElement = document.getElementById('paymentStatus');
    statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>Payment received!</span>';
    statusElement.className = 'payment-status completed';
    
    // Clear timer
    if (paymentTimer) {
        clearInterval(paymentTimer);
        paymentTimer = null;
    }
    
    // Show success message
    showToast('Payment received! Credits have been added to your wallet.', 'success');
    
    // Reload wallet info
    loadWalletInfo();
    
    // Auto-close modal after 3 seconds
    setTimeout(() => {
        closePaymentModal();
    }, 3000);
}

async function checkPaymentStatus() {
    if (!currentPaymentId) {
        showToast('No active payment request', 'warning');
        return;
    }
    
    try {
        const response = await fetch('wallet.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'check_payment_status',
                payment_id: currentPaymentId,
                amount: parseInt(document.getElementById('paymentAmount').textContent)
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (result.status === 'completed') {
                paymentCompleted();
            } else {
                showToast('Payment not yet received. Please wait...', 'info');
            }
        } else {
            showToast('Failed to check payment status', 'error');
        }
    } catch (error) {
        showToast('Error checking payment status: ' + error.message, 'error');
    }
}

function copyCommand() {
    const commandElement = document.getElementById('paymentCommand');
    const command = commandElement.textContent;
    
    // Create temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = command;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Update button to show copied state
    const copyBtn = document.querySelector('.copy-btn');
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.style.color = '#28a745';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.color = '';
    }, 2000);
    
    showToast('Command copied to clipboard!', 'success');
}

// Utility functions
function numberFormat(num) {
    return new Intl.NumberFormat().format(num);
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

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('paymentModal');
    if (e.target === modal) {
        closePaymentModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('paymentModal');
        if (modal.style.display === 'flex') {
            closePaymentModal();
        }
    }
});
