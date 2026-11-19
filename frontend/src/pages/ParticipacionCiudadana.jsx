import { Link } from 'react-router-dom'

function ParticipacionCiudadana() {
  return (
    <main>
      <section className="pagina-encabezado">
        <div className="contenedor">
          <div className="migas"><Link to="/">Inicio</Link><span>/</span><span>Participación ciudadana</span></div>
          <span className="etiqueta">Tu voz es importante</span>
          <h1>Participación ciudadana</h1>
          <p>Tu opinión y experiencia son importantes para mejorar los servicios de salud municipal. Conoce los canales propuestos para comunicarte y participar.</p>
        </div>
      </section>
      <section className="participacion-seccion">
        <div className="contenedor">
          <span className="etiqueta">Canales disponibles en el prototipo</span>
          <h2 className="participacion-titulo">¿Cómo puedes participar?</h2>
          <p className="participacion-introduccion">El sistema propuesto busca facilitar la comunicación entre la comunidad y el Departamento de Salud Municipal mediante canales digitales de atención y retroalimentación.</p>
          <div className="participacion-grid">
            <article className="participacion-tarjeta"><div className="participacion-icono"><svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-message" /></svg></div><h3>Oficina OIRS</h3><p>Ingresa consultas, reclamos, sugerencias o felicitaciones relacionadas con la atención recibida en la red municipal. No necesitas crear una cuenta.</p><Link to="/oirs" className="participacion-boton">Ingresar solicitud OIRS</Link></article>
            <article className="participacion-tarjeta"><div className="participacion-icono"><svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-heart" /></svg></div><h3>Encuesta de satisfacción</h3><p>Comparte tu opinión sobre la atención y la información entregada por los servicios de salud. La encuesta propuesta es anónima.</p><Link to="/encuesta" className="participacion-boton">Responder encuesta</Link></article>
            <article className="participacion-tarjeta"><div className="participacion-icono"><svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-building" /></svg></div><h3>Atención en establecimientos</h3><p>Consulta el directorio de establecimientos para identificar el centro correspondiente y revisar su información de contacto.</p><Link to="/establecimientos" className="participacion-boton secundario">Ver establecimientos</Link></article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ParticipacionCiudadana
