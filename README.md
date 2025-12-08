PRE ENTREGA 1 - Backend I 
Ignacio Gonzalez Inigo

Para probar el GET
curl.exe "http://localhost:8080/api/products"

Para probar el GET por ID
curl.exe "http://localhost:8080/api/products/idProducto"

Para probar el POST 
$payload = @{ Aca va el objeto a pushear
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/products" `
  -ContentType "application/json" -Body $payload

Para probar el PUT
$update = @{
  Aca va el objeto con cambios
} | ConvertTo-Json

Invoke-RestMethod -Method PUT -Uri "http://localhost:8080/api/products/idProducto" `
  -ContentType "application/json" -Body $update


Para probar el delete
Invoke-RestMethod -Method DELETE -Uri "http://localhost:8080/api/products/idProducto"

Para probar el carrito....

Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/carts"
curl.exe "http://localhost:8080/api/carts/idCarrito"
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/carts/idCarrito/product/idProducto"

$qty = @{ quantity = x } | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/carts/CID_AQUI/product/PID_AQUI" `
  -ContentType "application/json" -Body $qty
