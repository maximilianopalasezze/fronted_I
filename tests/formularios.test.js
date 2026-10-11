import test from 'node:test';
import assert from 'node:assert/strict';
import { validarContacto, validarVideojuego, crearVideojuego, JUEGO_INICIAL } from '../src/utils/formularios.js';
const contacto = { nombre: 'Maximiliano', email: 'max@example.com', mensaje: 'Quiero consultar por un videojuego.' };
const juego = { ...JUEGO_INICIAL, nombre: 'Juego nuevo', precio: '25000', descripcion: 'Una aventura para explorar nuevos mundos.' };
test('contacto válido permite nombre Unicode y correo con subdominio', () => {
  assert.deepEqual(validarContacto(contacto), {});
  assert.deepEqual(validarContacto({ ...contacto, nombre: 'José María', email: 'max+demo@alumnos.duoc.cl' }), {});
});
test('contacto rechaza blancos, correos mal formados y longitudes fuera de rango', () => {
  assert.equal(Object.keys(validarContacto({ nombre: '   ', email: '', mensaje: 'corto' })).length, 3);
  for (const email of ['a@b', 'a b@test.cl', 'a@b..cl', 'a@@b.cl', 'a@.cl']) assert.ok(validarContacto({ ...contacto, email }).email);
  assert.ok(validarContacto({ ...contacto, mensaje: 'x'.repeat(1001) }).mensaje);
  assert.ok(validarContacto({ ...contacto, nombre: 'x'.repeat(81) }).nombre);
});
test('nuevo juego se convierte en un objeto válido sin oferta', () => {
  assert.deepEqual(validarVideojuego(juego), {});
  const nuevo = crearVideojuego(juego, 7);
  assert.equal(nuevo.id, 7);
  assert.equal(nuevo.precioNormal, 25000);
  assert.equal(nuevo.precioOferta, null);
});
test('gestión rechaza precio negativo, decimal, excesivo o vacío y título duplicado', () => {
  for (const precio of ['', '0', '-1', '1.5', '1000001', 'Infinity']) assert.ok(validarVideojuego({ ...juego, precio }).precio);
  assert.ok(validarVideojuego(juego, [{ nombre: 'JUEGO NUEVO' }]).nombre);
  assert.ok(validarVideojuego({ ...juego, categoria: 'otra' }).categoria);
  assert.ok(validarVideojuego({ ...juego, imagen: 'https://example.com/x.svg' }).imagen);
});
