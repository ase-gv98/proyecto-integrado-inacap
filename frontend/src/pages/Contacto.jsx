import { Link } from 'react-router-dom'

function Contacto() {
  return (
    <main>
      <section className="pagina-encabezado">
        <div className="contenedor">
          <div className="migas"><Link to="/">Inicio</Link><span>/</span><span>Contacto</span></div>
          <span className="etiqueta">Comunicación institucional</span>
          <h1>Contacto</h1>
          <p>Encuentra información de contacto, dirección administrativa y canales de atención del Departamento de Salud Municipal de Padre Las Casas.</p>
        </div>
      </section>
      <section className="contacto-seccion">
        <div className="contenedor">
          <span className="etiqueta">Canales de comunicación</span>
          <h2 className="seccion-titulo">Comunícate con nosotros</h2>
          <p className="contacto-introduccion">Consulta los medios de contacto institucional. Para ingresar reclamos, sugerencias, felicitaciones o consultas formales, utiliza el canal de atención ciudadana OIRS.</p>
          <div className="contacto-grid">
            <article className="contacto-tarjeta"><h2>Dirección administrativa</h2><p>Departamento de Salud Municipal de Padre Las Casas.</p><p className="contacto-dato">Los Alacalufes N.º 376</p><p>Padre Las Casas, Región de La Araucanía.</p></article>
            <article className="contacto-tarjeta"><h2>Atención telefónica</h2><p>Consulta general relacionada con información institucional.</p><span className="contacto-pendiente">Número oficial pendiente de confirmar</span></article>
            <article className="contacto-tarjeta"><h2>Correo institucional</h2><p>Medio de comunicación para consultas administrativas e información general.</p><span className="contacto-pendiente">Correo oficial pendiente de confirmar</span></article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contacto
