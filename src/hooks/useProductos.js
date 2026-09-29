import { useEffect, useState } from 'react';
import { validarProductos } from '../utils/catalogo.js';

export default function useProductos() {
  const [productos, setProductos] = useState([]);
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

  return { productos, estado, reintentar: () => setIntento((actual) => actual + 1) };
}
