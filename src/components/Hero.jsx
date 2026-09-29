export default function Hero() {
  return <section id="inicio" className="hero py-5">
    <div className="container py-lg-4"><div className="row align-items-center g-4">
      <div className="col-12 col-lg-7">
        <span className="badge text-bg-primary mb-3">Game Zone X</span>
        <h1 className="display-5 fw-bold">Tu próxima experiencia gamer comienza aquí</h1>
        <p className="lead text-secondary">Explora consolas y accesorios, descubre ofertas y arma tu próximo nivel.</p>
        <a className="btn btn-primary btn-lg" href="#productos">Ver productos</a>
      </div>
      <div className="col-12 col-lg-5 text-center">
        <img src={`${import.meta.env.BASE_URL}assets/img/logo.png`} className="hero-img img-fluid rounded-4 shadow-sm" alt="Game Zone X" />
      </div>
    </div></div>
  </section>;
}
