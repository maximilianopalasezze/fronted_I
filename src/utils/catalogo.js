export const CATEGORIAS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'consolas', nombre: 'Consolas' },
  { id: 'accesorios', nombre: 'Accesorios' },
  { id: 'portatiles', nombre: 'Portátiles' },
];

export function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Búsqueda y categoría se combinan, incluso al escribir con o sin tildes.
export function filtrarProductos(productos, categoria, busqueda) {
  const termino = normalizarTexto(busqueda);
  return productos.filter((producto) =>
    (categoria === 'todos' || producto.categoria === categoria) &&
    normalizarTexto(`${producto.nombre} ${producto.descripcion}`).includes(termino),
  );
}

export function validarProductos(datos) {
  if (!Array.isArray(datos)) throw new Error('El catálogo debe ser una lista.');
  const ids = new Set();
  for (const producto of datos) {
    if (!producto || !Number.isInteger(producto.id) || ids.has(producto.id) ||
        !['nombre', 'descripcion', 'imagen', 'alt'].every((clave) => typeof producto[clave] === 'string' && producto[clave].trim()) ||
        !CATEGORIAS.slice(1).some(({ id }) => id === producto.categoria) ||
        !Number.isInteger(producto.precioNormal) || producto.precioNormal <= 0 ||
        (producto.precioOferta !== null && (!Number.isInteger(producto.precioOferta) ||
          producto.precioOferta <= 0 || producto.precioOferta >= producto.precioNormal))) {
      throw new Error('El catálogo contiene un producto inválido.');
    }
    ids.add(producto.id);
  }
  return datos;
}
