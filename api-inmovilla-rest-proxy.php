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
        $errorMsg = substr($response, 0, 500);
        error_log('[API REST Proxy] HTTP Error ' . $httpCode . ': ' . $errorMsg);
        // Lanzar excepción con el mensaje de error para que se maneje correctamente
        throw new Exception('HTTP Error ' . $httpCode . ': ' . $errorMsg);
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
                
                // Verificar que la respuesta no esté vacía
                if (empty($response)) {
                    throw new Exception('La API de Inmovilla devolvió una respuesta vacía para el listado básico');
                }
                
                $decoded = json_decode($response, true);
                
                // Verificar que el JSON se decodificó correctamente
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('Error decodificando JSON del listado básico: ' . json_last_error_msg() . '. Respuesta: ' . substr($response, 0, 500));
                }
                
                // Extraer listado básico
                $listadoBasico = [];
                if (is_array($decoded)) {
                    $listadoBasico = $decoded;
                } elseif (isset($decoded['data']) && is_array($decoded['data'])) {
                    $listadoBasico = $decoded['data'];
                } elseif (isset($decoded['error'])) {
                    throw new Exception('Error de la API: ' . ($decoded['mensaje'] ?? $decoded['error']));
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
                        error_log("[API REST Proxy] Propiedad sin cod_ofer, saltando");
                        continue;
                    }
                    
                    error_log("[API REST Proxy] Obteniendo detalles completos de propiedad {$codOfer} ({$i}/{$maxPropiedades})");
                    
                    // Usar el endpoint que sabemos que funciona: /propiedades/{codOfer}
                    // INTENTAR MÚLTIPLES VECES si falla
                    $responseDetalle = null;
                    $intentos = 0;
                    $maxIntentos = 3;
                    
                    while ($intentos < $maxIntentos && empty($responseDetalle)) {
                        try {
                            $intentos++;
                            error_log("[API REST Proxy] Intento {$intentos}/{$maxIntentos} para obtener detalles de {$codOfer}");
                            $responseDetalle = callInmovillaAPI('/propiedades/' . $codOfer, []);
                            
                            // Verificar que la respuesta no esté vacía y sea válida
                            if (!empty($responseDetalle)) {
                                // Verificar que sea JSON válido antes de continuar
                                $testDecoded = json_decode($responseDetalle, true);
                                if (json_last_error() === JSON_ERROR_NONE && !isset($testDecoded['error'])) {
                                    break; // Éxito, salir del loop
                                } else {
                                    error_log("[API REST Proxy] Respuesta inválida o con error para {$codOfer}: " . substr($responseDetalle, 0, 200));
                                    $responseDetalle = null; // Resetear para reintentar
                                }
                            }
                        } catch (Exception $e) {
                            error_log("[API REST Proxy] Intento {$intentos} falló para {$codOfer}: " . $e->getMessage());
                            $responseDetalle = null; // Resetear para reintentar
                            if ($intentos < $maxIntentos) {
                                usleep(200000); // Esperar 0.2 segundos antes de reintentar
                            }
                        }
                    }
                    
                    if (empty($responseDetalle)) {
                        error_log("[API REST Proxy] ❌ ERROR: No se pudieron obtener detalles de {$codOfer} después de {$maxIntentos} intentos");
                        // NO usar datos básicos - saltar esta propiedad completamente
                        continue;
                    }
                    
                    $detalleDecoded = json_decode($responseDetalle, true);
                    
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        error_log("[API REST Proxy] ❌ ERROR: Error decodificando JSON para {$codOfer}: " . json_last_error_msg());
                        error_log("[API REST Proxy] Respuesta raw (primeros 1000 chars): " . substr($responseDetalle, 0, 1000));
                        // NO usar datos básicos - saltar esta propiedad
                        continue;
                    }
                    
                    // Extraer datos completos de data.ficha[0] - ESTA ES LA ESTRUCTURA CORRECTA
                    $propiedadCompleta = null;
                    if (isset($detalleDecoded['data']['ficha'][0])) {
                        $propiedadCompleta = $detalleDecoded['data']['ficha'][0];
                        error_log("[API REST Proxy] ✅ Propiedad {$codOfer} - Datos completos extraídos de data.ficha[0]");
                    } elseif (isset($detalleDecoded['data']['ficha']) && is_array($detalleDecoded['data']['ficha']) && count($detalleDecoded['data']['ficha']) > 0) {
                        $propiedadCompleta = $detalleDecoded['data']['ficha'][0];
                        error_log("[API REST Proxy] ✅ Propiedad {$codOfer} - Datos completos extraídos de data.ficha[0] (alternativo)");
                    } else {
                        error_log("[API REST Proxy] ❌ ERROR: Estructura no reconocida para {$codOfer}");
                        error_log("[API REST Proxy] Keys disponibles: " . implode(', ', array_keys($detalleDecoded)));
                        if (isset($detalleDecoded['data'])) {
                            error_log("[API REST Proxy] Keys de data: " . implode(', ', array_keys($detalleDecoded['data'])));
                            if (isset($detalleDecoded['data']['ficha'])) {
                                error_log("[API REST Proxy] Tipo de data.ficha: " . gettype($detalleDecoded['data']['ficha']));
                                if (is_array($detalleDecoded['data']['ficha'])) {
                                    error_log("[API REST Proxy] Tamaño de data.ficha: " . count($detalleDecoded['data']['ficha']));
                                }
                            }
                        }
                        // NO usar datos básicos - saltar esta propiedad
                        continue;
                    }
                    
                    if (!$propiedadCompleta || !is_array($propiedadCompleta)) {
                        error_log("[API REST Proxy] ❌ ERROR: No se pudo extraer datos completos para {$codOfer}");
                        // NO usar datos básicos - saltar esta propiedad
                        continue;
                    }
                    
                    // VERIFICAR que tenga los campos necesarios - si no los tiene, NO incluirla
                    $tieneTitulo = isset($propiedadCompleta['tituloes']) || isset($propiedadCompleta['titulo1']);
                    $tieneDescripcion = isset($propiedadCompleta['descripciones']) || isset($propiedadCompleta['descrip1']);
                    $tienePrecio = isset($propiedadCompleta['precioalq']) || isset($propiedadCompleta['precioinmo']);
                    
                    if (!$tieneTitulo && !$tieneDescripcion && !$tienePrecio) {
                        error_log("[API REST Proxy] ❌ ERROR: Propiedad {$codOfer} no tiene título, descripción ni precio - NO incluir");
                        continue; // NO incluir propiedades sin datos esenciales
                    }
                    
                    // Asegurar que cod_ofer esté presente
                    if (!isset($propiedadCompleta['cod_ofer'])) {
                        $propiedadCompleta['cod_ofer'] = $codOfer;
                    }
                    
                    // Construir URLs de imágenes SIEMPRE si numfotos > 0
                    $numfotos = isset($propiedadCompleta['numfotos']) ? intval($propiedadCompleta['numfotos']) : 0;
                    $fotoletra = isset($propiedadCompleta['fotoletra']) ? $propiedadCompleta['fotoletra'] : '1';
                    $numagencia = isset($propiedadCompleta['numagencia']) ? $propiedadCompleta['numagencia'] : INMOVILLA_NUMAGENCIA;
                    
                    // SIEMPRE construir las URLs de imágenes si hay fotos
                    if ($numfotos > 0) {
                        $imagenes = [];
                        for ($j = 1; $j <= $numfotos; $j++) {
                            $urlImagen = "https://fotos15.apinmo.com/{$numagencia}/{$codOfer}/{$fotoletra}-{$j}.jpg";
                            $imagenes[] = $urlImagen;
                        }
                        $propiedadCompleta['imagenes'] = $imagenes;
                        error_log("[API REST Proxy] Propiedad {$codOfer} - Construidas {$numfotos} URLs de imágenes");
                    } else {
                        error_log("[API REST Proxy] Propiedad {$codOfer} - numfotos = 0, no hay imágenes");
                    }
                    
                    // VERIFICAR y LOGUEAR todos los campos importantes
                    $titulo = isset($propiedadCompleta['tituloes']) ? $propiedadCompleta['tituloes'] : (isset($propiedadCompleta['titulo1']) ? $propiedadCompleta['titulo1'] : null);
                    $descripcion = isset($propiedadCompleta['descripciones']) ? $propiedadCompleta['descripciones'] : (isset($propiedadCompleta['descrip1']) ? $propiedadCompleta['descrip1'] : null);
                    $precio = isset($propiedadCompleta['precioalq']) ? $propiedadCompleta['precioalq'] : (isset($propiedadCompleta['precioinmo']) ? $propiedadCompleta['precioinmo'] : null);
                    $tipo = isset($propiedadCompleta['keyacci']) ? ($propiedadCompleta['keyacci'] == 2 ? 'alquiler' : 'venta') : null;
                    
                    error_log("[API REST Proxy] ✅ Propiedad {$codOfer} - VERIFICACIÓN FINAL:");
                    error_log("[API REST Proxy]   - Título: " . ($titulo ? substr($titulo, 0, 50) . '...' : 'NO'));
                    error_log("[API REST Proxy]   - Descripción: " . ($descripcion ? substr($descripcion, 0, 50) . '...' : 'NO'));
                    error_log("[API REST Proxy]   - Precio: " . ($precio ? $precio : 'NO'));
                    error_log("[API REST Proxy]   - Tipo: " . ($tipo ? $tipo : 'NO'));
                    error_log("[API REST Proxy]   - Imágenes: " . (isset($propiedadCompleta['imagenes']) ? count($propiedadCompleta['imagenes']) : 0));
                    error_log("[API REST Proxy]   - Total campos: " . count($propiedadCompleta));
                    
                    // AGREGAR la propiedad con TODOS sus datos completos
                    $propiedadesCompletas[] = $propiedadCompleta;
                    
                    // Pequeña pausa para no sobrecargar la API
                    usleep(50000); // 0.05 segundos entre llamadas
                }
                
                error_log("[API REST Proxy] Total propiedades completas obtenidas: " . count($propiedadesCompletas));
                
                // NO usar datos básicos como fallback - solo devolver propiedades con datos completos
                if (count($propiedadesCompletas) === 0) {
                    error_log("[API REST Proxy] ⚠️ No se pudieron obtener detalles completos de ninguna propiedad");
                    // Devolver array vacío en lugar de datos básicos
                    $data = ['paginacion' => []];
                } else {
                    $data = ['paginacion' => $propiedadesCompletas];
                }
            } catch (Exception $e) {
                error_log("[API REST Proxy] Error en case propiedades: " . $e->getMessage());
                error_log("[API REST Proxy] Stack trace: " . $e->getTraceAsString());
                // NO usar datos básicos - devolver error o array vacío
                throw $e; // Lanzar excepción para que se capture en el catch general
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
