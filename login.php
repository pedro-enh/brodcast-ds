<?php
// Load configuration
try {
    $config = require_once 'config.php';
} catch (Exception $e) {
    // Fallback configuration if config.php doesn't exist
    $config = [
        'DISCORD_CLIENT_ID' => '1404415002269712394',
        'DISCORD_CLIENT_SECRET' => '_IkY6jLnzkm9Sm06km0-4pKsUcpfe9P8',
        'REDIRECT_URI' => 'https://brodcast-discord-pro.42web.io/auth.php'
    ];
}

// Discord OAuth URL - using the new auth-simple.php handler
$discord_oauth_url = 'https://discord.com/api/oauth2/authorize?' . http_build_query([
    'client_id' => $config['DISCORD_CLIENT_ID'],
    'redirect_uri' => 'https://brodcast-discord-pro.42web.io/auth-simple.php',
    'response_type' => 'code',
    'scope' => 'identify'
]);

// Redirect to Discord OAuth
header('Location: ' . $discord_oauth_url);
exit;
?>
