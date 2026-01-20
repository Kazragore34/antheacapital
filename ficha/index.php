<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING ^ E_DEPRECATED);

$codigo = $_GET["codigo"];

if (!$codigo) {
    // Si no hay código, redirigir a la página principal
    header("Location: https://antheacapital.com/propiedades");
    exit;
}

// Separar numagencia y cod_ofer
$parts = explode("_", $codigo);
$numagencia = isset($parts[0]) ? $parts[0] : '';
$cod_ofer = isset($parts[1]) ? $parts[1] : '';

if (!$cod_ofer) {
    // Si no hay cod_ofer válido, redirigir a la página principal
    header("Location: https://antheacapital.com/propiedades");
    exit;
}

// Redirigir a la página de propiedades con el post_id
$redirectUrl = "https://antheacapital.com/propiedades?post_id=" . urlencode($cod_ofer);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirigiendo...</title>
    <script>
        // Redirección inmediata usando JavaScript
        window.location.href = "<?php echo $redirectUrl; ?>";
    </script>
    <meta http-equiv="refresh" content="0;url=<?php echo htmlspecialchars($redirectUrl); ?>">
</head>
<body>
    <p>Redirigiendo a la propiedad...</p>
    <p>Si no eres redirigido automáticamente, <a href="<?php echo htmlspecialchars($redirectUrl); ?>">haz clic aquí</a>.</p>
</body>
</html>
