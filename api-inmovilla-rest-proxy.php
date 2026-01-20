<?php
/**
 * Proxy PHP para la API REST de Inmovilla
 * Usa autenticación por token en lugar de usuario/contraseña
 * 
 * Uso:
 * GET /api-inmovilla-rest-proxy.php?action=propiedades&limit=100
 * GET /api-inmovilla-rest-proxy.php?action=ficha&codOfer=395378
 */

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuración de Inmovilla API REST
// Token REST generado desde el panel de Inmovilla
// Documentación: https://procesos.apinmo.com/api/v1/apidoc/
define('INMOVILLA_API_TOKEN', 'F614ADA147C30D2D08FF53714B8CC23F');
define('INMOVILLA_NUMAGENCIA', '13740');
// URL base de la API REST de Inmovilla (según documentación oficial)
define('INMOVILLA_API_BASE_URL', 'https://procesos.inmovilla.com/api/v1');

// Obtener parámetros
$action = $_GET['action'] ?? 'propiedades';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$codOfer = $_GET['codOfer'] ?? null;
$where = $_GET['where'] ?? '';
$order = $_GET['order'] ?? '';

/**
 * Realizar petición a la API REST de Inmovilla
 */
function callInmovillaAPI($endpoint, $params = []) {
    // Construir URL base según documentación oficial
    // URL: https://procesos.inmovilla.com/api/v1
    $url = INMOVILLA_API_BASE_URL . $endpoint;
    
    // Agregar parámetros a la URL
    if (!empty($params)) {
        $url .= '?' . http_build_query($params);
    }
    
    error_log('[API REST Proxy] Llamando a: ' . $url);
    error_log('[API REST Proxy] Token: ' . substr(INMOVILLA_API_TOKEN, 0, 10) . '...');
    
    // Según la documentación oficial: https://procesos.apinmo.com/api/v1/apidoc/
    // El token debe ir en el header con la key "Token" (no "Authorization: Bearer")
    // Headers requeridos según documentación:
    // - Content-Type: application/json
    // - Token: {tu_token}
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Token: ' . INMOVILLA_API_TOKEN  // Formato correcto según documentación oficial
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('Error en cURL: ' . $error);
    }
    
    if ($httpCode !== 200) {
        error_log('[API REST Proxy] HTTP Error ' . $httpCode . ': ' . substr($response, 0, 500));
        throw new Exception('HTTP Error ' . $httpCode . ': ' . substr($response, 0, 200));
    }
    
    return $response;
}

try {
    $data = null;
    $response = null;
    
    switch ($action) {
        case 'propiedades':
            // Obtener todas las propiedades
            // Según la documentación oficial: GET /propiedades/?listado devuelve solo datos básicos
            // Para obtener propiedades completas, primero obtenemos el listado básico
            // y luego obtenemos los detalles completos de cada propiedad
            $response = callInmovillaAPI('/propiedades/?listado', []);
            $decoded = json_decode($response, true);
            
            // El listado básico devuelve un array de propiedades con solo: cod_ofer, ref, nodisponible, prospecto, fechaact
            $listadoBasico = [];
            if (is_array($decoded)) {
                $listadoBasico = $decoded;
            } elseif (isset($decoded['data']) && is_array($decoded['data'])) {
                $listadoBasico = $decoded['data'];
            }
            
            // Obtener detalles completos de cada propiedad en paralelo
            // Limitar a 50 propiedades para evitar timeout (se puede aumentar después)
            $propiedadesCompletas = [];
            $maxPropiedades = min(count($listadoBasico), 50);
            
            for ($i = 0; $i < $maxPropiedades; $i++) {
                $propBasica = $listadoBasico[$i];
                $codOfer = $propBasica['cod_ofer'] ?? null;
                
                if (!$codOfer) {
                    continue;
                }
                
                try {
                    // Obtener detalles completos de esta propiedad
                    $responseDetalle = callInmovillaAPI('/propiedades/' . $codOfer, []);
                    $detalleDecoded = json_decode($responseDetalle, true);
                    
                    // Log para debugging
                    error_log("Propiedad {$codOfer} - Respuesta detalle: " . json_encode($detalleDecoded));
                    
                    $propiedadCompleta = null;
                    
                    if (is_array($detalleDecoded)) {
                        // Si la respuesta es directamente un array, usar el primer elemento
                        if (isset($detalleDecoded[0]) && is_array($detalleDecoded[0])) {
                            $propiedadCompleta = $detalleDecoded[0];
                        } elseif (!isset($detalleDecoded['success']) && !isset($detalleDecoded['error'])) {
                            // Es un objeto de propiedad directamente
                            $propiedadCompleta = $detalleDecoded;
                        }
                    }
                    
                    // Buscar en diferentes estructuras posibles
                    if (!$propiedadCompleta && isset($detalleDecoded['data'])) {
                        if (is_array($detalleDecoded['data'])) {
                            $propiedadCompleta = $detalleDecoded['data'];
                        }
                    }
                    
                    if (!$propiedadCompleta && isset($detalleDecoded['ficha'])) {
                        if (is_array($detalleDecoded['ficha']) && isset($detalleDecoded['ficha'][0])) {
                            $propiedadCompleta = $detalleDecoded['ficha'][0];
                        } elseif (is_array($detalleDecoded['ficha'])) {
                            $propiedadCompleta = $detalleDecoded['ficha'];
                        }
                    }
                    
                    if ($propiedadCompleta && is_array($propiedadCompleta)) {
                        // Asegurar que cod_ofer esté presente
                        if (!isset($propiedadCompleta['cod_ofer'])) {
                            $propiedadCompleta['cod_ofer'] = $codOfer;
                        }
                        $propiedadesCompletas[] = $propiedadCompleta;
                    } else {
                        error_log("Propiedad {$codOfer} - No se pudo extraer datos completos, usando básicos");
                        // Si falla, usar al menos los datos básicos
                        $propiedadesCompletas[] = $propBasica;
                    }
                } catch (Exception $e) {
                    error_log("Error obteniendo detalles de propiedad {$codOfer}: " . $e->getMessage());
                    // Si falla, usar al menos los datos básicos
                    $propiedadesCompletas[] = $propBasica;
                }
                
                // Pequeña pausa para no sobrecargar la API
                usleep(100000); // 0.1 segundos entre llamadas
            }
            
            $data = ['paginacion' => $propiedadesCompletas];
            break;
            
        case 'ficha':
            // Obtener una propiedad específica por codOfer
            if (!$codOfer) {
                throw new Exception('codOfer es requerido para la acción ficha');
            }
            
            $response = callInmovillaAPI('/propiedades/' . $codOfer, []);
            $decoded = json_decode($response, true);
            
            // Adaptar estructura de respuesta
            if (isset($decoded['data'])) {
                $data = ['ficha' => [$decoded['data']]];
            } elseif (isset($decoded['ficha'])) {
                $data = $decoded;
            } elseif (is_array($decoded) && !isset($decoded['success'])) {
                $data = ['ficha' => [$decoded]];
            } else {
                $data = ['ficha' => []];
            }
            break;
            
        case 'destacados':
            // Obtener propiedades destacadas
            $response = callInmovillaAPI('/propiedades', [
                'destacado' => 1,
                'limit' => $limit,
                'order' => $order ?: 'precio'
            ]);
            $decoded = json_decode($response, true);
            
            // Adaptar estructura de respuesta
            if (isset($decoded['data'])) {
                $data = ['destacados' => $decoded['data']];
            } elseif (isset($decoded['destacados'])) {
                $data = $decoded;
            } elseif (is_array($decoded)) {
                $data = ['destacados' => $decoded];
            } else {
                $data = ['destacados' => []];
            }
            break;
            
        default:
            throw new Exception("Acción no válida: {$action}");
    }
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('[API REST Proxy] Error decodificando JSON: ' . json_last_error_msg());
        error_log('[API REST Proxy] Respuesta recibida: ' . substr($response ?? '', 0, 1000));
        throw new Exception('Error decodificando JSON: ' . json_last_error_msg() . '. Respuesta: ' . substr($response ?? '', 0, 500));
    }
    
    // Devolver respuesta JSON en el formato esperado por el frontend
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
