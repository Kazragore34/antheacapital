<?php
/**
 * Handler PHP para el formulario de contacto
 * Esta solución funciona directamente en Hostinger sin necesidad de Node.js
 */

// Incluir función auxiliar para SMTP
require_once __DIR__ . '/send-email-smtp.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Obtener datos del cuerpo de la petición
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
$required = ['name', 'surname', 'email', 'phone', 'message', 'consent'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "El campo '$field' es requerido"
        ]);
        exit;
    }
}

// Extraer datos
$name = htmlspecialchars($data['name'] ?? '');
$surname = htmlspecialchars($data['surname'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars($data['phone'] ?? '');
$message = htmlspecialchars($data['message'] ?? '');
$propertyId = htmlspecialchars($data['propertyId'] ?? '');
$propertyTitle = htmlspecialchars($data['propertyTitle'] ?? '');
$propertyUrl = htmlspecialchars($data['propertyUrl'] ?? '');
$propertyPrice = htmlspecialchars($data['propertyPrice'] ?? '');
$propertyType = htmlspecialchars($data['propertyType'] ?? '');

// Validar email
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Configuración SMTP
// IMPORTANTE: Ajusta estos valores según tu proveedor de correo

// Opción 1: mxroute/mxrouting (recomendado si usas mxroute)
// Basado en tus registros DNS que apuntan a fusion.mxrouting.net
// El servidor SMTP es el mismo que el servidor MX según mxroute
$smtpHost = 'fusion.mxrouting.net'; // Servidor SMTP de mxroute (mismo que el MX)
$smtpPort = 587; // Puerto para STARTTLS (o 465 para SSL)
$smtpUser = 'contacto@antheacapital.com'; // Tu email completo
$smtpPass = 'AC@pital2025-contacto#'; // Contraseña de tu cuenta

// Servidores SMTP alternativos de mxroute para probar
$smtpHosts = [
    'fusion.mxrouting.net', // Primero el mismo que el MX
    'mail.mxrouting.net',
    'smtp.mxrouting.net',
    'mx.mxrouting.net',
];

// API SMTP de mxroute (más confiable que sockets)
$mxrouteApiUrl = 'https://smtpapi.mxroute.com/';

// Opción 2: Hostinger (si prefieres usar Hostinger directamente)
// $smtpHost = 'smtp.hostinger.com';
// $smtpPort = 587;
// $smtpUser = 'contacto@antheacapital.com';
// $smtpPass = 'AC@pital2025-contacto#';

$fromEmail = 'contacto@antheacapital.com';
$toEmail = 'contacto@antheacapital.com';

// Determinar si hay información de propiedad
$hasPropertyInfo = !empty($propertyId) || !empty($propertyTitle) || !empty($propertyUrl);

// Preparar asunto y cuerpo del correo
$subject = $hasPropertyInfo 
    ? 'Solicitud de información - Propiedad' 
    : 'Nuevo contacto desde la web';

// Asegurar que todo el contenido esté en UTF-8
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

// Cuerpo HTML del correo
$htmlBody = '
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #C9A961; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #C9A961; }
        .property-info { background-color: #fff; border-left: 4px solid #C9A961; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>' . ($hasPropertyInfo ? 'Solicitud de información sobre propiedad' : 'Nuevo mensaje de contacto') . '</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Nombre:</span> ' . $name . ' ' . $surname . '
            </div>
            <div class="field">
                <span class="label">Email:</span> <a href="mailto:' . $email . '">' . $email . '</a>
            </div>
            <div class="field">
                <span class="label">Teléfono:</span> <a href="tel:' . $phone . '">' . $phone . '</a>
            </div>';

if ($hasPropertyInfo) {
    $htmlBody .= '
            <div class="property-info">
                <h3 style="color: #C9A961; margin-top: 0;">Información de la Propiedad:</h3>';
    if ($propertyType) $htmlBody .= '<div class="field"><span class="label">Tipo:</span> ' . $propertyType . '</div>';
    if ($propertyTitle) $htmlBody .= '<div class="field"><span class="label">Título:</span> ' . $propertyTitle . '</div>';
    if ($propertyPrice) $htmlBody .= '<div class="field"><span class="label">Precio:</span> ' . $propertyPrice . '</div>';
    if ($propertyId) $htmlBody .= '<div class="field"><span class="label">ID Propiedad:</span> ' . $propertyId . '</div>';
    if ($propertyUrl) $htmlBody .= '<div class="field"><span class="label">Enlace:</span> <a href="' . $propertyUrl . '" style="color: #C9A961;">' . $propertyUrl . '</a></div>';
    $htmlBody .= '
            </div>';
}

$htmlBody .= '
            <div class="field">
                <span class="label">Mensaje:</span>
                <div style="white-space: pre-wrap; background-color: white; padding: 10px; border-radius: 5px; margin-top: 10px;">' . nl2br($message) . '</div>
            </div>
        </div>
        <div class="footer">
            <p>Este correo fue enviado desde el formulario de contacto de antheacapital.com</p>
        </div>
    </div>
</body>
</html>';

// Cuerpo de texto plano
$textBody = ($hasPropertyInfo ? 'Solicitud de información sobre propiedad' : 'Nuevo mensaje de contacto') . "\n\n";
$textBody .= "Nombre: $name $surname\n";
$textBody .= "Email: $email\n";
$textBody .= "Teléfono: $phone\n";
if ($hasPropertyInfo) {
    $textBody .= "\n--- Información de la Propiedad ---\n";
    if ($propertyType) $textBody .= "Tipo: $propertyType\n";
    if ($propertyTitle) $textBody .= "Título: $propertyTitle\n";
    if ($propertyPrice) $textBody .= "Precio: $propertyPrice\n";
    if ($propertyId) $textBody .= "ID Propiedad: $propertyId\n";
    if ($propertyUrl) $textBody .= "Enlace: $propertyUrl\n";
    $textBody .= "--- Fin Información de la Propiedad ---\n";
}
$textBody .= "\nMensaje:\n$message";

// Usar PHPMailer si está disponible, sino usar mail() nativo
// Nota: PHPMailer requiere instalación previa. Por ahora usamos mail() nativo que funciona en Hostinger
if (false && class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    // Código para PHPMailer (deshabilitado por ahora)
    // require_once 'vendor/autoload.php';
    // use PHPMailer\PHPMailer\PHPMailer;
    // use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtpPort;
        $mail->CharSet = 'UTF-8';
        
        // Remitente y destinatario
        $mail->setFrom($fromEmail, 'Anthea Capital');
        $mail->addAddress($toEmail);
        $mail->addReplyTo($email, "$name $surname");
        
        // Contenido
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $textBody;
        
        $mail->send();
        
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el correo',
            'error' => $mail->ErrorInfo
        ]);
    }
} else {
    // Estrategia de envío: 1) API SMTP de mxroute, 2) SMTP directo, 3) mail() como último recurso
    
    // 1. Intentar primero con la API SMTP de mxroute (más confiable)
    error_log("[ContactHandler] Intentando enviar correo vía API SMTP de mxroute");
    $apiData = [
        'server' => 'fusion.mxrouting.net',
        'username' => $smtpUser,
        'password' => $smtpPass,
        'from' => $fromEmail,
        'to' => $toEmail,
        'replyto' => $email,
        'subject' => $subject,
        'body' => $htmlBody
    ];
    
    $ch = curl_init($mxrouteApiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($apiData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $apiResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode == 200) {
        $apiResult = json_decode($apiResponse, true);
        if ($apiResult && isset($apiResult['success']) && $apiResult['success']) {
            error_log("[ContactHandler] ✅ Correo enviado exitosamente usando API SMTP de mxroute");
            echo json_encode([
                'success' => true,
                'message' => 'Mensaje enviado correctamente'
            ]);
            exit;
        } else {
            error_log("[ContactHandler] ❌ API SMTP de mxroute falló: " . ($apiResult['message'] ?? $apiResponse));
        }
    } else {
        error_log("[ContactHandler] ❌ API SMTP de mxroute falló con código HTTP: $httpCode");
    }
    
    // 2. Si la API falla, intentar SMTP directo
    if (function_exists('sendEmailViaSMTP')) {
        $smtpResult = null;
        $lastError = '';
        
        foreach ($smtpHosts as $host) {
            error_log("[ContactHandler] Intentando enviar correo vía SMTP: $host:$smtpPort");
            $smtpResult = sendEmailViaSMTP($host, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $toEmail, $email, $subject, $htmlBody, $textBody);
            
            if ($smtpResult['success']) {
                error_log("[ContactHandler] ✅ Correo enviado exitosamente usando $host");
                echo json_encode([
                    'success' => true,
                    'message' => 'Mensaje enviado correctamente'
                ]);
                exit;
            } else {
                $lastError = $smtpResult['error'] ?? 'Error desconocido';
                error_log("[ContactHandler] ❌ Error con $host: $lastError");
                
                // Si el error es "Sender verify failed", es un problema de configuración en mxroute
                if (strpos(strtolower($lastError), 'sender verify') !== false || 
                    strpos(strtolower($lastError), '550') !== false) {
                    error_log("[ContactHandler] ⚠️ ERROR CRÍTICO: Sender verify failed. Verifica que el buzón contacto@antheacapital.com existe en el panel de mxroute.");
                }
            }
        }
        
        // Si todos los servidores SMTP fallan, intentar mail() como último recurso
        error_log("[ContactHandler] Todos los servidores SMTP fallaron, intentando mail() nativo");
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: $fromEmail\r\n";
        $headers .= "Reply-To: $email\r\n";
        
        if (mail($toEmail, $subject, $htmlBody, $headers)) {
            error_log("[ContactHandler] ⚠️ mail() devolvió true, pero puede que el correo no se haya enviado realmente");
            echo json_encode([
                'success' => true,
                'message' => 'Mensaje enviado correctamente (usando mail() nativo)',
                'warning' => 'Si no recibes el correo, verifica la configuración SMTP'
            ]);
        } else {
            http_response_code(500);
            error_log("[ContactHandler] ❌ mail() también falló");
            echo json_encode([
                'success' => false,
                'message' => 'Error al enviar el correo. Por favor, intenta más tarde o contacta directamente a contacto@antheacapital.com',
                'error' => $lastError,
                'hint' => 'Verifica: 1) Que el buzón contacto@antheacapital.com existe en mxroute, 2) Las credenciales SMTP, 3) La configuración de Email Routing en el panel de mxroute'
            ]);
        }
    } else {
        // Si la función SMTP no está disponible, usar mail() nativo
        error_log("[ContactHandler] ⚠️ sendEmailViaSMTP no disponible, usando mail() nativo");
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: $fromEmail\r\n";
        $headers .= "Reply-To: $email\r\n";
        
        if (mail($toEmail, $subject, $htmlBody, $headers)) {
            error_log("[ContactHandler] ⚠️ mail() devolvió true, pero puede que el correo no se haya enviado realmente");
            echo json_encode([
                'success' => true,
                'message' => 'Mensaje enviado correctamente (usando mail() nativo)',
                'warning' => 'Si no recibes el correo, verifica la configuración SMTP'
            ]);
        } else {
            http_response_code(500);
            error_log("[ContactHandler] ❌ mail() falló");
            echo json_encode([
                'success' => false,
                'message' => 'Error al enviar el correo. Por favor, intenta más tarde o contacta directamente a contacto@antheacapital.com',
                'hint' => 'La función sendEmailViaSMTP no está disponible. Verifica que send-email-smtp.php esté en el servidor.'
            ]);
        }
    }
}
?>
