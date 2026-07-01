<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(["error" => "Method not allowed"], 405);
}

verifyApiKey();

$data = getAppData();
if ($data) {
    // Optionally remove password hashes before sending to client for security
    // But since the client needs users for offline/staff view, we just send it.
    jsonResponse($data, 200);
} else {
    jsonResponse(["error" => "Failed to load data"], 500);
}
?>
