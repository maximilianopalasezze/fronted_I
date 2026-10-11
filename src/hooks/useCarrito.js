import { useState } from 'react';
import { agregarProducto, cambiarCantidad, eliminarProducto, resumirCarrito } from '../utils/carrito.js';

// Un único estado comparte las cantidades entre tarjetas, navbar y resumen.
export default function useCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  function agregar(producto) {
    setCarrito((actual) => agregarProducto(actual, producto));
    setMensaje(`${producto.nombre} agregado al carrito.`);
  }
  function eliminar(id) {
    setCarrito((actual) => eliminarProducto(actual, id));
    setMensaje('Producto eliminado del carrito.');
  }
  function actualizarCantidad(id, cantidad) {
    setCarrito((actual) => cambiarCantidad(actual, id, cantidad));
    setMensaje('Cantidad actualizada.');
  }
  function vaciar() {
    setCarrito([]);
    setMensaje('Carrito vaciado.');
  }
  function retirarDelCatalogo(id) {
    setCarrito((actual) => eliminarProducto(actual, id));
    setMensaje('Videojuego retirado del catálogo y del carrito.');
  }
  return { carrito, resumen: resumirCarrito(carrito), mensaje, agregar, eliminar, actualizarCantidad, vaciar, retirarDelCatalogo };
}
