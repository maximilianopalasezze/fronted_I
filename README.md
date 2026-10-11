# Game Zone X — Evaluación Final Semana 9

Tienda académica de videojuegos para Desarrollo Frontend I (PFY2201). Incluye catálogo dinámico, filtros, búsqueda, carrito, gestión de videojuegos y contacto validado con HTML5, CSS3, Bootstrap 5, JavaScript y React.

**Alumno:** Maximiliano Emanuel Palasezze. **Rama:** `semana9-evaluacion-final`, creada desde `semana8-entrega` conservando su historial.

## Instalación en Windows

Requiere Node.js 22.12 o superior y npm. Descomprime el ZIP y abre PowerShell en la carpeta que contiene `package.json`:

```powershell
npm ci
npm run dev
```

Abre `http://localhost:5173/fronted_I/` o la dirección que indique Vite. Detén el servidor con `Ctrl+C`. No abras `index.html` con doble clic: JSX y Fetch requieren el servidor.

Para comprobar producción:

```powershell
npm run build
npm run preview
```

La compilación se guarda en `dist/`; la vista previa usa `http://localhost:4173/fronted_I/`.

## Uso

1. **Inicio y videojuegos:** diez videojuegos con las portadas aportadas por el alumno, nombre, descripción, categoría y precios en CLP. Nueve tienen oferta y Dark Souls usa su precio normal.
2. **Filtros:** selecciona Acción, Aventura, Deportes, Carreras o Rol (RPG). Combina el filtro con la búsqueda, que reconoce tildes y mayúsculas. “Mostrar todos” limpia ambos criterios.
3. **Carrito:** agrega juegos, suma o resta unidades, elimina una línea o vacía el carrito. El contador representa unidades; subtotal, ahorro y total se calculan desde el mismo estado.
4. **Gestionar catálogo:** completa título, categoría, precio entero en CLP, descripción y portada; pulsa “Agregar videojuego”. El listado se actualiza y se limpian los filtros para mostrar el nuevo juego. Para eliminarlo, pulsa “Retirar” y confirma; “Cancelar” conserva el juego. El retiro también elimina sus unidades del carrito.
5. **Contacto:** introduce nombre, email y mensaje. Los campos vacíos, espacios, correo incorrecto y mensaje demasiado corto muestran errores junto a cada campo y enfocan el primero inválido. Un formulario válido muestra una confirmación y se limpia.
6. **Errores de carga:** si falla la petición o el JSON es inválido, el catálogo muestra un error y permite un reintento real. La gestión espera hasta que la carga sea correcta.

## Catálogo

| Videojuego | Categoría |
| --- | --- |
| Assassin’s Creed Black Flag Resynced | Aventura |
| Call of Duty: Black Ops 6 | Acción |
| Crash Team Racing Nitro-Fueled | Carreras |
| Need for Speed: Most Wanted | Carreras |
| Dark Souls | Rol (RPG) |
| Uncharted 4: A Thief’s End | Aventura |
| Diablo III | Rol (RPG) |
| God of War Ragnarök | Acción |
| EA SPORTS FC 27 | Deportes |
| NBA 2K27 | Deportes |

Las imágenes se conservan completas, sin recortar, y se sirven desde el propio proyecto. Las descripciones son breves resúmenes redactados para esta tienda académica.

## Alcance de la demostración

Los precios y ofertas en CLP son datos de demostración. Las diez portadas fueron aportadas por el alumno. Los nombres corresponden a las portadas, incluidos EA SPORTS FC 27 y NBA 2K27; sus textos describen fútbol y baloncesto sin atribuir novedades específicas a esas ediciones. No se realizan pagos ni pedidos. El formulario valida los datos y simula el envío; **no envía correos** y lo indica en pantalla. No se requiere backend en esta EFT. El carrito y los cambios del catálogo duran hasta recargar; el JSON original no se modifica. La gestión está abierta para demostrar agregar/eliminar con React; una tienda real necesitaría autenticación y persistencia en servidor.

## Estructura y decisiones del código

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `src/main.jsx` | Monta React e importa Bootstrap 5 local, sin depender de un CDN. |
| `src/App.jsx` | Coordina catálogo, filtros y carrito; transmite datos y callbacks por props. |
| `src/hooks/useProductos.js` | Carga el JSON con `useEffect`, valida, cancela con `AbortController`, reintenta y modifica el catálogo con `useState`. |
| `src/hooks/useCarrito.js` | Estado y operaciones del carrito; extraído según la retroalimentación del profesor. |
| `src/components/Navbar.jsx` | Navegación a Inicio, Videojuegos, Gestión y Contacto; búsqueda y menú móvil. |
| `src/components/ProductList.jsx` y `ProductCard.jsx` | Filtros y tarjetas reutilizables generadas con `map` y claves estables. |
| `src/components/Cart.jsx` y `CartItem.jsx` | Resumen, cantidades, precios y eliminación de líneas. |
| `src/components/CatalogManager.jsx` | Agregar videojuegos, validar y confirmar su retiro. |
| `src/components/ContactForm.jsx` | Campos controlados, errores y confirmación de contacto. |
| `src/components/FormField.jsx` | Etiquetas y errores accesibles compartidos por ambos formularios. |
| `src/utils/` | Funciones puras de catálogo, carrito y validación de formularios. |
| `public/assets/data/productos.json` | Lista de objetos JavaScript/JSON con los datos del catálogo. |
| `public/assets/img/` | Logo conservado y diez portadas del ZIP proporcionado. |
| `src/styles.css` | Estilos complementarios, Flexbox con utilidades Bootstrap y ajustes responsivos. |
| `tests/` | Pruebas unitarias y flujos de navegador. |
| `docs/` | Evidencias explicadas de Semana 9 e historial separado de Semana 8. |

Se usan etiquetas `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`, la grilla responsiva de Bootstrap, tarjetas, formularios, botones, alertas y utilidades Flexbox. Los elementos tienen etiquetas, foco visible y mensajes con `aria-live`.

**DOM dinámico:** JavaScript recorre los objetos del catálogo con `map`; React renderiza y actualiza las tarjetas en el DOM al cambiar el estado. No se combina `innerHTML` con React. `onChange`, `onClick` y `onSubmit` conectan la interactividad. Los formularios evitan recargar con `preventDefault`.

Los componentes reciben objetos y funciones mediante props. Contadores, totales y productos filtrados son datos derivados; no se duplican en estados. Se usan actualizaciones funcionales e inmutables. Cada nuevo juego obtiene un ID incremental que no se reutiliza después de un retiro. Las validaciones de campos, precios y IDs evitan entradas inconsistentes.

## Pruebas

```powershell
npm test
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
```

Hay 10 pruebas unitarias y 16 escenarios end-to-end configurados en tres motores (48 ejecuciones). Cubren precios, cantidades, inmutabilidad, filtros combinados, JSON inválido, carga, reintento, contacto, agregar/retirar juegos, cancelación, catálogo vacío y pantallas de 320, 390, 768 y 1440 píxeles. Para ejecutar solo Chromium:

```powershell
npm run test:e2e -- --project=chromium
```

El workflow `.github/workflows/validar-semana9.yml` instala dependencias, ejecuta pruebas y compila en GitHub Actions. Guarda capturas de Chromium y diagnósticos cuando hay fallos. Los resultados comprobados y el alcance de la verificación figuran en [docs/EVIDENCIAS.md](docs/EVIDENCIAS.md).
