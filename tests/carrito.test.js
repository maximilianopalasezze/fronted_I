import test from 'node:test';
import assert from 'node:assert/strict';
import { agregarProducto, eliminarProducto, cambiarCantidad, resumirCarrito, precioVigente } from '../src/utils/carrito.js';
import { filtrarProductos, validarProductos } from '../src/utils/catalogo.js';
import { readFileSync } from 'node:fs';
const productos = JSON.parse(readFileSync(new URL('../public/assets/data/productos.json', import.meta.url)));

test('el catálogo tiene seis productos completos, ofertas válidas e identificadores únicos', () => {
  assert.equal(validarProductos(productos).length, 6);
  for (const producto of productos) assert.ok(producto.precioOferta < producto.precioNormal);
});
test('dos PS5 y un Xbox suman tres unidades y $1.599.970 de oferta', () => {
  const inicial = [];
  const uno = agregarProducto(inicial, productos[0]);
  const dos = agregarProducto(uno, productos[0]);
  const tres = agregarProducto(dos, productos[1]);
  assert.deepEqual(resumirCarrito(tres), { cantidad: 3, total: 1599970, ahorro: 150000 });
  assert.equal(inicial.length, 0);
  assert.equal(uno[0].cantidad, 1);
  assert.equal(tres.length, 2);
});
test('cambiar cantidad y eliminar recalculan; nunca se admiten cantidades inválidas', () => {
  const carrito = agregarProducto([], productos[0]);
  for (const invalido of [0, -1, NaN, 1.5]) assert.deepEqual(cambiarCantidad(carrito, 1, invalido), carrito);
  const actualizado = cambiarCantidad(carrito, 1, 3);
  assert.equal(resumirCarrito(actualizado).total, 1649970);
  assert.deepEqual(resumirCarrito(eliminarProducto(actualizado, 1)), { cantidad: 0, total: 0, ahorro: 0 });
});
test('sin oferta válida se utiliza el precio normal', () => {
  assert.equal(precioVigente({ precioNormal: 100, precioOferta: null }), 100);
  assert.equal(precioVigente({ precioNormal: 100, precioOferta: 120 }), 100);
});
test('la búsqueda combina categorías, tolera tildes y contempla cero resultados', () => {
  assert.equal(filtrarProductos(productos, 'accesorios', 'AUDIFONOS').length, 1);
  assert.equal(filtrarProductos(productos, 'consolas', 'Xbox').length, 1);
  assert.equal(filtrarProductos(productos, 'portatiles', 'Xbox').length, 0);
});
test('datos corruptos o precios negativos son rechazados; catálogo vacío es válido', () => {
  assert.throws(() => validarProductos({}));
  assert.throws(() => validarProductos([{ ...productos[0], precioNormal: -1 }]));
  assert.throws(() => validarProductos([productos[0], productos[0]]));
  assert.deepEqual(validarProductos([]), []);
});
