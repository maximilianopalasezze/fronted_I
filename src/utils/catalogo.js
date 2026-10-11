export const CATEGORIAS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'accion', nombre: 'Acción' },
  { id: 'aventura', nombre: 'Aventura' },
  { id: 'deportes', nombre: 'Deportes' },
  { id: 'carreras', nombre: 'Carreras' },
  { id: 'rol', nombre: 'Rol (RPG)' },
];

export const PORTADAS = [
  {
    "ruta": "assets/img/assassins-creed-black-flag-resynced.jpg",
    "nombre": "Assassin’s Creed Black Flag Resynced",
    "etiqueta": "Assassin’s Creed"
  },
  {
    "ruta": "assets/img/call-of-duty-black-ops-6.webp",
    "nombre": "Call of Duty: Black Ops 6",
    "etiqueta": "Black Ops 6"
  },
  {
    "ruta": "assets/img/crash-team-racing-nitro-fueled.avif",
    "nombre": "Crash Team Racing Nitro-Fueled",
    "etiqueta": "Crash Team Racing"
  },
  {
    "ruta": "assets/img/need-for-speed-most-wanted.webp",
    "nombre": "Need for Speed: Most Wanted",
    "etiqueta": "NFS: Most Wanted"
  },
  {
    "ruta": "assets/img/dark-souls.webp",
    "nombre": "Dark Souls",
    "etiqueta": "Dark Souls"
  },
  {
    "ruta": "assets/img/uncharted-4.webp",
    "nombre": "Uncharted 4: A Thief’s End",
    "etiqueta": "Uncharted 4"
  },
  {
    "ruta": "assets/img/diablo-iii.webp",
    "nombre": "Diablo III",
    "etiqueta": "Diablo III"
  },
  {
    "ruta": "assets/img/god-of-war-ragnarok.avif",
    "nombre": "God of War Ragnarök",
    "etiqueta": "God of War Ragnarök"
  },
  {
    "ruta": "assets/img/ea-sports-fc-27.jpg",
    "nombre": "EA SPORTS FC 27",
    "etiqueta": "EA SPORTS FC 27"
  },
  {
    "ruta": "assets/img/nba-2k27.webp",
    "nombre": "NBA 2K27",
    "etiqueta": "NBA 2K27"
  }
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
