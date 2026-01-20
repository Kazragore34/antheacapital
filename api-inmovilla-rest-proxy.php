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
            // Obtener todas las propiedades con datos completos
            // El endpoint /propiedades sin parámetros da error 400 "Faltan parámetros"
            // El endpoint /propiedades/?listado solo devuelve datos básicos
            // Solución: obtener listado básico y luego detalles completos usando /propiedades/{codOfer}
            try {
                // Paso 1: Obtener listado básico
                $response = callInmovillaAPI('/propiedades/?listado', []);
                $decoded = json_decode($response, true);
                
                // Extraer listado básico
                $listadoBasico = [];
                if (is_array($decoded)) {
                    $listadoBasico = $decoded;
                } elseif (isset($decoded['data']) && is_array($decoded['data'])) {
                    $listadoBasico = $decoded['data'];
                }
                
                error_log("[API REST Proxy] Listado básico obtenido: " . count($listadoBasico) . " propiedades");
                
                // Paso 2: Obtener detalles completos de cada propiedad usando /propiedades/{codOfer}
                // Limitar a las primeras propiedades para evitar timeout
                $maxPropiedades = min(count($listadoBasico), $limit > 0 ? $limit : 100);
                $propiedadesCompletas = [];
                
                for ($i = 0; $i < $maxPropiedades; $i++) {
                    $propBasica = $listadoBasico[$i];
                    $codOfer = $propBasica['cod_ofer'] ?? null;
                    
                    if (!$codOfer) {
                        continue;
                    }
                    
                    try {
                        // Usar el endpoint que sabemos que funciona: /propiedades/{codOfer}
                        $responseDetalle = callInmovillaAPI('/propiedades/' . $codOfer, []);
                        $detalleDecoded = json_decode($responseDetalle, true);
                        
                        // Extraer datos completos de data.ficha[0]
                        if (isset($detalleDecoded['data']['ficha'][0])) {
                            $propiedadCompleta = $detalleDecoded['data']['ficha'][0];
                            
                            // Construir URLs de imágenes si numfotos > 0
                            $numfotos = isset($propiedadCompleta['numfotos']) ? intval($propiedadCompleta['numfotos']) : 0;
                            $fotoletra = isset($propiedadCompleta['fotoletra']) ? $propiedadCompleta['fotoletra'] : '1';
                            $numagencia = isset($propiedadCompleta['numagencia']) ? $propiedadCompleta['numagencia'] : INMOVILLA_NUMAGENCIA;
                            
                            if ($numfotos > 0 && !isset($propiedadCompleta['imagenes'])) {
                                $imagenes = [];
                                for ($j = 1; $j <= $numfotos; $j++) {
                                    $urlImagen = "https://fotos15.apinmo.com/{$numagencia}/{$codOfer}/{$fotoletra}-{$j}.jpg";
                                    $imagenes[] = $urlImagen;
                                }
                                $propiedadCompleta['imagenes'] = $imagenes;
                            }
                            
                            $propiedadesCompletas[] = $propiedadCompleta;
                        } else {
                            // Si no se pueden obtener detalles completos, usar al menos los básicos
                            $propiedadesCompletas[] = $propBasica;
                        }
                    } catch (Exception $e) {
                        error_log("[API REST Proxy] Error obteniendo detalles de {$codOfer}: " . $e->getMessage());
                        // Si falla, usar al menos los datos básicos
                        $propiedadesCompletas[] = $propBasica;
                    }
                    
                    // Pequeña pausa para no sobrecargar la API
                    usleep(50000); // 0.05 segundos entre llamadas
                }
                
                error_log("[API REST Proxy] Total propiedades completas obtenidas: " . count($propiedadesCompletas));
                
                $data = ['paginacion' => $propiedadesCompletas];
            } catch (Exception $e) {
                error_log("[API REST Proxy] Error en case propiedades: " . $e->getMessage());
                error_log("[API REST Proxy] Stack trace: " . $e->getTraceAsString());
                throw $e; // Re-lanzar para que se capture en el catch general
            }
            break;
            
        case 'ficha':
            // Obtener una propiedad específica por codOfer
            if (!$codOfer) {
                throw new Exception('codOfer es requerido para la acción ficha');
            }
            
            // Intentar diferentes formatos de endpoint
            $endpointsToTry = [
                '/propiedades/' . $codOfer,
                '/propiedades/?cod_ofer=' . $codOfer,
                '/propiedades/?id=' . $codOfer,
                '/propiedad/' . $codOfer,
                '/propiedad/?cod_ofer=' . $codOfer
            ];
            
            $response = null;
            $lastError = null;
            foreach ($endpointsToTry as $endpoint) {
                try {
                    error_log("[API REST Proxy] [FICHA] Intentando endpoint: {$endpoint}");
                    $response = callInmovillaAPI($endpoint, []);
                    $testDecoded = json_decode($response, true);
                    
                    // Si no hay error 404, usar este endpoint
                    if (!isset($testDecoded['error']) || strpos($response, '404') === false) {
                        error_log("[API REST Proxy] [FICHA] Endpoint exitoso: {$endpoint}");
                        break;
                    }
                } catch (Exception $e) {
                    $lastError = $e->getMessage();
                    error_log("[API REST Proxy] [FICHA] Endpoint {$endpoint} falló: " . $e->getMessage());
                    continue;
                }
            }
            
            if (!$response) {
                throw new Exception("Todos los endpoints fallaron para ficha. Último error: " . ($lastError ?? 'Desconocido'));
            }
            
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
