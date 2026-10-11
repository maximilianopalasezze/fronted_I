import { useState } from 'react';
import { CATEGORIAS, PORTADAS } from '../utils/catalogo.js';
import { JUEGO_INICIAL, validarVideojuego } from '../utils/formularios.js';
import { formatearPrecio, precioVigente } from '../utils/carrito.js';
import FormField, { atributosCampo } from './FormField.jsx';

export default function CatalogManager({ productos, estado, onAgregar, onEliminar }) {
  const [datos, setDatos] = useState({ ...JUEGO_INICIAL });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [pendiente, setPendiente] = useState(null);
  function actualizar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
    setMensaje('');
  }
  function agregar(evento) {
    evento.preventDefault();
    const nuevos = validarVideojuego(datos, productos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      document.getElementById(`juego-${Object.keys(nuevos)[0]}`).focus();
      return;
    }
    if (onAgregar(datos)) {
      setMensaje(`${datos.nombre.trim()} agregado al catálogo. Pulsa Ver videojuegos para encontrarlo.`);
      setDatos({ ...JUEGO_INICIAL });
    }
  }
  return <section id="gestion" className="py-5 bg-body-tertiary" aria-labelledby="tituloGestion">
    <div className="container">
      <p className="text-primary fw-semibold mb-1">Tu colección</p>
      <h2 id="tituloGestion" className="fw-bold">Gestionar catálogo</h2>
      <p className="text-secondary">Agrega o retira videojuegos de esta demostración. Los cambios duran hasta recargar la página. Al retirar un juego, también se elimina del carrito.</p>
      {estado !== 'listo' ? <p className="alert alert-info">La gestión estará disponible cuando termine de cargar el catálogo.</p> : <div className="row g-4">
        <div className="col-12 col-lg-6">
          <form className="card border-0 shadow-sm p-4" onSubmit={agregar} noValidate aria-label="Agregar videojuego">
            <h3 className="h5 fw-bold mb-3">Nuevo videojuego</h3>
            <FormField id="juego-nombre" label="Título del videojuego" error={errores.nombre}>
              <input {...atributosCampo('juego-nombre', errores.nombre)} required maxLength={80} value={datos.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
            </FormField>
            <div className="row"><div className="col-12 col-sm-6">
              <FormField id="juego-categoria" label="Categoría" error={errores.categoria}>
                <select {...atributosCampo('juego-categoria', errores.categoria)} className={`form-select${errores.categoria ? ' is-invalid' : ''}`} value={datos.categoria} onChange={(e) => actualizar('categoria', e.target.value)}>
                  {CATEGORIAS.slice(1).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </FormField>
            </div><div className="col-12 col-sm-6">
              <FormField id="juego-precio" label="Precio en CLP" error={errores.precio}>
                <input {...atributosCampo('juego-precio', errores.precio)} type="number" min={1} max={1000000} step={1} required
                  value={datos.precio} onChange={(e) => actualizar('precio', e.target.value)} />
              </FormField>
            </div></div>
            <FormField id="juego-descripcion" label="Descripción" error={errores.descripcion}>
              <textarea {...atributosCampo('juego-descripcion', errores.descripcion)} rows={3} maxLength={300} required value={datos.descripcion} onChange={(e) => actualizar('descripcion', e.target.value)} />
            </FormField>
            <FormField id="juego-imagen" label="Portada" error={errores.imagen}>
              <select {...atributosCampo('juego-imagen', errores.imagen)} className={`form-select${errores.imagen ? ' is-invalid' : ''}`} value={datos.imagen} onChange={(e) => actualizar('imagen', e.target.value)}>
                {PORTADAS.map((p) => <option key={p.ruta} value={p.ruta} title={p.nombre}>{p.etiqueta ?? p.nombre}</option>)}
              </select>
            </FormField>
            <button className="btn btn-primary align-self-start" type="submit">Agregar videojuego</button>
          </form>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm p-4">
            <h3 className="h5 fw-bold">Videojuegos disponibles ({productos.length})</h3>
            {productos.length === 0 && <p className="text-secondary">El catálogo está vacío. Agrega tu primer videojuego.</p>}
            <ul className="list-unstyled vstack gap-3 mb-0 gestion-lista">
              {productos.map((p) => <li key={p.id} className="border-bottom pb-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div className="gestion-titulo"><strong>{p.nombre}</strong><p className="small text-secondary mb-0">{formatearPrecio(precioVigente(p))}</p></div>
                  <button className="btn btn-sm btn-outline-danger" type="button" aria-label={`Retirar ${p.nombre} del catálogo`} onClick={() => setPendiente(p.id)}>Retirar</button>
                </div>
                {pendiente === p.id && <div className="mt-3" role="group" aria-label={`Confirmar retiro de ${p.nombre}`}>
                  <p className="small mb-2">¿Retirar {p.nombre} del catálogo y del carrito?</p>
                  <button className="btn btn-sm btn-danger me-2" type="button" onClick={() => { onEliminar(p.id); setPendiente(null); setMensaje(`${p.nombre} retirado del catálogo y del carrito.`); }}>Confirmar retiro</button>
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setPendiente(null)}>Cancelar</button>
                </div>}
              </li>)}
            </ul>
          </div>
        </div>
      </div>}
      <div className="mt-3" role="status" aria-live="polite">{mensaje && <p className="alert alert-success">{mensaje}</p>}</div>
      <a href="#productos" className="btn btn-outline-primary mt-2">Ver videojuegos</a>
    </div>
  </section>;
}
