import { useState } from 'react';
import FormField, { atributosCampo } from './FormField.jsx';
import { CONTACTO_INICIAL, validarContacto } from '../utils/formularios.js';

export default function ContactForm() {
  const [datos, setDatos] = useState({ ...CONTACTO_INICIAL });
  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState('');
  function actualizar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
    setConfirmacion('');
  }
  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarContacto(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      setConfirmacion('');
      document.getElementById(`contacto-${Object.keys(nuevos)[0]}`).focus();
      return;
    }
    // La EFT pide frontend: no fingimos enviar un correo sin un servidor.
    setConfirmacion(`Gracias, ${datos.nombre.trim()}. Tu mensaje fue validado correctamente. En esta demostración no se envían correos.`);
    setDatos({ ...CONTACTO_INICIAL });
  }
  return <section id="contacto" className="py-5" aria-labelledby="tituloContacto">
    <div className="container"><div className="row g-4">
      <div className="col-12 col-lg-5">
        <p className="text-primary fw-semibold mb-1">Estamos para ayudarte</p>
        <h2 id="tituloContacto" className="fw-bold">Contacto</h2>
        <p className="text-secondary">Cuéntanos qué juego buscas o deja tu consulta sobre el catálogo.</p>
        <p className="small text-secondary">Formulario de demostración. Valida tus datos y muestra una confirmación; no envía correos ni guarda tus datos personales.</p>
      </div>
      <div className="col-12 col-lg-7">
        <form className="card border-0 shadow-sm p-4" onSubmit={enviar} noValidate aria-label="Formulario de contacto">
          <FormField id="contacto-nombre" label="Nombre" error={errores.nombre}>
            <input {...atributosCampo('contacto-nombre', errores.nombre)} name="nombre" autoComplete="name" required maxLength={80}
              value={datos.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
          </FormField>
          <FormField id="contacto-email" label="Email" error={errores.email}>
            <input {...atributosCampo('contacto-email', errores.email)} name="email" type="email" autoComplete="email" required maxLength={254}
              value={datos.email} onChange={(e) => actualizar('email', e.target.value)} />
          </FormField>
          <FormField id="contacto-mensaje" label="Mensaje" error={errores.mensaje}>
            <textarea {...atributosCampo('contacto-mensaje', errores.mensaje)} name="mensaje" rows={4} required maxLength={1000}
              value={datos.mensaje} onChange={(e) => actualizar('mensaje', e.target.value)} />
          </FormField>
          {Object.values(errores).some(Boolean) && <p className="alert alert-danger" role="alert">Revisa los campos indicados antes de enviar.</p>}
          <div role="status" aria-live="polite">{confirmacion && <p className="alert alert-success">{confirmacion}</p>}</div>
          <button className="btn btn-primary align-self-start" type="submit">Enviar mensaje</button>
        </form>
      </div>
    </div></div>
  </section>;
}
