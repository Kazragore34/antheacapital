<?php
	error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING ^ E_DEPRECATED);
?>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            body, html, iframe {
                margin: 0;
                border: 0;
                padding: 0;
            }
        </style>
</head>
<?php
  $cliente=$_GET["cliente"];
  $msj=$_GET["msj"];
  if ($msj!="") $cliente=$cliente ."&msg=1";
  $estadistica=$_GET["estadistica"];
  if(isset($_GET["col"]))
	$cliente.="&col=".$_GET["col"];
if ($cliente!=""){

?>
    <iframe allowFullScreen="true" width="100%" height="100%" SRC="https://ap.apinmo.com/app/escaparatecliente/index.php?cliente=<?php echo $cliente; ?>&x=<?= time() ?>" frameBorder=0 NORESIZE
            SCROLLING="AUTO" allow="camera *;microphone *" sandbox="allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads"></iframe>

    </html>


<?php
}
if ($estadistica!=""){ ?>

    <iframe allowFullScreen="true" width="100%" height="100%" SRC="https://ap.apinmo.com/app/propietarios/index.php?cliente=<?php echo $estadistica; ?>&x=<?= time() ?>" frameBorder=0 NORESIZE
            SCROLLING="AUTO" allow="camera *;microphone *" sandbox="allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads"></iframe>

    </html>

<?php
}
?>