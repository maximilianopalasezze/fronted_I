import { CATEGORIAS, PORTADAS, validarProductos } from './catalogo.js';

export const CONTACTO_INICIAL = { nombre: '', email: '', mensaje: '' };
export function validarContacto(datos) {
  const errores = {};
  const nombre = datos.nombre.trim();
  const email = datos.email.trim();
  const mensaje = datos.mensaje.trim();
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = 'Ingresa un nombre entre 2 y 80 caracteres.';
  if (email.length > 254 || !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email)) errores.email = 'Ingresa un correo válido, por ejemplo nombre@correo.cl.';
  if (mensaje.length < 10 || mensaje.length > 1000) errores.mensaje = 'Escribe un mensaje entre 10 y 1000 caracteres.';
  return errores;
}

export const JUEGO_INICIAL = { nombre: '', categoria: 'accion', precio: '', descripcion: '', imagen: PORTADAS[0].ruta };
export function validarVideojuego(datos, productos = []) {
  const errores = {};
  const nombre = datos.nombre.trim();
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = 'Ingresa un título entre 2 y 80 caracteres.';
  if (productos.some((p) => p.nombre.trim().toLocaleLowerCase('es') === nombre.toLocaleLowerCase('es'))) errores.nombre = 'Ya existe un videojuego con este título.';
  const precio = Number(datos.precio);
  if (!/^\d+$/.test(datos.precio) || !Number.isSafeInteger(precio) || precio < 1 || precio > 1000000) errores.precio = 'Ingresa un precio entero entre $1 y $1.000.000 CLP.';
  if (datos.descripcion.trim().length < 10 || datos.descripcion.trim().length > 300) errores.descripcion = 'Escribe una descripción entre 10 y 300 caracteres.';
  if (!CATEGORIAS.slice(1).some((c) => c.id === datos.categoria)) errores.categoria = 'Selecciona una categoría válida.';
  if (!PORTADAS.some((p) => p.ruta === datos.imagen)) errores.imagen = 'Selecciona una portada disponible.';
  return errores;
}
export function crearVideojuego(datos, id) {
  const producto = { id, nombre: datos.nombre.trim(), categoria: datos.categoria, precioNormal: Number(datos.precio), precioOferta: null,
    descripcion: datos.descripcion.trim(), imagen: datos.imagen, alt: `Ilustración de portada de ${datos.nombre.trim()}` };
  return validarProductos([producto])[0];
}
