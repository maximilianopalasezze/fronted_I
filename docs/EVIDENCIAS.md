# Evidencias de Semana 9

Las capturas de esta evaluación están en `docs/evidencias/semana9/`. Las de Semana 8 se conservan únicamente en `docs/evidencias/semana8/`; se eliminaron las copias de la raíz según la recomendación del profesor.

## Resultado de la verificación

Verificación local del 11 de octubre de 2026: compilación de producción correcta y 10 pruebas unitarias aprobadas. Las 16 pruebas end-to-end fueron aprobadas en Chromium, Firefox y WebKit (48 ejecuciones), con pantallas de 320, 390, 768 y 1440 píxeles. En total: 58 ejecuciones aprobadas, sumando las 10 pruebas unitarias.

Las pruebas de tamaños usan viewports de navegador, no dispositivos físicos. No se afirma compatibilidad con todos los dispositivos existentes. La verificación remota de [GitHub Actions](https://github.com/maximilianopalasezze/fronted_I/actions/runs/38159657788) terminó correctamente. La [página de Semana 9](https://maximilianopalasezze.github.io/fronted_I/) está publicada y fue comprobada en navegador.

## Capturas de funcionamiento

| Captura | Qué comprueba |
| --- | --- |
| [01 Catálogo](evidencias/semana9/01_catalogo.jpg) | Diez videojuegos, imágenes cargadas, categorías, precios normales y ofertas; carrito inicial vacío. |
| [02 Carrito](evidencias/semana9/02_carrito_tres_unidades.jpg) | Dos unidades de Assassin’s Creed y una de Call of Duty: tres unidades, total $109.970 y ahorro $25.000. |
| [03 Eliminar línea](evidencias/semana9/03_producto_eliminado.jpg) | Eliminar Call of Duty recalcula contador y total sin modificar el catálogo. |
| [04 Vaciar](evidencias/semana9/04_carrito_vaciado.jpg) | El carrito vuelve al estado vacío y el total a $0. |
| [05 Buscar y filtrar](evidencias/semana9/05_busqueda_categoria.jpg) | Categoría Carreras combinada con búsqueda en mayúsculas. |
| [06 Sin resultados](evidencias/semana9/06_sin_resultados.jpg) | Mensaje de búsqueda sin resultados y recuperación con Mostrar todos. |
| [07 Error recuperable](evidencias/semana9/07_error_recuperable.jpg) | Fallo HTTP 503 simulado y botón de reintento real. |
| [08 Carga](evidencias/semana9/08_cargando.jpg) | Estado de carga antes de recibir el JSON. |
| [09 Móvil](evidencias/semana9/09_vista_movil.jpg) | Vista de 390px, filtro Aventura, compra de Uncharted 4 y contenido sin desborde horizontal. |
| [10 Estado del botón](evidencias/semana9/10_boton_en_carrito.jpg) | Tarjeta y carrito comparten la misma cantidad; el botón cambia de texto y color. |
| [11 Contacto inválido](evidencias/semana9/11_contacto_errores.jpg) | Nombre, email y mensaje vacíos generan errores asociados a sus campos. |
| [12 Contacto válido](evidencias/semana9/12_contacto_validado.jpg) | Datos válidos muestran confirmación y se limpian; se informa que el envío es simulado. |
| [13 Agregar juego](evidencias/semana9/13_videojuego_agregado.jpg) | Un undécimo videojuego se agrega al estado, aparece en tarjetas y puede comprarse. |
| [14 Retirar juego](evidencias/semana9/14_videojuego_retirado.jpg) | Retiro confirmado de Assassin’s Creed actualiza catálogo, carrito, contador y total. |

## Correspondencia con la pauta

| Criterio | Implementación y evidencia |
| --- | --- |
| HTML, CSS y Bootstrap 5 (15 puntos) | Etiquetas semánticas, grilla responsiva, utilidades Flexbox y estilos personalizados. |
| Componentes Bootstrap (10 puntos) | Navbar, cards, formularios, botones, badges y alerts consistentes. |
| DOM dinámico (15 puntos) | Objetos del JSON recorridos con `map`; React actualiza tarjetas, filtros, carrito y gestión. |
| React modular y reutilizable (15 puntos) | Componentes, `useProductos`, `useCarrito`, `FormField`, state, props y callbacks. |
| Control de versiones (10 puntos) | Rama creada desde Semana 8, historial conservado y commits descriptivos publicados en GitHub. |
| Presentación (15 puntos) | El alumno debe grabar el MP4 individual mostrando funcionalidades y código. |
| Compatibilidad (10 puntos) | Pruebas de navegador y tamaños; resultados verificados indicados arriba. |
| README (10 puntos) | Instalación en Windows, uso, compilación, pruebas, estructura, alcance y publicación. |

Esta correspondencia orienta la revisión; el puntaje y la nota los determina el docente. El alumno debe grabar y entregar el video MP4 individual.
