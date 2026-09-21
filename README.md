# Game Zone X - Semana 6

Actividad sumativa de **Desarrollo Frontend I (PFY2201)**: “Optimizando la lógica y rendimiento de una página web con JavaScript”.

## Funcionalidades implementadas

- Bootstrap 5 con diseño responsive para escritorio, tablet y móvil.
- Barra de navegación responsive con categorías simuladas: Todos, Consolas, Accesorios y Portátiles.
- Catálogo cargado dinámicamente desde `assets/js/productos.json` mediante Fetch API.
- Validación de `response.ok` y manejo de errores con un mensaje amigable para el usuario.
- Creación de tarjetas con `createElement`, `textContent` y `appendChild`.
- Evento `click` para agregar productos al carrito.
- Resumen dinámico del carrito con cantidad, subtotal, total, eliminación y vaciado.
- Evento `submit` para procesar la búsqueda de productos sin recargar la página.
- Código separado en funciones reutilizables y comentadas.
- Footer con información de contacto y accesos internos.

## Estructura

```text
index.html
assets/
├── css/
│   └── styles.css
├── img/
│   ├── ps5.jpg
│   ├── xbox.jpg
│   ├── switch.jpg
│   ├── control.svg
│   ├── audifonos.svg
│   └── cargador.svg
└── js/
    ├── app.js
    └── productos.json
capturas/
└── INSTRUCCIONES_CAPTURAS.txt
README.md
```

## Ejecución

Para que Fetch API cargue el JSON correctamente, ejecutar el proyecto mediante un servidor local (por ejemplo, desde IntelliJ con **Open in Browser**) o mediante GitHub Pages. No se recomienda abrir `index.html` directamente con una URL `file:///`.

## Evidencias recomendadas

Antes de entregar, guardar en `capturas/` imágenes reales que demuestren:

1. Vista general del sitio en escritorio.
2. Diseño responsive en móvil.
3. Productos agregados y resumen dinámico del carrito.
4. Búsqueda ejecutada mediante el formulario.
5. Productos cargados con Fetch API.

## Publicación

Para la entrega final, publicar **solo este proyecto de Semana 6** en un repositorio público independiente y habilitar GitHub Pages. Esto facilita la revisión directa de la actividad sumativa.
