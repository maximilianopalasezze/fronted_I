# Game Zone X — Semana 8

## Enlaces de entrega

- [Código de la Semana 8](https://github.com/maximilianopalasezze/fronted_I/tree/semana8-entrega)
- [Aplicación en GitHub Pages](https://maximilianopalasezze.github.io/fronted_I/)
- [Rama de despliegue gh-pages](https://github.com/maximilianopalasezze/fronted_I/tree/gh-pages)
- [Evidencias con explicación](docs/EVIDENCIAS.md)

Las diez capturas nuevas se encuentran en `docs/evidencias/semana8/`, con explicación en `docs/EVIDENCIAS.md`.

## Funcionalidades

- Seis productos con nombre, precio normal, precio oferta, descripción corta e imagen.
- Oferta identificada mediante etiqueta y precio normal tachado. Los importes se expresan en CLP.
- Carrito con agregar, incrementar/disminuir unidades, eliminar un producto completo y vaciar.
- Contador de **unidades totales**, subtotales, ahorro y total calculados al precio de oferta vigente.
- Categorías Todos, Consolas, Accesorios y Portátiles, combinadas con búsqueda en tiempo real que tolera tildes y mayúsculas.
- Estados condicionales de carga, error con reintento, búsqueda sin resultados y carrito vacío.
- Navegación móvil controlada por React, etiquetas accesibles y mensajes anunciados con `aria-live`.
- Catálogo separado en `public/assets/data/productos.json`, siguiendo la recomendación del profesor. Vite lo publica como `assets/data/productos.json`.

## Ejecutar en Windows

Se requiere **Node.js 22.12 o superior** y npm. Abrir PowerShell en la carpeta del proyecto descomprimido, donde está `package.json`:

```powershell
npm ci
npm run dev
```

Abrir la dirección que muestre Vite, normalmente `http://localhost:5173/fronted_I/`. Para detener el servidor, presionar `Ctrl+C`.

**No abrir `index.html` con doble clic:** React/JSX requiere Vite y el catálogo utiliza Fetch API. Para ver la entrega sin instalar programas, usar el enlace de GitHub Pages.

## Compilar y revisar la versión de producción

```powershell
npm run build
npm run preview
```

La compilación se guarda en `dist/`. La vista previa queda normalmente en `http://localhost:4173/fronted_I/`.

## Pruebas reproducibles

```powershell
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Las seis pruebas unitarias validan las reglas de precios, cantidades, inmutabilidad, filtros y estructura del JSON. Las siete pruebas de navegador validan flujos reales, simulan fallos de red y generan diez capturas en `docs/evidencias/semana8/`. Playwright inicia la vista previa automáticamente.

## Organización

```text
public/assets/
  data/productos.json       # Datos separados del código
  img/                     # Imágenes del eCommerce original
src/
  main.jsx                 # Montaje de React e importación de Bootstrap
  App.jsx                  # Estado compartido y coordinación
  components/
    Navbar.jsx             # Categorías, búsqueda y menú responsive
    Hero.jsx               # Portada de Game Zone X
    ProductList.jsx        # Listado y estados de carga/error/vacío
    ProductCard.jsx        # Tarjeta reutilizable y ofertas
    Cart.jsx               # Resumen y estado vacío
    CartItem.jsx           # Cantidades, subtotal y eliminación
    Footer.jsx             # Pie y navegación
  hooks/useProductos.js    # Fetch, validación, cancelación y reintento
  utils/catalogo.js        # Categorías, búsqueda y validación
  utils/carrito.js         # Operaciones inmutables, precios y totales
  styles.css               # Estilos Bootstrap complementarios
 tests/                    # Pruebas unitarias y de navegador
 docs/                     # Capturas y explicación de evidencias
 index.html
 package.json
 package-lock.json
 vite.config.js
 playwright.config.js
```

## Estado y flujo de datos

`App` mantiene carrito, categoría, búsqueda y mensaje con `useState`. El hook `useProductos` mantiene productos, estado de carga e intento. `Navbar` mantiene el estado del menú móvil. Los componentes reciben datos y callbacks mediante props; las listas usan `key={id}`.

Los cambios del carrito usan actualizadores funcionales (`setCarrito(actual => ...)`) y nuevas listas con `map`, `filter` y spread. El contador, total, ahorro y catálogo filtrado se **derivan** del estado; no se almacenan duplicados. Las funciones de negocio pueden probarse sin renderizar componentes.

`onClick` maneja carrito, filtros, menú y reintento; `onChange` actualiza el campo controlado de búsqueda; `onSubmit` impide recargar y lleva al catálogo. React controla el contenido de la interfaz; no se construyen tarjetas con `createElement`.

## Publicar actualizaciones en GitHub Pages

La rama `semana8-entrega` contiene el código fuente. La rama `gh-pages` contiene el resultado de la compilación de React. `base: '/fronted_I/'` en Vite configura las rutas del repositorio.

Con permiso de escritura en el repositorio y Git autenticado:

```powershell
npm ci
npm run deploy
```

El script `predeploy` compila y `gh-pages -d dist` publica. En GitHub, **Settings → Pages → Deploy from a branch → gh-pages → / (root)**. No seleccionar la rama de JSX como contenido estático. La Semana 7 permanece disponible en `semana7-entrega`.

## Alcance

Aplicación académica de frontend: no realiza pagos, no envía pedidos ni guarda datos personales. El carrito se mantiene durante la sesión de la página y se reinicia al recargar, tal como corresponde a esta implementación con `useState`. Las ofertas son datos de demostración, no precios comerciales verificados. Imágenes y marca conservadas del proyecto anterior.



El flujo `App → ProductList → ProductCard` transmite `cantidadEnCarrito`, calculada desde el mismo estado `carrito` que usa el resumen. El botón es azul y dice **Agregar al carrito** cuando el producto está ausente; cambia a verde y **✓ En el carrito** cuando está presente. Muestra la cantidad y permite agregar otra unidad. Al eliminar o vaciar, recupera su texto inicial; al filtrar, conserva el estado real del carrito.

No se mantiene un booleano adicional que pueda desincronizarse. El contador y los totales se derivan del carrito. `useEffect` carga el JSON, valida los datos, actualiza productos/estado y cancela solicitudes al desmontar o reintentar.

GitHub Actions valida los cambios de código de `semana8-entrega` mediante instalación limpia, seis pruebas unitarias, compilación y siete pruebas de Chromium. Guarda diez capturas como artefacto `evidencias-semana8`. También permite ejecución manual desde Actions. Los cambios exclusivos de documentación no repiten las pruebas.
