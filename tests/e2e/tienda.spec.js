import { test, expect } from '@playwright/test';
const rutaCaptura = (nombre) => `docs/evidencias/semana8/${nombre}.png`;
async function catalogo(page) {
  await page.goto('./');
  await expect(page.locator('.producto-card')).toHaveCount(6);
}
async function imagenesListas(page) {
  await page.locator('.producto-card').last().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('img').evaluateAll((imagenes) => imagenes.every((imagen) => imagen.complete && imagen.naturalWidth > 0))).toBe(true);
}

test('catálogo, ofertas, imágenes y carrito inicial', async ({ page }) => {
  const errores = [];
  page.on('pageerror', (error) => errores.push(error.message));
  await catalogo(page);
  await imagenesListas(page);
  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  await expect(page.getByTestId('total-carrito')).toHaveText('$0');
  await expect(page.getByTestId('producto-1')).toContainText('Precio normal: $599.990');
  await expect(page.getByTestId('producto-1')).toContainText('Precio oferta: $549.990');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: rutaCaptura('01_catalogo'), fullPage: true });
  expect(errores).toEqual([]);
});

test('agregar, cantidades, total de oferta, eliminar y vaciar', async ({ page }) => {
  await catalogo(page);
  const agregarPS5 = page.getByTestId('producto-1').getByRole('button');
  await agregarPS5.click();
  await agregarPS5.click();
  await page.getByRole('button', { name: 'Agregar Xbox Series X al carrito', exact: true }).click();
  await expect(page.getByTestId('contador-navbar')).toHaveText('3');
  await expect(page.getByTestId('contador-carrito')).toHaveText('3');
  await expect(page.getByTestId('total-carrito')).toHaveText('$1.599.970');
  await expect(page.getByTestId('ahorro')).toHaveText('$150.000');
  await page.locator('#productos').scrollIntoViewIfNeeded();
  await page.screenshot({ path: rutaCaptura('02_carrito_tres_unidades') });
  await page.getByRole('button', { name: 'Quitar una unidad de PlayStation 5', exact: true }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$1.049.980');
  await expect(page.getByRole('button', { name: 'Quitar una unidad de PlayStation 5', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Sumar una unidad de PlayStation 5', exact: true }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$1.599.970');
  await page.getByRole('button', { name: 'Eliminar Xbox Series X', exact: true }).click();
  await expect(page.getByTestId('carrito-item-2')).toHaveCount(0);
  await expect(page.getByTestId('contador-navbar')).toHaveText('2');
  await expect(page.getByTestId('total-carrito')).toHaveText('$1.099.980');
  await page.screenshot({ path: rutaCaptura('03_producto_eliminado') });
  await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click();
  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  await expect(page.getByTestId('contador-navbar')).toHaveText('0');
  await expect(page.getByTestId('total-carrito')).toHaveText('$0');
  await expect(page.getByRole('button', { name: 'Vaciar carrito', exact: true })).toHaveCount(0);
  await page.screenshot({ path: rutaCaptura('04_carrito_vaciado') });
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
  await ps5.getByRole('button', { name: 'Agregar otra unidad de PlayStation 5', exact: true }).click();
  await expect(ps5).toContainText('2 unidades · Pulsa para agregar otra.');
  await page.getByRole('button', { name: 'Quitar una unidad de PlayStation 5', exact: true }).click();
  await expect(ps5).toContainText('1 unidad · Pulsa para agregar otra.');
  // Ocultar y volver a mostrar una tarjeta conserva el estado real del carrito.
  await page.getByRole('link', { name: 'Accesorios', exact: true }).click();
  await expect(ps5).toHaveCount(0);
  await page.getByRole('button', { name: 'Mostrar todos', exact: true }).click();
  await expect(ps5.getByRole('button')).toHaveText('✓ En el carrito');
  await imagenesListas(page);
  // Encuadrar las primeras tarjetas después de cargar también las imágenes inferiores.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('productos').offsetTop - 72));
  await page.screenshot({ path: rutaCaptura('10_boton_en_carrito') });
  await page.getByRole('button', { name: 'Eliminar PlayStation 5', exact: true }).click();
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
  await page.getByRole('link', { name: 'Accesorios', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(3);
  await page.getByRole('searchbox', { name: 'Buscar producto' }).fill('audifonos');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(1);
  await expect(page.getByTestId('producto-5')).toBeVisible();
  await page.screenshot({ path: rutaCaptura('05_busqueda_categoria') });
  await page.getByRole('searchbox', { name: 'Buscar producto' }).fill('producto inexistente');
  await expect(page.getByText('No encontramos productos', { exact: false })).toBeVisible();
  await page.screenshot({ path: rutaCaptura('06_sin_resultados') });
  await page.getByRole('button', { name: 'Mostrar todos', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(6);
  await expect(page.getByRole('searchbox', { name: 'Buscar producto' })).toHaveValue('');
});

test('fallo HTTP y recuperación al reintentar', async ({ page }) => {
  await page.route('**/assets/data/productos.json', (ruta) => ruta.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('./');
  await expect(page.getByRole('alert')).toContainText('No pudimos cargar');
  await page.locator('#productos').scrollIntoViewIfNeeded();
  await page.screenshot({ path: rutaCaptura('07_error_recuperable') });
  await page.unroute('**/assets/data/productos.json');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(6);
});

test('estado de carga visible antes de recibir el JSON', async ({ page }) => {
  let liberar;
  const espera = new Promise((resolve) => { liberar = resolve; });
  await page.route('**/assets/data/productos.json', async (ruta) => { await espera; await ruta.continue(); });
  await page.goto('./');
  await expect(page.getByText('Cargando productos…', { exact: true })).toBeVisible();
  await page.locator('#productos').scrollIntoViewIfNeeded();
  await page.screenshot({ path: rutaCaptura('08_cargando') });
  liberar();
  await expect(page.locator('.producto-card')).toHaveCount(6);
});

test('pantalla móvil: menú, filtro, carrito y ausencia de desborde', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await catalogo(page);
  await page.getByRole('button', { name: 'Mostrar navegación', exact: true }).click();
  await page.getByRole('link', { name: 'Portátiles', exact: true }).click();
  await expect(page.locator('.producto-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Mostrar navegación' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Agregar Nintendo Switch al carrito' }).click();
  await expect(page.getByTestId('total-carrito')).toHaveText('$319.990');
  await page.locator('#carrito').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: rutaCaptura('09_vista_movil'), fullPage: true });
});
