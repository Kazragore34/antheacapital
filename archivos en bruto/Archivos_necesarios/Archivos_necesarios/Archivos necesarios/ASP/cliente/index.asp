<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<%
  Dim cliente
cliente=request.Querystring ("cliente") 
msj=request.Querystring ("msj") 
col=request.Querystring ("col") 
estadistica=request.Querystring ("estadistica") 
if msj<>"" then cliente=cliente & "&msj=1"
if col<>"" then cliente=cliente & "&col=" & col

if cliente<>"" then %>

    <iframe allowFullScreen="true" width="100%" height="100%" SRC="https://ap.apinmo.com/app/escaparatecliente/index.php?cliente=<% response.write(cliente) %>" frameBorder=0 NORESIZE
            SCROLLING="AUTO" allow="camera *;microphone *" sandbox="allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads"></iframe>

    </html>

<% End If 
if estadistica<>"" then %>
    <iframe allowFullScreen="true" width="100%" height="100%" SRC="https://ap.apinmo.com/app/propietarios/index.php?cliente=<% response.write(estadistica) %>" frameBorder=0 NORESIZE
            SCROLLING="AUTO" allow="camera *;microphone *" sandbox="allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads"></iframe>

    </html>


<% End If %>
