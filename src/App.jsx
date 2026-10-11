import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import ContactForm from './components/ContactForm.jsx';
import CatalogManager from './components/CatalogManager.jsx';
import useCarrito from './hooks/useCarrito.js';
import Footer from './components/Footer.jsx';
import useProductos from './hooks/useProductos.js';
import { filtrarProductos } from './utils/catalogo.js';

export default function App() {
  const { productos, estado, reintentar, agregarVideojuego, eliminarVideojuego } = useProductos();
  const { carrito, resumen, mensaje, agregar, eliminar, actualizarCantidad, vaciar, retirarDelCatalogo } = useCarrito();
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Datos derivados: no duplicamos el contador ni el total en estados separados.
  const filtrados = filtrarProductos(productos, categoria, busqueda);
  function retirar(id) {
    eliminarVideojuego(id);
    retirarDelCatalogo(id);
  }
  function agregarAlCatalogo(datos) {
    const agregado = agregarVideojuego(datos);
    if (agregado) limpiarFiltros();
    return agregado;
  }
  function limpiarFiltros() {
    setCategoria('todos');
    setBusqueda('');
  }

  return <>
    <a className="visually-hidden-focusable skip-link" href="#productos">Saltar al catálogo</a>
    <Navbar busqueda={busqueda} onBusqueda={setBusqueda} cantidad={resumen.cantidad} />
    <main>
      <Hero />
      <section id="productos" className="py-5 bg-body-tertiary" aria-label="Productos y carrito">
        <div className="container">
          <div className="feedback-compra" role="status" aria-live="polite">{mensaje}</div>
          <div className="row g-4">
            <ProductList productos={filtrados} carrito={carrito} estado={estado} categoria={categoria} busqueda={busqueda}
              onCategoria={setCategoria} onLimpiar={limpiarFiltros} onReintentar={reintentar} onAgregar={agregar} />
            <Cart carrito={carrito} resumen={resumen} onCantidad={actualizarCantidad} onEliminar={eliminar} onVaciar={vaciar} />
          </div>
        </div>
      </section>
      <CatalogManager productos={productos} estado={estado} onAgregar={agregarAlCatalogo} onEliminar={retirar} />
      <ContactForm />
    </main>
    <Footer />
  </>;
}
