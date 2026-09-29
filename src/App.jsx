import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import Footer from './components/Footer.jsx';
import useProductos from './hooks/useProductos.js';
import { filtrarProductos } from './utils/catalogo.js';
import { agregarProducto, cambiarCantidad, eliminarProducto, resumirCarrito } from './utils/carrito.js';

export default function App() {
  const { productos, estado, reintentar } = useProductos();
  const [carrito, setCarrito] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Datos derivados: no duplicamos el contador ni el total en estados separados.
  const filtrados = filtrarProductos(productos, categoria, busqueda);
  const resumen = resumirCarrito(carrito);
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
  function limpiarFiltros() {
    setCategoria('todos');
    setBusqueda('');
  }

  return <>
    <a className="visually-hidden-focusable skip-link" href="#productos">Saltar al catálogo</a>
    <Navbar categoria={categoria} onCategoria={setCategoria} busqueda={busqueda} onBusqueda={setBusqueda} cantidad={resumen.cantidad} />
    <main>
      <Hero />
      <section id="productos" className="py-5 bg-body-tertiary" aria-label="Productos y carrito">
        <div className="container">
          <div className="feedback-compra" role="status" aria-live="polite">{mensaje}</div>
          <div className="row g-4">
            <ProductList productos={filtrados} estado={estado} categoria={categoria} busqueda={busqueda}
              onLimpiar={limpiarFiltros} onReintentar={reintentar} onAgregar={agregar} />
            <Cart carrito={carrito} resumen={resumen} onCantidad={actualizarCantidad} onEliminar={eliminar} onVaciar={vaciar} />
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
