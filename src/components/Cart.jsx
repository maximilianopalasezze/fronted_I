import CartItem from './CartItem.jsx';
import { formatearPrecio } from '../utils/carrito.js';

export default function Cart({ carrito, resumen, onCantidad, onEliminar, onVaciar }) {
  return <div className="col-12 col-lg-4">
    <aside id="carrito" className="card border-0 shadow-sm carrito-sticky" aria-labelledby="tituloCarrito">
      <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center gap-2">
        <h2 id="tituloCarrito" className="h5 mb-0">Resumen del carrito</h2>
        <span className="badge text-bg-primary" data-testid="contador-carrito">{resumen.cantidad}</span>
      </div>
      <div className="card-body">
        {carrito.length === 0 ? <div className="text-center py-3">
          <p className="fw-semibold mb-1">Tu carrito está vacío.</p>
          <p className="text-secondary small mb-0">Agrega tus favoritos para comenzar.</p>
        </div> : <ul className="list-unstyled vstack gap-3 mb-0 lista-carrito">
          {carrito.map((item) => <CartItem key={item.id} item={item} onCantidad={onCantidad} onEliminar={onEliminar} />)}
        </ul>}
        <div className="border-top mt-3 pt-3" aria-live="polite" aria-atomic="true">
          <div className="d-flex justify-content-between small text-secondary mb-2"><span>Total de productos</span><span>{resumen.cantidad}</span></div>
          {resumen.ahorro > 0 && <div className="d-flex justify-content-between text-success small mb-2"><span>Ahorras</span><span data-testid="ahorro">{formatearPrecio(resumen.ahorro)}</span></div>}
          <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span data-testid="total-carrito">{formatearPrecio(resumen.total)}</span></div>
        </div>
        {carrito.length > 0 && <button className="btn btn-outline-danger w-100 mt-3" type="button" onClick={onVaciar}>Vaciar carrito</button>}
        <p className="small text-secondary mb-0 mt-3">Precios en pesos chilenos (CLP).</p>
      </div>
    </aside>
  </div>;
}
