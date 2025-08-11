<?php
session_start();

// Destroy the session
session_destroy();

// Redirect back to main page
header('Location: index.php');
exit;
?>
