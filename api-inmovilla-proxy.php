<?php
/**
 * Proxy PHP para la API de Inmovilla
 * Permite que el frontend acceda a la API de Inmovilla sin problemas de CORS
 * 
 * Uso:
 * GET /api-inmovilla-proxy.php?action=propiedades&limit=100
 * GET /api-inmovilla-proxy.php?action=ficha&codOfer=395378
 */

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuración de Inmovilla
// Credenciales de producción configuradas
define('INMOVILLA_NUMAGENCIA', '13740'); // Número de agencia de Anthea Capital
define('INMOVILLA_PASSWORD', 'Ast19722026.'); // Contraseña de acceso a la API (con punto final)
define('INMOVILLA_IDIOMA', '1'); // 1 = Español

// Incluir la librería de Inmovilla
// Intentar múltiples rutas posibles
$possiblePaths = [
    __DIR__ . '/archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php',
    __DIR__ . '/archivos en bruto/api_cliente/cliente/apiinmovilla.php',
    dirname(__DIR__) . '/archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php',
    dirname(__DIR__) . '/archivos en bruto/api_cliente/cliente/apiinmovilla.php',
];

$apiPath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $apiPath = $path;
        break;
    }
}

if ($apiPath && file_exists($apiPath)) {
    require_once $apiPath;
} else {
    // Si no existe el archivo, crear funciones básicas inline
    if (!function_exists('Procesos')) {
        function Procesos($tipo, $posinicial, $numelementos, $where, $orden) {
            global $arrpeticiones;
            if (!isset($arrpeticiones) || is_null($arrpeticiones)) {
                $arrpeticiones = array();
            }
            $arrpeticiones[] = $tipo;
            $arrpeticiones[] = $posinicial;
            $arrpeticiones[] = $numelementos;
            $arrpeticiones[] = $where;
            $arrpeticiones[] = $orden;
        }
    }
    
    if (!function_exists('PedirDatos')) {
        function PedirDatos($numagencia, $password, $idioma, $json = 0) {
            global $arrpeticiones;
            $addnumagencia = '';
            
            $texto = "{$numagencia}{$addnumagencia};{$password};{$idioma};";
            $texto .= "lostipos";
            
            for ($i = 0; $i < count($arrpeticiones); $i++) {
                $texto .= ";" . $arrpeticiones[$i];
            }
            
            $texto = rawurlencode($texto);
            $parametros = "param={$texto}";
            $elDominio = $_SERVER['SERVER_NAME'];
            $parametros .= "&elDominio={$elDominio}";
            
            // Obtener IP del cliente
            function getClientIP() {
                $proxy_headers = array(
                    'HTTP_CLIENT_IP',
                    'HTTP_X_FORWARDED_FOR',
                    'HTTP_X_FORWARDED',
                    'HTTP_FORWARDED_FOR',
                    'HTTP_FORWARDED',
                    'HTTP_CF_CONNECTING_IP'
                );
                foreach ($proxy_headers as $key) {
                    if (isset($_SERVER[$key])) {
                        $ips = explode(',', $_SERVER[$key]);
                        $ip = trim($ips[0]);
                        if ($ip != $_SERVER['REMOTE_ADDR']) {
                            return $ip;
                        }
                    }
                }
                return $_SERVER['REMOTE_ADDR'];
            }
            
            $ip = getClientIP();
            $parametros .= "&ia={$ip}";
            
            if ($json) {
                $parametros .= "&json=1";
            }
            
            $url = "https://apiweb.inmovilla.com/apiweb/apiweb.php";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $parametros);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3");
            
            $page = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);
            
            $GLOBALS['arrpeticiones'] = array();
            
            if ($error) {
                throw new Exception("Error en cURL: {$error}");
            }
            
            if ($httpCode !== 200) {
                throw new Exception("HTTP Error {$httpCode}: La API de Inmovilla devolvió un error. Verifica las credenciales.");
            }
            
            return $json ? $page : null;
        }
    }
}

// Obtener parámetros
$action = $_GET['action'] ?? 'propiedades';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 1;
$codOfer = $_GET['codOfer'] ?? null;
$where = $_GET['where'] ?? '';
$order = $_GET['order'] ?? 'precioinmo, precioalq';


try {
    // Verificar que las funciones de Inmovilla estén disponibles
    if (!function_exists('Procesos')) {
        throw new Exception('La función Procesos no está disponible. Verifica que apiinmovilla.php esté incluido correctamente.');
    }
    
    if (!function_exists('PedirDatos')) {
        throw new Exception('La función PedirDatos no está disponible. Verifica que apiinmovilla.php esté incluido correctamente.');
    }
    
    // Limpiar array de peticiones global
    $GLOBALS['arrpeticiones'] = array();
    
    // Configurar petición según la acción
    switch ($action) {
        case 'propiedades':
            // Obtener todas las propiedades con paginación
            Procesos('paginacion', $offset, $limit, $where, $order);
            break;
            
        case 'ficha':
            // Obtener una propiedad específica por codOfer
            if (!$codOfer) {
                throw new Exception('codOfer es requerido para la acción ficha');
            }
            Procesos('ficha', 1, 1, "ofertas.cod_ofer={$codOfer}", '');
            break;
            
        case 'destacados':
            // Obtener propiedades destacadas
            Procesos('destacados', 1, $limit, '', $order);
            break;
            
        case 'tipos':
            // Obtener tipos de propiedades
            Procesos('tipos', 1, 100, '', '');
            break;
            
        case 'ciudades':
            // Obtener ciudades disponibles
            Procesos('ciudades', 1, 100, '', '');
            break;
            
        default:
            throw new Exception("Acción no válida: {$action}");
    }
    
    // Pedir datos a la API (con JSON)
    $jsonResponse = PedirDatos(INMOVILLA_NUMAGENCIA, INMOVILLA_PASSWORD, INMOVILLA_IDIOMA, 1);
    
    // Verificar que la respuesta no esté vacía
    if (empty($jsonResponse)) {
        throw new Exception('La API de Inmovilla devolvió una respuesta vacía. Verifica las credenciales (numagencia: ' . INMOVILLA_NUMAGENCIA . ')');
    }
    
    // Limpiar posibles caracteres BOM o espacios al inicio/final
    $jsonResponse = trim($jsonResponse);
    
    // Log para debugging (solo primeros 1000 caracteres)
    $responsePreview = substr($jsonResponse, 0, 1000);
    error_log('[API Proxy] Respuesta recibida (primeros 1000 chars): ' . $responsePreview);
    
    // Verificar si la respuesta parece ser JSON
    $firstChar = substr($jsonResponse, 0, 1);
    if ($firstChar !== '{' && $firstChar !== '[') {
        // La respuesta puede ser un error o HTML
        error_log('[API Proxy] Respuesta no JSON recibida. Primer carácter: ' . $firstChar);
        error_log('[API Proxy] Respuesta completa (primeros 2000 chars): ' . substr($jsonResponse, 0, 2000));
        throw new Exception('La API de Inmovilla devolvió una respuesta que no es JSON válido. Verifica las credenciales. Respuesta: ' . substr($jsonResponse, 0, 500));
    }
    
    // Decodificar JSON
    $data = json_decode($jsonResponse, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $errorMsg = json_last_error_msg();
        error_log('[API Proxy] Error decodificando JSON: ' . $errorMsg);
        error_log('[API Proxy] Respuesta recibida (primeros 2000 chars): ' . substr($jsonResponse, 0, 2000));
        throw new Exception('Error decodificando JSON: ' . $errorMsg . '. Respuesta recibida: ' . substr($jsonResponse, 0, 500));
    }
    
    // Devolver respuesta JSON
    echo json_encode([
        'success' => true,
        'action' => $action,
        'data' => $data,
        'timestamp' => time()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => time()
    ], JSON_UNESCAPED_UNICODE);
}
?>
