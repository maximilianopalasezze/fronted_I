import { useEffect, useRef, useState } from 'react';
import { crearVideojuego, validarVideojuego } from '../utils/formularios.js';
import { validarProductos } from '../utils/catalogo.js';

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const siguienteId = useRef(1);
  const [estado, setEstado] = useState('cargando');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    setEstado('cargando');
    // BASE_URL mantiene las rutas correctas en desarrollo y GitHub Pages.
    async function cargar() {
      try {
        const respuesta = await fetch(`${import.meta.env.BASE_URL}assets/data/productos.json`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = validarProductos(await respuesta.json());
        if (!controlador.signal.aborted) {
          setProductos(datos);
          siguienteId.current = Math.max(0, ...datos.map((p) => p.id)) + 1;
          setEstado('listo');
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !controlador.signal.aborted) setEstado('error');
      }
    }
    cargar();
    // Cancela la petición al desmontar o reintentar; evita actualizaciones tardías.
    return () => controlador.abort();
  }, [intento]);

  function agregarVideojuego(datos) {
    if (estado !== 'listo' || Object.keys(validarVideojuego(datos, productos)).length) return false;
    const nuevo = crearVideojuego(datos, siguienteId.current++);
    setProductos((actual) => [...actual, nuevo]);
    return true;
  }
  function eliminarVideojuego(id) {
    setProductos((actual) => actual.filter((p) => p.id !== id));
  }

  return { productos, estado, agregarVideojuego, eliminarVideojuego, reintentar: () => setIntento((actual) => actual + 1) };
}
