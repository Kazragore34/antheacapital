<?php
/**
 * Proxy temporal para /api/contact
 * Este archivo redirige las peticiones al backend de Node.js
 * 
 * IMPORTANTE: Esta es una solución temporal. La solución correcta es configurar
 * un proxy reverso en el servidor web (nginx/apache) para redirigir /api/* al backend.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo permitir POST para /api/contact
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// URL del backend de Node.js
// Intentar diferentes posibles ubicaciones del backend
$backendUrl = 'http://localhost:3001/api/contact';
$backendUrls = [
    'http://localhost:3001/api/contact',
    'http://127.0.0.1:3001/api/contact',
    'http://localhost:8080/api/contact', // Puerto alternativo común en Hostinger
];

// Probar cada URL hasta encontrar una que funcione
$workingUrl = null;
foreach ($backendUrls as $url) {
    $testCh = curl_init(str_replace('/api/contact', '/api/contact/test', $url));
    curl_setopt($testCh, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($testCh, CURLOPT_TIMEOUT, 2);
    curl_setopt($testCh, CURLOPT_CONNECTTIMEOUT, 2);
    curl_setopt($testCh, CURLOPT_NOBODY, true); // Solo HEAD request
    curl_exec($testCh);
    $httpCode = curl_getinfo($testCh, CURLINFO_HTTP_CODE);
    curl_close($testCh);
    
    if ($httpCode > 0 && $httpCode < 500) {
        $workingUrl = $url;
        break;
    }
}

// Si no encontramos una URL que funcione, usar la predeterminada
$backendUrl = $workingUrl ?: $backendUrl;

// Obtener el cuerpo de la petición
$data = file_get_contents('php://input');
$headers = [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data),
];

// Si hay token de autorización, pasarlo
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

// Inicializar cURL
$ch = curl_init($backendUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

// Ejecutar la petición
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Si hay error de conexión
if ($error) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'El backend no está disponible. Por favor, verifica que el backend de Node.js esté corriendo en el puerto 3001.',
        'error' => $error,
        'backendUrl' => $backendUrl,
        'hint' => 'El backend debe estar corriendo. Verifica en el panel de Hostinger > Node.js que la aplicación esté activa.',
    ]);
    exit;
}

// Devolver la respuesta del backend
http_response_code($httpCode);
echo $response;
