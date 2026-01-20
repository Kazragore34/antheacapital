<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING ^ E_DEPRECATED);

$codigo=$_GET["codigo"];

$soyinmo=substr($codigo,0,strpos($codigo,"_"));

$datofe=substr($codigo,strpos($codigo,"_")+1,strlen($codigo));

$url = "https://crm.inmovilla.com/new/app/escaparatecliente/panelpropietario/ficha.php?idioma=1&codOfer=$datofe&numagencia=$soyinmo&datosAgencia=$soyinmo&formato=ficha";

?>

<iframe allowFullScreen="true" width="100%" height="100%" SRC="<?php echo $url; ?>" frameBorder=0 NORESIZE
            SCROLLING="AUTO" allow="camera *;microphone *" sandbox="allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads"></iframe>

<script>
/*
function detectarResolucion()
{
    if(screen.width <= 500)
    {
            window.location ='<?php //echo "$inmoweb/movil/fichapiso.php?soyinmo=$soyinmo&datoofe=$datofe"; ?>' ;// Acá va la página de resolución pequeña
    }
    else
    {
            window.location = '<?php //echo "$inmoweb/fichapiso.php?soyinmo=$soyinmo&datoofe=$datofe"; ?>';// Acá va la página de resolución grande
    }
    //Si quieres agregar mas resoluciones simplemente agrega un 
    //else if(screen.width == el ancho && screen.height == el alto)
    //{
    //        window.location = "web-para-esa-resolucion.html";
    //}
    
}*/
//window.location='<?php echo "$inmoweb/fichapiso.php?soyinmo=$soyinmo&datoofe=$datofe"; ?>';
</script>