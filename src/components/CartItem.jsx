import { formatearPrecio, precioVigente } from '../utils/carrito.js';

export default function CartItem({ item, onCantidad, onEliminar }) {
  return <li className="item-carrito" data-testid={`carrito-item-${item.id}`}>
    <div className="d-flex align-items-start gap-2">
      <img className="carrito-img" src={`${import.meta.env.BASE_URL}${item.imagen}`} alt="" />
      <div className="flex-grow-1">
        <h3 className="h6 fw-semibold mb-1">{item.nombre}</h3>
        <p className="small text-secondary mb-2">{formatearPrecio(precioVigente(item))} por unidad</p>
      </div>
    </div>
    <div className="d-flex justify-content-between align-items-center gap-2">
      <div className="btn-group align-items-center" role="group" aria-label={`Cantidad de ${item.nombre}`}>
        <button className="btn btn-sm btn-outline-secondary" type="button" aria-label={`Quitar una unidad de ${item.nombre}`}
          disabled={item.cantidad === 1} onClick={() => onCantidad(item.id, item.cantidad - 1)}>−</button>
        <span className="px-3" data-testid={`cantidad-${item.id}`} aria-label={`${item.cantidad} unidades`}>{item.cantidad}</span>
        <button className="btn btn-sm btn-outline-secondary" type="button" aria-label={`Sumar una unidad de ${item.nombre}`}
          onClick={() => onCantidad(item.id, item.cantidad + 1)}>+</button>
      </div>
      <strong className="text-nowrap" data-testid={`subtotal-${item.id}`}>{formatearPrecio(precioVigente(item) * item.cantidad)}</strong>
    </div>
    <button className="btn btn-sm btn-link text-danger ps-0 mt-1" type="button" onClick={() => onEliminar(item.id)} aria-label={`Eliminar ${item.nombre}`}>Eliminar</button>
  </li>;
}
