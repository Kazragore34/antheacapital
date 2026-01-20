<?php
/**
 * Script de prueba para verificar la conexión SMTP con mxroute
 * Ejecuta este archivo desde el navegador para diagnosticar problemas
 */

// Incluir función SMTP
require_once __DIR__ . '/send-email-smtp.php';

// Configuración
$smtpHost = 'fusion.mxrouting.net';
$smtpPort = 587;
$smtpUser = 'contacto@antheacapital.com';
$smtpPass = 'AC@pital2025-contacto#';
$fromEmail = 'contacto@antheacapital.com';
$toEmail = 'contacto@antheacapital.com';

echo "<h1>Prueba de Conexión SMTP con mxroute</h1>";
echo "<pre>";

// 1. Probar API SMTP de mxroute
echo "=== PRUEBA 1: API SMTP de mxroute ===\n";
$apiData = [
    'server' => 'fusion.mxrouting.net',
    'username' => $smtpUser,
    'password' => $smtpPass,
    'from' => $fromEmail,
    'to' => $toEmail,
    'replyto' => $fromEmail,
    'subject' => 'Prueba de correo desde API SMTP',
    'body' => '<h1>Este es un correo de prueba</h1><p>Si recibes este correo, la API SMTP de mxroute funciona correctamente.</p>'
];

$ch = curl_init('https://smtpapi.mxroute.com/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($apiData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$apiResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

echo "Código HTTP: $httpCode\n";
if ($curlError) {
    echo "Error cURL: $curlError\n";
}
echo "Respuesta: $apiResponse\n";
$apiResult = json_decode($apiResponse, true);
if ($apiResult && isset($apiResult['success']) && $apiResult['success']) {
    echo "✅ API SMTP: ÉXITO\n";
} else {
    echo "❌ API SMTP: FALLO\n";
    if ($apiResult) {
        echo "Mensaje: " . ($apiResult['message'] ?? 'Sin mensaje') . "\n";
    }
}
echo "\n";

// 2. Probar SMTP directo
echo "=== PRUEBA 2: SMTP Directo (sockets) ===\n";
$smtpResult = sendEmailViaSMTP(
    $smtpHost,
    $smtpPort,
    $smtpUser,
    $smtpPass,
    $fromEmail,
    $toEmail,
    $fromEmail,
    'Prueba de correo desde SMTP directo',
    '<h1>Este es un correo de prueba</h1><p>Si recibes este correo, el SMTP directo funciona correctamente.</p>',
    'Este es un correo de prueba. Si recibes este correo, el SMTP directo funciona correctamente.'
);

if ($smtpResult['success']) {
    echo "✅ SMTP Directo: ÉXITO\n";
} else {
    echo "❌ SMTP Directo: FALLO\n";
    echo "Error: " . ($smtpResult['error'] ?? 'Error desconocido') . "\n";
}
echo "\n";

// 3. Probar mail() nativo
echo "=== PRUEBA 3: mail() nativo de PHP ===\n";
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: $fromEmail\r\n";
$headers .= "Reply-To: $fromEmail\r\n";

if (mail($toEmail, 'Prueba de correo desde mail()', '<h1>Este es un correo de prueba</h1><p>Si recibes este correo, mail() funciona correctamente.</p>', $headers)) {
    echo "✅ mail() nativo: Devuelve TRUE (pero puede que no se haya enviado realmente)\n";
} else {
    echo "❌ mail() nativo: Devuelve FALSE\n";
}
echo "\n";

// 4. Verificar configuración
echo "=== CONFIGURACIÓN ACTUAL ===\n";
echo "Servidor SMTP: $smtpHost\n";
echo "Puerto: $smtpPort\n";
echo "Usuario: $smtpUser\n";
echo "Contraseña: " . (strlen($smtpPass) > 0 ? "*** (longitud: " . strlen($smtpPass) . ")" : "NO CONFIGURADA") . "\n";
echo "Desde: $fromEmail\n";
echo "Hacia: $toEmail\n";
echo "\n";

// 5. Verificar conectividad
echo "=== VERIFICACIÓN DE CONECTIVIDAD ===\n";
$testHosts = [
    'fusion.mxrouting.net',
    'mail.mxrouting.net',
    'smtp.mxrouting.net',
];

foreach ($testHosts as $host) {
    $connection = @fsockopen($host, $smtpPort, $errno, $errstr, 5);
    if ($connection) {
        echo "✅ $host:$smtpPort - CONECTADO\n";
        fclose($connection);
    } else {
        echo "❌ $host:$smtpPort - NO CONECTADO ($errstr)\n";
    }
}

echo "\n";
echo "=== INSTRUCCIONES ===\n";
echo "1. Revisa tu bandeja de entrada de contacto@antheacapital.com\n";
echo "2. Revisa también la carpeta de SPAM\n";
echo "3. Si ninguna prueba funciona, verifica:\n";
echo "   - Que el buzón contacto@antheacapital.com existe en el panel de mxroute\n";
echo "   - Que las credenciales son correctas\n";
echo "   - Que la configuración de Email Routing está correcta en mxroute\n";
echo "</pre>";
?>
