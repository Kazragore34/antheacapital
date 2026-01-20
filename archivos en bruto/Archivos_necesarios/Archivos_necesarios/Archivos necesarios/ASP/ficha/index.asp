<%
codigo=request("codigo")
response.write codigo
agencia=mid(codigo,1,instr(codigo,"_")-1)
codigo=mid(codigo,instr(codigo,"_")+1)
Response.Redirect("https://crm.inmovilla.com/new/app/escaparatecliente/panelpropietario/ficha.php?idioma=1&codOfer=" & codigo & "&numagencia=" & agencia & "&datosAgencia=" & agencia & "&formato=ficha")
%>