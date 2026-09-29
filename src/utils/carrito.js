const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
});
export const formatearPrecio = (valor) => formatoCLP.format(valor);
export const tieneOferta = (producto) => Number.isFinite(producto.precioOferta) &&
  producto.precioOferta > 0 && producto.precioOferta < producto.precioNormal;
export const precioVigente = (producto) => tieneOferta(producto) ? producto.precioOferta : producto.precioNormal;

// Estas funciones devuelven nuevos arreglos: nunca modifican el estado de React.
export function agregarProducto(carrito, producto) {
  return carrito.some((item) => item.id === producto.id)
    ? carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
    : [...carrito, { ...producto, cantidad: 1 }];
}
export const eliminarProducto = (carrito, id) => carrito.filter((item) => item.id !== id);

export function cambiarCantidad(carrito, id, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1) return carrito;
  return carrito.map((item) => item.id === id ? { ...item, cantidad } : item);
}

// El contador suma unidades, no la cantidad de líneas distintas.
export function resumirCarrito(carrito) {
  return carrito.reduce((resumen, item) => ({
    cantidad: resumen.cantidad + item.cantidad,
    total: resumen.total + precioVigente(item) * item.cantidad,
    ahorro: resumen.ahorro + (item.precioNormal - precioVigente(item)) * item.cantidad,
  }), { cantidad: 0, total: 0, ahorro: 0 });
}
