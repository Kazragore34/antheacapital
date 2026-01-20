<?php
/**
 * Función auxiliar para enviar correo vía SMTP usando sockets
 * Esta función permite usar SMTP directamente sin PHPMailer
 */

function sendEmailViaSMTP($host, $port, $user, $pass, $from, $to, $replyTo, $subject, $htmlBody, $textBody) {
    $error = '';
    
    // Log para debugging (solo en desarrollo, eliminar en producción)
    error_log("[SMTP] Intentando conectar a $host:$port");
    
    // Conectar al servidor SMTP
    $socket = @fsockopen($host, $port, $errno, $errstr, 10);
    
    if (!$socket) {
        $errorMsg = "No se pudo conectar al servidor SMTP: $errstr ($errno)";
        error_log("[SMTP] ERROR: $errorMsg");
        return [
            'success' => false,
            'error' => $errorMsg
        ];
    }
    
    error_log("[SMTP] Conexión establecida a $host:$port");
    
    // Leer respuesta inicial
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '220') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error del servidor SMTP: $response"
        ];
    }
    
    // Enviar EHLO
    fputs($socket, "EHLO " . $host . "\r\n");
    $response = fgets($socket, 515);
    
    // Si el servidor requiere STARTTLS
    if (strpos($response, 'STARTTLS') !== false && $port == 587) {
        fputs($socket, "STARTTLS\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) == '220') {
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            fputs($socket, "EHLO " . $host . "\r\n");
            $response = fgets($socket, 515);
        }
    }
    
    // Autenticación
    fputs($socket, "AUTH LOGIN\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '334') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error en AUTH LOGIN: $response"
        ];
    }
    
    fputs($socket, base64_encode($user) . "\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '334') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error en usuario: $response"
        ];
    }
    
    fputs($socket, base64_encode($pass) . "\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '235') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error en autenticación: $response"
        ];
    }
    
    // Enviar correo
    fputs($socket, "MAIL FROM: <$from>\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error en MAIL FROM: $response"
        ];
    }
    
    fputs($socket, "RCPT TO: <$to>\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error en RCPT TO: $response"
        ];
    }
    
    fputs($socket, "DATA\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '354') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error en DATA: $response"
        ];
    }
    
    // Construir mensaje
    $message = "From: $from\r\n";
    $message .= "To: $to\r\n";
    $message .= "Reply-To: $replyTo\r\n";
    $message .= "Subject: $subject\r\n";
    $message .= "MIME-Version: 1.0\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "\r\n";
    $message .= $htmlBody;
    $message .= "\r\n.\r\n";
    
    fputs($socket, $message);
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return [
            'success' => false,
            'error' => "Error al enviar mensaje: $response"
        ];
    }
    
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return [
        'success' => true,
        'message' => 'Correo enviado correctamente'
    ];
}
?>
