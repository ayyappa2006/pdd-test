<?php
// Suppress warnings so they don't break JSON output
error_reporting(0);
ini_set('display_errors', 0);
mysqli_report(MYSQLI_REPORT_OFF);

// Global CORS Headers (always send these for all requests, including preflight OPTIONS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle OPTIONS preflight request globally
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$host = "127.0.0.1";
$username = "root"; // Default XAMPP username
$password = "";     // Default XAMPP password is empty
$dbname = "civicbin";

// Try port 3307 first (common for custom XAMPP configurations), then fall back to default port (3306)
$port = 3307;
$conn = @new mysqli($host, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    // Fall back to default port (usually 3306)
    $conn = @new mysqli($host, $username, $password, $dbname);
}

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}
?>
