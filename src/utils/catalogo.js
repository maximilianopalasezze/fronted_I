export const CATEGORIAS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'accion', nombre: 'Acción' },
  { id: 'aventura', nombre: 'Aventura' },
  { id: 'deportes', nombre: 'Deportes' },
  { id: 'carreras', nombre: 'Carreras' },
  { id: 'estrategia', nombre: 'Estrategia' },
];

export const PORTADAS = [
  { ruta: 'assets/img/nebula.svg', nombre: 'Nebula — espacio' },
  { ruta: 'assets/img/bosque.svg', nombre: 'Bosque — aventura' },
  { ruta: 'assets/img/estadio.svg', nombre: 'Estadio — deportes' },
  { ruta: 'assets/img/velocidad.svg', nombre: 'Velocidad — carreras' },
  { ruta: 'assets/img/reinos.svg', nombre: 'Reinos — estrategia' },
  { ruta: 'assets/img/aurora.svg', nombre: 'Aurora — exploración' },
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
        !Number.isSafeInteger(producto.precioNormal) || producto.precioNormal <= 0 ||
        (producto.precioOferta !== null && (!Number.isSafeInteger(producto.precioOferta) ||
          producto.precioOferta <= 0 || producto.precioOferta >= producto.precioNormal))) {
      throw new Error('El catálogo contiene un producto inválido.');
    }
    ids.add(producto.id);
  }
  return datos;
}
