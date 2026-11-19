import { Link } from 'react-router-dom'

function Institucion() {
  return (
    <main>
      <section className="pagina-encabezado">
        <div className="contenedor">
          <div className="migas"><Link to="/">Inicio</Link><span>/</span><span>Institución</span><span>/</span><span>Quiénes somos</span></div>
          <span className="etiqueta">Quiénes somos</span>
          <h1>Departamento de Salud Municipal</h1>
          <p>Conoce el rol, las principales funciones, la organización administrativa y la red de atención primaria de salud de Padre Las Casas.</p>
        </div>
      </section>
      <section className="institucion-seccion" id="quienes-somos">
        <div className="contenedor institucion-grid">
          <div className="institucion-texto">
            <span className="etiqueta">Quiénes somos</span>
            <h2>Salud municipal al servicio de la comunidad</h2>
            <p>El Departamento de Salud Municipal de Padre Las Casas tiene a su cargo la administración y operación de los establecimientos municipales de atención primaria de salud.</p>
            <p>Su labor comprende apoyar el funcionamiento de los establecimientos, gestionar los recursos necesarios y velar por el cumplimiento de los objetivos, normas, planes y programas del Ministerio de Salud que correspondan a la atención primaria.</p>
            <p>Este portal facilita el acceso a información institucional, establecimientos, prestaciones, programas y canales de participación ciudadana.</p>
          </div>
          <div className="institucion-ilustracion">
            <div className="institucion-imagen" role="img" aria-label="Espacio reservado para una fotografía institucional"></div>
            <div className="institucion-ilustracion-contenido">
              <div className="institucion-ilustracion-icono"><svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-building" /></svg></div>
              <div className="institucion-ilustracion-texto"><h3>Red de salud municipal</h3><p>Información accesible sobre los establecimientos, programas y servicios de salud de la comuna.</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Institucion
