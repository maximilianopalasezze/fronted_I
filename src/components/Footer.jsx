export default function Footer() {
  return <footer className="bg-dark text-white py-4">
    <div className="container">
      <div className="row align-items-center g-3">
        <div className="col-12 col-md-6"><h2 className="h5 mb-1">GAME ZONE X</h2><p className="text-white-50 mb-0">Tienda de videojuegos · Proyecto académico PFY2201</p></div>
        <div className="col-12 col-md-6 text-md-end">
          <a className="footer-link me-3" href="#inicio">Inicio</a>
          <a className="footer-link me-3" href="#productos">Videojuegos</a>
          <a className="footer-link" href="#contacto">Contacto</a>
        </div>
      </div>
      <hr className="border-secondary" />
    </div>
  </footer>;
}
