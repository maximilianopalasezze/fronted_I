# Validación — Semana 8

Fecha: 4 de octubre de 2026 (Chile).

## Resultados comprobados

- Instalación limpia con npm ci: aprobada en GitHub Actions.
- Compilación: aprobada localmente y en GitHub Actions.
- Pruebas unitarias: **6 aprobadas, 0 fallidas**.
- Pruebas de navegador: **7 aprobadas, 0 fallidas**.
- Evidencias: diez capturas generadas por la suite.

[Ejecución aprobada](https://github.com/maximilianopalasezze/fronted_I/actions/runs/37249730211).

Las pruebas de navegador se ejecutaron en GitHub Actions porque este entorno local no permite descargar Chromium. Las capturas proceden de Chromium real. Las capturas publicadas corresponden a la ejecución final del código, incluido el encuadre de las primeras tarjetas.

## Casos de navegador

| Caso | Comprobación |
|---|---|
| Catálogo | Seis tarjetas, imágenes, precios y carrito vacío |
| Carrito | Cantidades, totales de oferta, ahorro, eliminar y vaciar |
| Botón condicional | Cambio al agregar, conservación tras filtrar, cantidades y restauración al eliminar/vaciar |
| Búsqueda | Categorías, entrada controlada, envío, sin resultados y limpieza |
| Error | HTTP 503 simulado y recuperación con Reintentar |
| Carga | Mensaje antes del JSON y actualización a seis productos |
| Móvil | Menú, filtro, carrito y ausencia de desborde horizontal |

## Reproducir en Windows

```powershell
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright inicia la vista previa de producción y guarda capturas en docs/evidencias/semana8/. Los casos de error y carga interceptan la petición JSON para mostrar estados transitorios; normalmente la aplicación utiliza el archivo real publicado.

## Despliegue

La compilación de Semana 8 se publicó en gh-pages mediante el commit `17f705adc3a284dbe0fcaa57d8b3587533fa0190`.

[Despliegue de Pages aprobado](https://github.com/maximilianopalasezze/fronted_I/actions/runs/37250162226).

Se comprobó que la ejecución de Pages corresponde al commit publicado y finalizó con éxito. La compilación utiliza /fronted_I/, incluye el JSON real, imágenes y .nojekyll. La interacción de la compilación se verificó con las siete pruebas de navegador de la suite.

Aplicación: https://maximilianopalasezze.github.io/fronted_I/

La evaluación final y la entrega de enlaces en AVA corresponden al alumno y al docente.

Se descargaron los doce archivos públicos del despliegue (HTML, JS, CSS, JSON, imágenes y .nojekyll): todos respondieron HTTP 200 y coincidieron byte a byte con la compilación mediante SHA-256.
