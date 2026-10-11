import test from 'node:test';
import assert from 'node:assert/strict';
import { agregarProducto, eliminarProducto, cambiarCantidad, resumirCarrito, precioVigente } from '../src/utils/carrito.js';
import { filtrarProductos, validarProductos } from '../src/utils/catalogo.js';
import { readFileSync } from 'node:fs';
const productos = JSON.parse(readFileSync(new URL('../public/assets/data/productos.json', import.meta.url)));

test('el catálogo tiene diez productos completos, ofertas válidas e identificadores únicos', () => {
  assert.equal(validarProductos(productos).length, 10);
  assert.equal(new Set(productos.map((p) => p.imagen)).size, 10);
  for (const producto of productos) {
    assert.ok(producto.precioOferta === null || producto.precioOferta < producto.precioNormal);
    const portada = readFileSync(new URL(`../public/${producto.imagen}`, import.meta.url));
    assert.ok(portada.byteLength > 0, `Falta la portada de ${producto.nombre}`);
  }
});
test('dos Assassin’s Creed y un Call of Duty suman tres unidades y $109.970 de oferta', () => {
  const inicial = [];
  const uno = agregarProducto(inicial, productos[0]);
  const dos = agregarProducto(uno, productos[0]);
  const tres = agregarProducto(dos, productos[1]);
  assert.deepEqual(resumirCarrito(tres), { cantidad: 3, total: 109970, ahorro: 25000 });
  assert.equal(inicial.length, 0);
  assert.equal(uno[0].cantidad, 1);
  assert.equal(tres.length, 2);
});
test('cambiar cantidad y eliminar recalculan; nunca se admiten cantidades inválidas', () => {
  const carrito = agregarProducto([], productos[0]);
  for (const invalido of [0, -1, NaN, 1.5]) assert.deepEqual(cambiarCantidad(carrito, 1, invalido), carrito);
  const actualizado = cambiarCantidad(carrito, 1, 3);
  assert.equal(resumirCarrito(actualizado).total, 119970);
  assert.deepEqual(resumirCarrito(eliminarProducto(actualizado, 1)), { cantidad: 0, total: 0, ahorro: 0 });
});
test('sin oferta válida se utiliza el precio normal', () => {
  assert.equal(precioVigente({ precioNormal: 100, precioOferta: null }), 100);
  assert.equal(precioVigente({ precioNormal: 100, precioOferta: 120 }), 100);
});
test('la búsqueda combina categorías, tolera tildes y contempla cero resultados', () => {
  assert.equal(filtrarProductos(productos, 'carreras', 'NEED FOR SPEED').length, 1);
  assert.equal(filtrarProductos(productos, 'aventura', 'UNCHÁRTED').length, 1);
  assert.equal(filtrarProductos(productos, 'accion', 'UNCHÁRTED').length, 0);
});
test('datos corruptos o precios negativos son rechazados; catálogo vacío es válido', () => {
  assert.throws(() => validarProductos({}));
  assert.throws(() => validarProductos([{ ...productos[0], precioNormal: -1 }]));
  assert.throws(() => validarProductos([productos[0], productos[0]]));
  assert.deepEqual(validarProductos([]), []);
});
