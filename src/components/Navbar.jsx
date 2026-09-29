import { useState } from 'react';
import { CATEGORIAS } from '../utils/catalogo.js';

export default function Navbar({ categoria, onCategoria, busqueda, onBusqueda, cantidad }) {
  const [abierto, setAbierto] = useState(false);
  function buscar(evento) {
    evento.preventDefault();
    setAbierto(false);
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
  }
  return <header className="sticky-top">
    <nav className="navbar navbar-expand-xl navbar-dark bg-dark shadow-sm" aria-label="Navegación principal">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#inicio">GAME ZONE X</a>
        <button className="navbar-toggler" type="button" aria-controls="navbarPrincipal"
          aria-expanded={abierto} aria-label="Mostrar navegación" onClick={() => setAbierto(!abierto)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div id="navbarPrincipal" className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-xl-0">
            {CATEGORIAS.map(({ id, nombre }) => <li className="nav-item" key={id}>
              <a className={`nav-link ${categoria === id ? 'active' : ''}`} href="#productos"
                aria-current={categoria === id ? 'true' : undefined}
                onClick={() => { onCategoria(id); setAbierto(false); }}>{nombre}</a>
            </li>)}
          </ul>
          <form className="d-flex gap-2" role="search" onSubmit={buscar}>
            <label htmlFor="busqueda" className="visually-hidden">Buscar producto</label>
            <input id="busqueda" className="form-control" type="search" placeholder="Buscar producto…"
              value={busqueda} onChange={(evento) => onBusqueda(evento.target.value)} autoComplete="off" />
            <button className="btn btn-outline-light" type="submit">Buscar</button>
          </form>
          <a className="btn btn-primary ms-xl-3 mt-2 mt-xl-0 text-nowrap" href="#carrito" onClick={() => setAbierto(false)}>
            Carrito <span className="badge text-bg-light ms-1" data-testid="contador-navbar">{cantidad}</span>
          </a>
        </div>
      </div>
    </nav>
  </header>;
}
