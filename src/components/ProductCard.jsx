import { CATEGORIAS } from '../utils/catalogo.js';
import { formatearPrecio, tieneOferta } from '../utils/carrito.js';

export default function ProductCard({ producto, onAgregar }) {
  const oferta = tieneOferta(producto);
  const descuento = oferta ? Math.round((1 - producto.precioOferta / producto.precioNormal) * 100) : 0;
  return <div className="col-12 col-md-6">
    <article className="card producto-card border-0 shadow-sm" data-testid={`producto-${producto.id}`}>
      <div className="position-relative">
        <img className="card-img-top" src={`${import.meta.env.BASE_URL}${producto.imagen}`} alt={producto.alt} loading="lazy" />
        {oferta && <span className="badge text-bg-success position-absolute top-0 end-0 m-3">Oferta −{descuento}%</span>}
      </div>
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-secondary align-self-start mb-2">{CATEGORIAS.find(({ id }) => id === producto.categoria)?.nombre}</span>
        <h3 className="card-title h5 fw-bold">{producto.nombre}</h3>
        <p className="card-text text-secondary">{producto.descripcion}</p>
        <div className="mt-auto mb-3">
          <p className="text-secondary small mb-1">Precio normal: {oferta ? <del>{formatearPrecio(producto.precioNormal)}</del> : formatearPrecio(producto.precioNormal)}</p>
          {oferta ? <p className="fs-5 fw-bold text-success mb-0">Precio oferta: {formatearPrecio(producto.precioOferta)}</p>
            : <p className="small text-secondary mb-0">Sin oferta vigente</p>}
        </div>
        <button className="btn btn-primary" type="button" onClick={() => onAgregar(producto)} aria-label={`Agregar ${producto.nombre} al carrito`}>Agregar al carrito</button>
      </div>
    </article>
  </div>;
}
