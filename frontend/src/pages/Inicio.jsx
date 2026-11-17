import { Link } from 'react-router-dom'

const accesos = [
  { titulo: 'Agendar horas', texto: 'Solicite atención médica', icono: 'A', to: '/prestaciones' },
  { titulo: 'Urgencias', texto: 'Información de atención urgente', icono: 'U', to: '/establecimientos' },
  { titulo: 'OIRS', texto: 'Ingrese o revise una solicitud', icono: 'O', to: '/participacion-ciudadana' },
  { titulo: 'Establecimientos', texto: 'Encuentre su centro de salud', icono: 'E', to: '/establecimientos' },
]

const noticias = [
  {
    titulo: 'Campaña de vacunación de invierno',
    fecha: '17 noviembre',
    texto: 'Consulte los horarios disponibles en su CESFAM y lleve su carnet de salud.',
  },
  {
    titulo: 'Atención de salud preventiva',
    fecha: '15 noviembre',
    texto: 'Reforzamos los controles preventivos para niños, mujeres y personas mayores.',
  },
  {
    titulo: 'Nueva vía de atención ciudadana',
    fecha: '12 noviembre',
    texto: 'Puede ingresar y consultar el estado de sus solicitudes a través del portal OIRS.',
  },
]

function Inicio() {
  return (
    <div className="inicio-page">
      <section className="hero-institucional">
        <div className="container py-5">
          <div className="row align-items-center min-vh-hero">
            <div className="col-lg-7">
              <span className="hero-kicker">Departamento de Salud Municipal</span>
              <h1>Comprometidos con la salud de Padre Las Casas</h1>
              <p>
                Atención cercana, prevención y servicios de salud para toda nuestra comunidad.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn hero-primary" to="/establecimientos">
                  Buscar establecimiento
                </Link>
                <Link className="btn hero-secondary" to="/participacion-ciudadana">
                  Participación OIRS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-access-section">
        <div className="container">
          <div className="row g-3">
            {accesos.map((acceso) => (
              <div className="col-sm-6 col-lg-3" key={acceso.titulo}>
                <Link className="quick-access-card" to={acceso.to}>
                  <span className="quick-access-icon" aria-hidden="true">{acceso.icono}</span>
                  <span>
                    <strong>{acceso.titulo}</strong>
                    <small>{acceso.texto}</small>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="news-section">
        <div className="container py-5">
          <div className="section-heading">
            <div>
              <p className="oirs-eyebrow">Información comunitaria</p>
              <h2>Avisos y noticias importantes</h2>
            </div>
          </div>
          <div className="row g-4">
            {noticias.map((noticia) => (
              <div className="col-md-4" key={noticia.titulo}>
                <article className="news-card card h-100">
                  <div className="card-body">
                    <span className="news-date">{noticia.fecha}</span>
                    <h3>{noticia.titulo}</h3>
                    <p>{noticia.texto}</p>
                    <button type="button" className="news-link">Leer aviso</button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Inicio
