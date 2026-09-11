# Semana 5 - Desarrollo Frontend I (PFY2201)

## Actividad
**Manipulando el DOM con JavaScript para mejorar la interactividad**.

El proyecto continúa el sitio **Game Zone X** desarrollado en la Semana 4 y agrega JavaScript para manipular el DOM, implementar eventos y cargar información con Fetch API.

## Funcionalidades implementadas

- Manipulación dinámica del DOM con `createElement`, `appendChild`, `remove`, `replaceChildren` y modificación de clases/texto.
- Evento `click` en los botones **Ver detalles** para crear y eliminar información dentro de cada tarjeta.
- Evento `mouseover` en las tarjetas para destacarlas y actualizar un mensaje dinámico.
- Evento `submit` en el formulario de contacto con validación de nombre, correo y consulta.
- Fetch API para cargar `data/recomendaciones.json` y crear tarjetas dinámicamente.
- Manejo de promesas con `.then()` y errores con `.catch()`.
- Funciones reutilizables y comentarios en todas las funciones principales.
- Diseño responsivo basado en Bootstrap 5.

## Archivos principales

- `index.html`: página de entrada para GitHub Pages.
- `Maximiliano_Palasezze_PFY2201_DOM_Semana5.html`: copia del HTML con el nombre solicitado para entrega en AVA.
- `Maximiliano_Palasezze_PFY2201_DOM_Semana5.js`: lógica JavaScript de Semana 5.
- `Maximiliano_Palasezze_PFY2201_CSS_Semana5.css`: estilos personalizados.
- `data/recomendaciones.json`: datos consumidos mediante Fetch API.
- `img/`: imágenes del proyecto.
- `capturas/`: guía con las evidencias que deben capturarse desde el navegador antes de subir la entrega.

## Importante para probar Fetch API

La página debe ejecutarse desde un servidor web. En GitHub Pages funciona directamente. En local se puede usar IntelliJ, Live Server o un servidor como `python -m http.server`.

## Pruebas recomendadas antes de entregar

1. Abrir la página y confirmar que las recomendaciones dinámicas aparezcan.
2. Presionar **Ver detalles** y comprobar que se agregue/elimine información.
3. Pasar el mouse sobre las tarjetas y comprobar el cambio visual y de texto.
4. Enviar el formulario vacío para observar las validaciones.
5. Completar correctamente el formulario y comprobar el mensaje de éxito.
6. Presionar **Recargar recomendaciones**.
7. Repetir las pruebas en Google Chrome y Microsoft Edge.
8. Comprobar diseño de escritorio y modo responsivo móvil.

## GitHub Pages

Para la entrega, subir `semana5/` a la rama `main` y publicar el proyecto con GitHub Pages según las instrucciones de la asignatura.
