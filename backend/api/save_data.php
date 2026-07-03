<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Method not allowed"], 405);
}

verifyApiKey();

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!isset($input['jobs']) || !isset($input['inventory']) || !isset($input['users'])) {
    jsonResponse(["error" => "Invalid application data payload"], 400);
}

// Preserve existing passwords if the client doesn't send them (which they won't for existing users without changes)
$existingData = getAppData();
if ($existingData && isset($existingData['users'])) {
    $existingUsers = [];
    foreach ($existingData['users'] as $u) {
        $existingUsers[$u['email']] = $u;
    }
    
    foreach ($input['users'] as &$u) {
        if (isset($existingUsers[$u['email']])) {
            // If client didn't send a new password, keep the old one
            if (!isset($u['password']) || empty($u['password'])) {
                $u['password'] = $existingUsers[$u['email']]['password'] ?? '';
            } else {
                // If client sends a new password that isn't hashed yet
                if (strpos($u['password'], '$2y$') !== 0) {
                    $u['password'] = password_hash($u['password'], PASSWORD_DEFAULT);
                }
            }
        } else {
            // New user, hash password if provided
            if (isset($u['password']) && !empty($u['password'])) {
                if (strpos($u['password'], '$2y$') !== 0) {
                    $u['password'] = password_hash($u['password'], PASSWORD_DEFAULT);
                }
            }
        }
    }
}

// Write to file safely using temp file in same directory
$tempFile = $DATA_FILE . '.tmp';
$jsonData = json_encode($input, JSON_PRETTY_PRINT);
$written = file_put_contents($tempFile, $jsonData, LOCK_EX);

if ($written !== false) {
    if (rename($tempFile, $DATA_FILE)) {
        jsonResponse(["success" => true, "message" => "Data saved successfully"], 200);
    } else {
        // rename failed, try direct write as fallback
        if (file_put_contents($DATA_FILE, $jsonData, LOCK_EX) !== false) {
            @unlink($tempFile);
            jsonResponse(["success" => true, "message" => "Data saved (direct write)"], 200);
        } else {
            jsonResponse(["error" => "Failed to rename temp file to data.json"], 500);
        }
    }
} else {
    jsonResponse(["error" => "Failed to write data to server"], 500);
}
?>
