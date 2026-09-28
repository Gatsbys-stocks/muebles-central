# Muebles Central

Tienda online de **Muebles Central**, tienda de muebles y electrodomésticos del Raval de Barcelona (C/ del Carme 106). Diseño inspirado en Maisons du Monde: menú desplegable por estancias, fotografía grande y catálogo limpio. Consume el [Muebles Central Backend](https://github.com/Gatsbys-stocks/muebles-central-backend) para todo lo que requiere servidor.

## El problema que resolví

La tienda enseñaba sus muebles por TikTok (@muebles_central) y cerraba las ventas por WhatsApp. Necesitaba una web propia con catálogo, carrito y pedido online que el dueño pudiera mantener sin depender de nadie, con su identidad (logo, rosa de la tienda, dorado) y con sitio para su Instagram cuando lo abra.

## Qué hice

- **Portada estilo Maisons du Monde**: barra de avisos, menú con desplegable grande por estancias (escritorio) y acordeón en móvil, hero con fotos reales de la tienda, categorías con ilustraciones, banners de colchones a medida y sofás cama, destacados y servicios.
- **Catálogo servido por el backend** (`GET /api/products`): lo que la tienda sube desde su panel aparece en la web sin tocar código. Si el backend no responde, se muestra un catálogo de respaldo y los pedidos se derivan a WhatsApp.
- **Filtros**: categoría, tipo de mueble (solo los que tienen productos), buscador en tiempo real, orden por precio y sección de ofertas.
- **Ficha de producto**: galería, medidas, colores o firmeza, montaje opcional, cantidad, "Preguntar por WhatsApp" con el producto ya escrito y enlace directo (`#p-<id>`).
- **Favoritos y carrito persistentes** en `localStorage`.
- **Checkout** con envío a domicilio (precio por código postal calculado en el servidor) o recogida en tienda, montaje, pago con tarjeta (Stripe) o en la entrega. Los datos del cliente se recuerdan para el siguiente pedido.
- **Redes**: sección de TikTok con los vídeos de la tienda y hueco para Instagram que se activa solo al escribir el usuario en el panel de ajustes.
- **Datos de la tienda desde la API**: horario, teléfonos, WhatsApp y redes se leen de `/api/settings`.

## Decisiones técnicas

- **Cero dependencias de build**: `index.html`, `css/style.css`, `js/app.js` y `js/illustrations.js`. Se aloja en GitHub Pages tal cual.
- **Tokens de diseño en `:root`**: la paleta sale del propio local (rosa de las flores, dorado del mobiliario).
- **El precio no se decide en el navegador**: el resumen del checkout viene de `POST /api/shipping/quote`.
- **Ilustraciones de respaldo**: mientras un producto no tiene foto, se dibuja un icono de línea de su tipo (sofá, cama, tocador…), así el catálogo nunca queda con huecos vacíos.
- **Vuelta de Stripe por query params** (`?payment=success|cancelled&order=…`): se muestra el aviso y se limpia la URL.
- **Accesible y usable en móvil**: foco visible, Escape cierra paneles, modales tipo hoja inferior en móvil, `prefers-reduced-motion`.

## Cómo encaja con el backend

```
index.html
  → catálogo      GET  {API_BASE_URL}/api/products (+ /categories)
  → ajustes       GET  {API_BASE_URL}/api/settings
  → resumen       POST {API_BASE_URL}/api/shipping/quote
  → pedido        POST {API_BASE_URL}/api/orders
  → pago          POST {API_BASE_URL}/api/orders/:id/checkout → Stripe Checkout
```

`API_BASE_URL` está al principio de `js/app.js`. En `localhost` apunta solo a `http://localhost:3000`.

## Estructura

```
index.html
css/style.css          # estilos (tokens en :root)
js/app.js              # catálogo, filtros, ficha, favoritos, carrito, checkout
js/illustrations.js    # dibujos de línea por tipo de mueble
img/                   # logo y fotos de la tienda
```

## Probar en local

```bash
# en muebles-central-backend
npm start
# en esta carpeta
python3 -m http.server 8080   # http://localhost:8080
```

## Stack

HTML5 · CSS3 (custom properties) · JavaScript vanilla · Google Fonts (Cormorant Garamond, Jost) · Stripe Checkout
