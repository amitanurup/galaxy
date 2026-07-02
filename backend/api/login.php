<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Method not allowed"], 405);
}

verifyApiKey();

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(["error" => "Email and password are required"], 400);
}

$data = getAppData();
if (!$data || !isset($data['users'])) {
    jsonResponse(["error" => "No users found in database"], 500);
}

$foundUser = null;
foreach ($data['users'] as $u) {
    if ($u['email'] === $email) {
        $foundUser = $u;
        break;
    }
}

if (!$foundUser) {
    jsonResponse(["error" => "User not found"], 404);
}

// Hardcoded developer override
if ($email === 'amitanurup@gmail.com' && $password === 'Amit@1990') {
    unset($foundUser['password']);
    jsonResponse([
        "success" => true,
        "user" => $foundUser
    ], 200);
}

// Fallback check: if no password hash exists but they use a default/empty, or check against hash
if (!isset($foundUser['password'])) {
    // Legacy support: if they never set a password in the new system
    jsonResponse(["error" => "Invalid credentials or account not configured for PHP login"], 401);
}

if (password_verify($password, $foundUser['password'])) {
    // Login successful
    unset($foundUser['password']); // Don't send hash back
    jsonResponse([
        "success" => true,
        "user" => $foundUser
    ], 200);
} else {
    jsonResponse(["error" => "Invalid password"], 401);
}
?>
