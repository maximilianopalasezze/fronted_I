// Bootstrap y accesibilidad compartidos por ambos formularios.
export default function FormField({ id, label, error, children }) {
  return <div className="mb-3">
    <label className="form-label fw-semibold" htmlFor={id}>{label}</label>
    {children}
    {error && <div id={`${id}-error`} className="invalid-feedback d-block">{error}</div>}
  </div>;
}
export function atributosCampo(id, error) {
  return { id, className: `form-control${error ? ' is-invalid' : ''}`, 'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined };
}
