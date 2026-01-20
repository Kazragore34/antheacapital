<?php
/**
 * Proxy PHP para el XML de Inmovilla
 * Soluciona el problema de CORS permitiendo que el frontend acceda al XML
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/xml; charset=utf-8');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// URL del XML de Inmovilla
$xmlUrl = 'https://procesos.inmovilla.com/xml/xml2demo/2-web.xml';

// Permitir cambiar la URL mediante parámetro (para producción)
if (isset($_GET['url']) && !empty($_GET['url'])) {
    $xmlUrl = filter_var($_GET['url'], FILTER_SANITIZE_URL);
}

// Fetch del XML
$ch = curl_init($xmlUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, 'Anthea Capital XML Proxy/1.0');

$xmlContent = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Verificar errores
if ($error) {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Error fetching XML: ' . htmlspecialchars($error) . '</error>';
    exit;
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>HTTP Error: ' . $httpCode . '</error>';
    exit;
}

if (empty($xmlContent)) {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Empty XML response</error>';
    exit;
}

// Cache headers (opcional, para mejorar rendimiento)
header('Cache-Control: public, max-age=300'); // Cache por 5 minutos

// Enviar el XML
echo $xmlContent;
?>
