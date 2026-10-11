import { test, expect } from '@playwright/test';
const rutaCaptura = (nombre) => `docs/evidencias/semana9/${nombre}.jpg`;
async function captura(page, nombre, opciones = {}) {
  if (test.info().project.name === 'chromium') await page.screenshot({ path: rutaCaptura(nombre), type: 'jpeg', quality: 65, ...opciones });
}
async function catalogo(page) {
  await page.goto('./');
  await expect(page.locator('.producto-card')).toHaveCount(10);
}
async function imagenesListas(page) {
  // Cada navegador precarga una distancia distinta para loading="lazy".
  for (const tarjeta of await page.locator('.producto-card').all()) await tarjeta.scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('img').evaluateAll((imagenes) => imagenes.filter((imagen) => !imagen.complete || imagen.naturalWidth === 0).map((imagen) => imagen.alt))).toEqual([]);
}

test('catálogo, ofertas, imágenes y carrito inicial', async ({ page }) => {
  const errores = [];
  page.on('pageerror', (error) => errores.push(error.message));
  await catalogo(page);
  await imagenesListas(page);
  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  await expect(page.getByTestId('total-carrito')).toHaveText('$0');
  await expect(page.getByTestId('producto-1')).toContainText('Precio normal: $49.990');
  await expect(page.getByTestId('producto-1')).toContainText('Precio oferta: $39.990');
  await page.evaluate(() => window.scrollTo(0, 0));
  await captura(page, '01_catalogo', { fullPage: true });
  expect(errores).toEqual([]);
});

test('agregar, cantidades, total de oferta, eliminar y vaciar', async ({ page }) => {
  await catalogo(page);
  const agregarPS5 = page.getByTestId('producto-1').getByRole('button');
  await agregarPS5.click();
  await agregarPS5.click();
  await page.getByRole('button', { name: 'Agregar Call of Duty: Black Ops 6 al carrito', exact: true }).click();
  await expect(page.getByTestId('contador-navbar')).toHaveText('3');
  await expect(page.getByTestId('contador-carrito')).toHaveText('3');
  await expect(page.getByTestId('total-carrito')).toHaveText('$109.970');
  await expect(page.getByTestId('ahorro')).toHaveText('$25.000');
  await page.locator('#productos').scrollIntoViewIfNeeded();
  await captura(page, '02_carrito_tres_unidades');
  await page.getByRole('button', { name: 'Quitar una unidad de Assassin’s Creed Black Flag Resynced', exact: true }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$69.980');
  await expect(page.getByRole('button', { name: 'Quitar una unidad de Assassin’s Creed Black Flag Resynced', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Sumar una unidad de Assassin’s Creed Black Flag Resynced', exact: true }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$109.970');
  await page.getByRole('button', { name: 'Eliminar Call of Duty: Black Ops 6', exact: true }).click();
  await expect(page.getByTestId('carrito-item-2')).toHaveCount(0);
  await expect(page.getByTestId('contador-navbar')).toHaveText('2');
  await expect(page.getByTestId('total-carrito')).toHaveText('$79.980');
  await captura(page, '03_producto_eliminado');
  await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click();
  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  await expect(page.getByTestId('contador-navbar')).toHaveText('0');
  await expect(page.getByTestId('total-carrito')).toHaveText('$0');
  await expect(page.getByRole('button', { name: 'Vaciar carrito', exact: true })).toHaveCount(0);
  await captura(page, '04_carrito_vaciado');
});

test('botón condicional sincronizado al agregar, filtrar, eliminar y vaciar', async ({ page }) => {
  await catalogo(page);
  const ps5 = page.getByTestId('producto-1');
  const xbox = page.getByTestId('producto-2');
  await expect(ps5.getByRole('button')).toHaveText('Agregar al carrito');
  await ps5.getByRole('button').click();
  await expect(ps5.getByRole('button')).toHaveText('✓ En el carrito');
  await expect(ps5.getByRole('button')).toHaveClass(/btn-success/);
  await expect(ps5).toContainText('1 unidad · Pulsa para agregar otra.');
  await expect(xbox.getByRole('button')).toHaveText('Agregar al carrito');
  await ps5.getByRole('button', { name: 'Agregar otra unidad de Assassin’s Creed Black Flag Resynced', exact: true }).click();
  await expect(ps5).toContainText('2 unidades · Pulsa para agregar otra.');
  await page.getByRole('button', { name: 'Quitar una unidad de Assassin’s Creed Black Flag Resynced', exact: true }).click();
  await expect(ps5).toContainText('1 unidad · Pulsa para agregar otra.');
  // Ocultar y volver a mostrar una tarjeta conserva el estado real del carrito.
  await page.getByRole('button', { name: 'Carreras', exact: true }).click();
  await expect(ps5).toHaveCount(0);
  await page.getByRole('button', { name: 'Mostrar todos', exact: true }).click();
  await expect(ps5.getByRole('button')).toHaveText('✓ En el carrito');
  await imagenesListas(page);
  // Encuadrar las primeras tarjetas después de cargar también las imágenes inferiores.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('productos').offsetTop - 72));
  await captura(page, '10_boton_en_carrito');
  await page.getByRole('button', { name: 'Eliminar Assassin’s Creed Black Flag Resynced', exact: true }).click();
  await expect(ps5.getByRole('button')).toHaveText('Agregar al carrito');
  await expect(ps5.getByRole('button')).toHaveClass(/btn-primary/);
  await expect(ps5.getByText('Pulsa para agregar otra.', { exact: false })).toHaveCount(0);
  await expect(page.getByTestId('contador-carrito')).toHaveText('0');
  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  await ps5.getByRole('button').click();
  await xbox.getByRole('button').click();
  await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click();
  await expect(ps5.getByRole('button')).toHaveText('Agregar al carrito');
  await expect(xbox.getByRole('button')).toHaveText('Agregar al carrito');
});

test('onChange, onSubmit, categorías y búsqueda sin resultados', async ({ page }) => {
  await catalogo(page);
  await page.getByRole('button', { name: 'Carreras', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(2);
  await page.getByRole('searchbox', { name: 'Buscar producto' }).fill('NEED FOR SPEED');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(1);
  await expect(page.getByTestId('producto-4')).toBeVisible();
  await captura(page, '05_busqueda_categoria');
  await page.getByRole('searchbox', { name: 'Buscar producto' }).fill('producto inexistente');
  await expect(page.getByText('No encontramos productos', { exact: false })).toBeVisible();
  await captura(page, '06_sin_resultados');
  await page.getByRole('button', { name: 'Mostrar todos', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(10);
  await expect(page.getByRole('searchbox', { name: 'Buscar producto' })).toHaveValue('');
});

test('fallo HTTP y recuperación al reintentar', async ({ page }) => {
  await page.route('**/assets/data/productos.json', (ruta) => ruta.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('./');
  await expect(page.getByRole('alert')).toContainText('No pudimos cargar');
  await page.locator('#productos').scrollIntoViewIfNeeded();
  await captura(page, '07_error_recuperable');
  await page.unroute('**/assets/data/productos.json');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(10);
});

test('estado de carga visible antes de recibir el JSON', async ({ page }) => {
  let liberar;
  const espera = new Promise((resolve) => { liberar = resolve; });
  await page.route('**/assets/data/productos.json', async (ruta) => { await espera; await ruta.continue(); });
  await page.goto('./');
  await expect(page.getByText('Cargando productos…', { exact: true })).toBeVisible();
  await page.locator('#productos').scrollIntoViewIfNeeded();
  await captura(page, '08_cargando');
  liberar();
  await expect(page.locator('.producto-card')).toHaveCount(10);
});

test('pantalla móvil: menú, filtro, carrito y ausencia de desborde', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await catalogo(page);
  await page.getByRole('button', { name: 'Mostrar navegación', exact: true }).click();
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Videojuegos', exact: true }).click();
  await page.getByRole('button', { name: 'Aventura', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Mostrar navegación' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Agregar Uncharted 4: A Thief’s End al carrito' }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$19.990');
  await page.locator('#carrito').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await captura(page, '09_vista_movil', { fullPage: true });
});


test('contacto rechaza campos vacíos, espacios y correo incorrecto; acepta datos válidos', async ({ page }) => {
  await catalogo(page);
  const contacto = page.getByRole('form', { name: 'Formulario de contacto' });
  await contacto.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.locator('#contacto-nombre')).toBeFocused();
  await expect(contacto.locator('.invalid-feedback')).toHaveCount(3);
  await page.evaluate(() => window.scrollTo(0, document.getElementById('contacto').offsetTop - 80));
  await captura(page, '11_contacto_errores');
  await contacto.getByLabel('Nombre', { exact: true }).fill('   ');
  await contacto.getByLabel('Email', { exact: true }).fill('correo@invalido');
  await contacto.getByLabel('Mensaje', { exact: true }).fill('corto');
  await contacto.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(contacto.locator('.invalid-feedback')).toHaveCount(3);
  await contacto.getByLabel('Nombre', { exact: true }).fill('Maximiliano Palasezze');
  await contacto.getByLabel('Email', { exact: true }).fill('max@example.com');
  await contacto.getByLabel('Mensaje', { exact: true }).fill('Quiero consultar por el juego Assassin’s Creed Black Flag Resynced.');
  await contacto.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(contacto.getByRole('status')).toContainText('Tu mensaje fue validado correctamente');
  await expect(contacto.getByRole('status')).toContainText('no se envían correos');
  await expect(contacto.getByLabel('Nombre', { exact: true })).toHaveValue('');
  await expect(contacto.locator('.invalid-feedback')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.getElementById('contacto').offsetTop - 80));
  await captura(page, '12_contacto_validado');
  await contacto.getByLabel('Nombre', { exact: true }).fill('Nueva consulta');
  await expect(contacto.getByRole('status')).toBeEmpty();
});

async function llenarJuego(page, nombre = 'Mi nuevo juego') {
  const form = page.getByRole('form', { name: 'Agregar videojuego', exact: true });
  await form.getByLabel('Título del videojuego').fill(nombre);
  await form.getByLabel('Categoría', { exact: true }).selectOption('aventura');
  await form.getByLabel('Precio en CLP').fill('25000');
  await form.getByLabel('Descripción', { exact: true }).fill('Explora nuevos mundos y resuelve acertijos.');
  await form.getByLabel('Portada', { exact: true }).selectOption('assets/img/uncharted-4.webp');
  return form;
}

test('agregar un videojuego modifica el catálogo, limpia filtros y permite comprarlo', async ({ page }) => {
  await catalogo(page);
  await page.getByRole('button', { name: 'Acción', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Buscar producto' }).fill('no existe');
  const form = await llenarJuego(page);
  await form.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(11);
  await expect(page.getByRole('searchbox', { name: 'Buscar producto' })).toHaveValue('');
  await expect(page.getByTestId('producto-11')).toContainText('Mi nuevo juego');
  await page.getByTestId('producto-11').scrollIntoViewIfNeeded();
  await captura(page, '13_videojuego_agregado');
  await page.getByRole('button', { name: 'Aventura', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Agregar Mi nuevo juego al carrito', exact: true }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$25.000');
});

test('gestión rechaza datos inválidos y títulos duplicados', async ({ page }) => {
  await catalogo(page);
  const form = page.getByRole('form', { name: 'Agregar videojuego', exact: true });
  await form.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
  await expect(form.locator('.invalid-feedback')).toHaveCount(3);
  await expect(page.locator('#juego-nombre')).toBeFocused();
  await llenarJuego(page, '  Assassin’s Creed Black Flag Resynced  ');
  await form.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
  await expect(form).toContainText('Ya existe un videojuego');
  await expect(page.locator('.producto-card')).toHaveCount(10);
  await form.getByLabel('Título del videojuego').fill('Otro juego');
  await form.getByLabel('Precio en CLP').fill('-2');
  await form.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
  await expect(form).toContainText('Ingresa un precio entero');
  await expect(page.locator('.producto-card')).toHaveCount(10);
});

test('retiro confirmado sincroniza catálogo y carrito; cancelar mantiene el juego', async ({ page }) => {
  await catalogo(page);
  await page.getByRole('button', { name: 'Agregar Assassin’s Creed Black Flag Resynced al carrito', exact: true }).click();
  await page.getByRole('button', { name: 'Retirar Assassin’s Creed Black Flag Resynced del catálogo', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(10);
  await expect(page.getByTestId('contador-navbar')).toHaveText('1');
  await page.getByRole('button', { name: 'Retirar Assassin’s Creed Black Flag Resynced del catálogo', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar retiro', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(9);
  await expect(page.getByTestId('producto-1')).toHaveCount(0);
  await expect(page.getByTestId('carrito-item-1')).toHaveCount(0);
  await expect(page.getByTestId('contador-navbar')).toHaveText('0');
  await expect(page.getByTestId('total-carrito')).toHaveText('$0');
  await page.evaluate(() => window.scrollTo(0, document.getElementById('gestion').offsetTop - 80));
  await captura(page, '14_videojuego_retirado');
});

test('el catálogo vacío permite agregar nuevamente sin reutilizar identificadores', async ({ page }) => {
  await catalogo(page);
  for (const nombre of ["Assassin’s Creed Black Flag Resynced", "Call of Duty: Black Ops 6", "Crash Team Racing Nitro-Fueled", "Need for Speed: Most Wanted", "Dark Souls", "Uncharted 4: A Thief’s End", "Diablo III", "God of War Ragnarök", "EA SPORTS FC 27", "NBA 2K27"]) {
    await page.getByRole('button', { name: `Retirar ${nombre} del catálogo`, exact: true }).click();
    await page.getByRole('button', { name: 'Confirmar retiro', exact: true }).click();
  }
  await expect(page.locator('.producto-card')).toHaveCount(0);
  await expect(page.getByText('El catálogo está vacío.', { exact: false })).toBeVisible();
  const form = await llenarJuego(page);
  await form.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(1);
  await expect(page.getByTestId('producto-11')).toContainText('Mi nuevo juego');
  await page.reload();
  await expect(page.locator('.producto-card')).toHaveCount(10);
  await expect(page.getByTestId('producto-11')).toHaveCount(0);
});

test('JSON inválido se rechaza y se recupera con reintento', async ({ page }) => {
  await page.route('**/assets/data/productos.json', (ruta) => ruta.fulfill({ json: [{ id: 1 }] }));
  await page.goto('./');
  await expect(page.getByRole('alert')).toContainText('No pudimos cargar');
  await expect(page.getByText('La gestión estará disponible', { exact: false })).toBeVisible();
  await page.unroute('**/assets/data/productos.json');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(10);
});

for (const width of [320, 768, 1440]) {
  test(`pantalla de ${width}px: contacto, gestión y navegación sin desborde`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await catalogo(page);
    if (width < 1200) await page.getByRole('button', { name: 'Mostrar navegación', exact: true }).click();
    await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Contacto', exact: true }).click();
    await expect(page.locator('#contacto-email')).toBeVisible();
    const contacto = page.getByRole('form', { name: 'Formulario de contacto' });
    await contacto.getByLabel('Nombre', { exact: true }).fill('Maximiliano');
    await contacto.getByLabel('Email', { exact: true }).fill('max@example.com');
    await contacto.getByLabel('Mensaje', { exact: true }).fill('Consulta válida desde un dispositivo de prueba.');
    await contacto.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(contacto.getByRole('status')).toContainText('validado correctamente');
    const form = await llenarJuego(page);
    await form.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
    await expect(page.locator('.producto-card')).toHaveCount(11);
    const dimensiones = await page.evaluate(() => ({
      pagina: document.documentElement.scrollWidth, viewport: innerWidth,
      desbordes: [...document.querySelectorAll('body *')].map((e) => ({
        elemento: `${e.tagName.toLowerCase()}#${e.id}.${e.className}`,
        derecha: e.getBoundingClientRect().right, ancho: e.getBoundingClientRect().width,
        texto: e.textContent.slice(0, 70),
      })).filter((e) => e.derecha > innerWidth + 1).slice(-12),
    }));
    expect(dimensiones.pagina <= dimensiones.viewport, JSON.stringify(dimensiones)).toBe(true);
  });
}
