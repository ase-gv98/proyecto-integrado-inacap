import { NavLink, Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark institutional-navbar">
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand institutional-brand" to="/" aria-label="Ir al inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <circle cx="24" cy="24" r="21" fill="currentColor" />
              <rect x="21" y="11" width="6" height="26" rx="2" fill="#ffffff" />
              <rect x="11" y="21" width="26" height="6" rx="2" fill="#ffffff" />
            </svg>
          </span>
          <span className="brand-text">
            <span>Departamento de Salud Municipal</span>
            <strong>Padre Las Casas</strong>
          </span>
        </Link>

        <button
          className="navbar-toggler institutional-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#institutionalNavbar"
          aria-controls="institutionalNavbar"
          aria-expanded="false"
          aria-label="Abrir menú de navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="institutionalNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center institutional-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/establecimientos">Establecimientos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/prestaciones">Prestaciones</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/participacion-ciudadana">Participación Ciudadana (OIRS)</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/consulta-estado">Consultar Estado</NavLink>
            </li>
            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
              <Link className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold" to="/acceso-funcionarios">
                Acceso funcionarios
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
