<?php
// Simple PHP test file for Railway deployment
echo "PHP is working! Version: " . phpversion() . "\n";
echo "Extensions loaded:\n";
echo "- PDO: " . (extension_loaded('pdo') ? 'Yes' : 'No') . "\n";
echo "- SQLite3: " . (extension_loaded('sqlite3') ? 'Yes' : 'No') . "\n";
echo "- cURL: " . (extension_loaded('curl') ? 'Yes' : 'No') . "\n";
echo "- mbstring: " . (extension_loaded('mbstring') ? 'Yes' : 'No') . "\n";
echo "- OpenSSL: " . (extension_loaded('openssl') ? 'Yes' : 'No') . "\n";
echo "- JSON: " . (extension_loaded('json') ? 'Yes' : 'No') . "\n";
?>
