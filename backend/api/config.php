<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$API_KEY = "galaxy_it_repair_secret_key_2026"; // Must match frontend API key
$DATA_FILE = __DIR__ . "/data.json";

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

function verifyApiKey() {
    global $API_KEY;
    $providedKey = '';
    
    if (isset($_GET['api_key'])) {
        $providedKey = $_GET['api_key'];
    } elseif (isset($_POST['api_key'])) {
        $providedKey = $_POST['api_key'];
    } elseif (isset($_SERVER['HTTP_X_API_KEY'])) {
        $providedKey = $_SERVER['HTTP_X_API_KEY'];
    } elseif (isset($_SERVER['X_API_KEY'])) {
        $providedKey = $_SERVER['X_API_KEY'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['X-API-KEY'])) {
            $providedKey = $headers['X-API-KEY'];
        } elseif (isset($headers['x-api-key'])) {
            $providedKey = $headers['x-api-key'];
        }
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['X-API-KEY'])) {
            $providedKey = $headers['X-API-KEY'];
        } elseif (isset($headers['x-api-key'])) {
            $providedKey = $headers['x-api-key'];
        }
    }
    
    if ($providedKey !== $API_KEY) {
        jsonResponse(["error" => "Unauthorized access. Invalid API Key. Provided: " . $providedKey], 401);
    }
}

// Initialize data.json if missing
if (!file_exists($DATA_FILE)) {
    $defaultData = [
        "jobs" => [],
        "inventory" => [],
        "users" => [
            [
                "id" => "ADMIN",
                "name" => "Amit Anurup",
                "role" => "admin",
                "pin" => "0000",
                "email" => "amitanurup@gmail.com",
                "password" => password_hash("Amit@12345", PASSWORD_DEFAULT)
            ],
            [
                "id" => "ADMIN_GCC",
                "name" => "GCC Bhubaneswar",
                "role" => "admin",
                "pin" => "0000",
                "email" => "gccbhubaneswar@gmail.com",
                "password" => password_hash("Admin@12345", PASSWORD_DEFAULT)
            ]
        ]
    ];
    file_put_contents($DATA_FILE, json_encode($defaultData, JSON_PRETTY_PRINT));
}

// Helper to get all data
function getAppData() {
    global $DATA_FILE;
    if (!file_exists($DATA_FILE)) return null;
    $json = file_get_contents($DATA_FILE);
    return json_decode($json, true);
}
?>
