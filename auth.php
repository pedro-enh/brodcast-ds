<?php
session_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load configuration
try {
    $config = require_once 'config.php';
} catch (Exception $e) {
    // Fallback configuration if config.php doesn't exist
    $config = [
        'DISCORD_CLIENT_ID' => '1404415002269712394',
        'DISCORD_CLIENT_SECRET' => '_IkY6jLnzkm9Sm06km0-4pKsUcpfe9P8',
        'REDIRECT_URI' => 'https://brodcast-ds-production.up.railway.app/auth.php'
    ];
}

// Check if we have an authorization code
if (!isset($_GET['code'])) {
    header('Location: index.php?error=no_code');
    exit;
}

$code = $_GET['code'];

// Exchange code for access token
$token_url = 'https://discord.com/api/oauth2/token';
$token_data = [
    'client_id' => $config['DISCORD_CLIENT_ID'],
    'client_secret' => $config['DISCORD_CLIENT_SECRET'],
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => $config['REDIRECT_URI']
];

$token_options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($token_data)
    ]
];

// Use cURL instead of file_get_contents for better compatibility
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($token_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$token_response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($token_response === FALSE || $http_code !== 200) {
    // Log the error for debugging
    error_log("Token request failed. HTTP Code: " . $http_code);
    header('Location: index.php?error=token_failed&code=' . $http_code);
    exit;
}

$token_data = json_decode($token_response, true);

if (!isset($token_data['access_token'])) {
    // Log the response for debugging
    error_log("Token response: " . $token_response);
    header('Location: index.php?error=invalid_token&debug=' . urlencode($token_response));
    exit;
}

$access_token = $token_data['access_token'];

// Get user information
$user_url = 'https://discord.com/api/users/@me';
$user_options = [
    'http' => [
        'header' => "Authorization: Bearer " . $access_token . "\r\n",
        'method' => 'GET'
    ]
];

// Use cURL for user request too
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $user_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $access_token]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$user_response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($user_response === FALSE || $http_code !== 200) {
    error_log("User request failed. HTTP Code: " . $http_code);
    header('Location: index.php?error=user_failed&code=' . $http_code);
    exit;
}

$user_data = json_decode($user_response, true);

if (!isset($user_data['id'])) {
    error_log("User response: " . $user_response);
    header('Location: index.php?error=invalid_user&debug=' . urlencode($user_response));
    exit;
}

// Create avatar URL
$avatar_url = $user_data['avatar'] 
    ? "https://cdn.discordapp.com/avatars/{$user_data['id']}/{$user_data['avatar']}.png"
    : "https://cdn.discordapp.com/embed/avatars/" . (intval($user_data['discriminator']) % 5) . ".png";

// Store user data in session
$_SESSION['discord_user'] = [
    'id' => $user_data['id'],
    'username' => $user_data['username'],
    'discriminator' => $user_data['discriminator'],
    'avatar' => $user_data['avatar'],
    'avatar_url' => $avatar_url
];

$_SESSION['access_token'] = $access_token;

// Redirect back to main page with success message
header('Location: index.php?login=success');
exit;
?>

