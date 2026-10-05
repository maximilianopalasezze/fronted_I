import ProductCard from './ProductCard.jsx';
import { CATEGORIAS } from '../utils/catalogo.js';

export default function ProductList({ productos, carrito, estado, categoria, busqueda, onLimpiar, onReintentar, onAgregar }) {
  const nombreCategoria = CATEGORIAS.find(({ id }) => id === categoria)?.nombre;
  return <div className="col-12 col-lg-8">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
      <div>
        <p className="text-primary fw-semibold mb-1">Catálogo</p>
        <h2 className="fw-bold mb-1">Nuestros productos</h2>
        {estado === 'listo' && <p className="text-secondary mb-0" role="status">
          {productos.length} producto(s) · {nombreCategoria}{busqueda.trim() && ` · “${busqueda.trim()}”`}
        </p>}
      </div>
      <button className="btn btn-outline-primary text-nowrap" type="button" onClick={onLimpiar}>Mostrar todos</button>
    </div>
    {estado === 'cargando' && <p className="alert alert-info" role="status">Cargando productos…</p>}
    {estado === 'error' && <div className="alert alert-danger" role="alert">
      <p>No pudimos cargar los productos. Revisa tu conexión e inténtalo nuevamente.</p>
      <button className="btn btn-outline-danger" type="button" onClick={onReintentar}>Reintentar</button>
    </div>}
    {estado === 'listo' && (productos.length > 0
      ? <div className="row g-4">{productos.map((producto) => <ProductCard key={producto.id} producto={producto}
        cantidadEnCarrito={carrito.find((item) => item.id === producto.id)?.cantidad ?? 0} onAgregar={onAgregar} />)}</div>
      : <div className="alert alert-warning" role="status">No encontramos productos que coincidan con tu búsqueda. Prueba otra palabra o pulsa Mostrar todos.</div>)}
  </div>;
}
