import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-contenido">
        <div className="footer-identidad">
          <img src="/logo-salud-footer.png" alt="Departamento de Salud Municipal de Padre Las Casas" className="footer-logo" />
        </div>
        <div className="footer-columna">
          <h3>Enlaces de interés</h3>
          <ul>
            <li><Link to="/establecimientos">Establecimientos de salud</Link></li>
            <li><Link to="/prestaciones">Prestaciones y programas</Link></li>
            <li><Link to="/participacion-ciudadana">OIRS</Link></li>
            <li><Link to="/encuesta-satisfaccion">Encuesta de satisfacción</Link></li>
          </ul>
        </div>
        <div className="footer-columna">
          <h3>Accesos institucionales</h3>
          <ul>
            <li><Link to="/consulta-estado">Consulta de solicitudes</Link></li>
            <li><Link to="/acceso-funcionarios">Acceso a intranet</Link></li>
            <li><Link to="/acceso-funcionarios">Gestión de contenidos</Link></li>
          </ul>
        </div>
        <div className="footer-columna">
          <h3>Contacto</h3>
          <p>Departamento de Salud Municipal de Padre Las Casas</p>
          <p className="footer-nota">Información oficial de contacto pendiente de incorporar.</p>
        </div>
        <div className="footer-columna footer-redes">
          <h3>Síguenos</h3>
          <div className="redes-sociales">
            <span className="red-social" aria-label="Facebook">f</span>
            <span className="red-social" aria-label="Instagram">◎</span>
            <span className="red-social" aria-label="YouTube">▶</span>
          </div>
        </div>
      </div>
      <div className="contenedor footer-inferior">
        <p>© 2026 Departamento de Salud Municipal de Padre Las Casas. Prototipo de interfaz para el proyecto integrado. No corresponde a un sitio institucional en producción.</p>
      </div>
    </footer>
  )
}

export default Footer
