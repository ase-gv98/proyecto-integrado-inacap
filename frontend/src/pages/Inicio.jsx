import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWordPressPosts } from '../services/wordpressService'

const accesos = [
  { titulo: 'Establecimientos de salud', texto: 'Consulta ubicación, horarios de atención, contactos y servicios de nuestros establecimientos.', icono: 'icon-building', to: '/establecimientos', clase: 'tarjeta-azul' },
  { titulo: 'Prestaciones y programas', texto: 'Infórmate sobre las prestaciones disponibles y los programas de salud municipal.', icono: 'icon-stethoscope', to: '/prestaciones', clase: 'tarjeta-verde' },
  { titulo: 'Atención ciudadana OIRS', texto: 'Ingresa consultas, reclamos, sugerencias o agradecimientos mediante el canal digital.', icono: 'icon-message', to: '/participacion-ciudadana', clase: 'tarjeta-naranja' },
  { titulo: 'Encuesta de satisfacción', texto: 'Comparte tu experiencia de atención en nuestros establecimientos mediante una encuesta anónima.', icono: 'icon-heart', to: '/encuesta-satisfaccion', clase: 'tarjeta-rosa' },
]

function Icono({ id }) {
  return (
    <svg className="icono" aria-hidden="true">
      <use href={`/institutional-icons.svg#${id}`} />
    </svg>
  )
}

const noticias = [
  {
    etiqueta: 'Noticia',
    claseImagen: 'noticia-imagen-uno',
    titulo: 'Mejoras en infraestructura de establecimientos de salud',
    texto: 'Ejemplo de publicación sobre mejoras en espacios de atención.',
  },
  {
    etiqueta: 'Actividad',
    claseImagen: 'noticia-imagen-dos',
    titulo: 'Campaña de vacunación',
    texto: 'Ejemplo de información sobre actividades preventivas de salud.',
  },
  {
    etiqueta: 'Comunicado',
    claseImagen: 'noticia-imagen-tres',
    titulo: 'Feria de salud en la comunidad',
    texto: 'Ejemplo de actividad comunitaria y difusión de servicios de salud.',
  },
]

function Inicio() {
  const [noticiasDestacadas, setNoticiasDestacadas] = useState(noticias)

  useEffect(() => {
    let activo = true
    getWordPressPosts(3)
      .then((publicaciones) => {
        if (activo && publicaciones?.length) {
          setNoticiasDestacadas(publicaciones)
        }
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  return (
    <div className="inicio-page">
      <section className="hero">
        <div className="contenedor hero-contenido">
          <div className="hero-texto">
              <span className="etiqueta">Salud municipal</span>
              <h1>Una salud más cercana a nuestra comunidad</h1>
              <p>
                Trabajamos por el bienestar de las personas de Padre Las Casas, con una red de establecimientos de salud, programas y servicios orientados a una atención de calidad, inclusiva y territorial.
              </p>
              <div className="hero-botones">
                <Link className="boton boton-azul" to="/establecimientos">
                  <Icono id="icon-building" />
                  Conocer establecimientos
                  <Icono id="icon-arrow" />
                </Link>
                <Link className="boton boton-verde" to="/participacion-ciudadana">
                  <Icono id="icon-message" />
                  Ingresar requerimiento OIRS
                  <Icono id="icon-arrow" />
                </Link>
              </div>
          </div>
          <div className="hero-imagen" role="img" aria-label="Imagen ilustrativa de un establecimiento de salud">
            <div className="hero-mensaje">
              <Icono id="icon-people" />
              <p><strong>Comprometidos con la salud y el bienestar</strong><span>de nuestra comunidad</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="servicios" aria-label="Accesos a servicios">
        <div className="contenedor grid-servicios">
            {accesos.map((acceso) => (
              <article className={`tarjeta-servicio ${acceso.clase}`} key={acceso.titulo}>
                <span className="servicio-icono" aria-hidden="true"><Icono id={acceso.icono} /></span>
                <h2>{acceso.titulo}</h2>
                <p>{acceso.texto}</p>
                <Link to={acceso.to}>Ver información →</Link>
              </article>
            ))}
        </div>
      </section>

      <section className="compromiso">
        <div className="contenedor compromiso-contenido">
          <div className="compromiso-texto">
            <span className="etiqueta">Nuestro compromiso</span>
            <h2>Información clara y accesible para la comunidad</h2>
            <p>
              Entregamos información oportuna sobre el funcionamiento de la red de salud municipal,
              sus establecimientos, servicios, programas y canales de participación ciudadana.
            </p>
            <Link className="boton boton-azul" to="/institucion">
              <svg className="icono" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="7" r="3" />
                <path d="M6 21v-3a6 6 0 0 1 12 0v3" />
              </svg>
              Conocer la institución
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="compromiso-visual">
            <div className="participacion-tarjeta">
              <div className="participacion-icono">
                <svg className="icono" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="7" r="3" />
                  <circle cx="5" cy="10" r="2" />
                  <circle cx="19" cy="10" r="2" />
                  <path d="M6 21v-3a6 6 0 0 1 12 0v3" />
                </svg>
              </div>
              <div>
                <h3>Participación ciudadana</h3>
                <p>Tu opinión y tus requerimientos nos ayudan a mejorar la atención de salud en la comuna.</p>
                <Link to="/participacion">Conocer los canales de participación →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="noticias">
        <div className="contenedor">
          <div className="noticias-encabezado">
            <div>
              <span className="etiqueta">Actualidad</span>
              <h2>Noticias y actividades</h2>
              <p>Revisa noticias, actividades y comunicados del Departamento de Salud Municipal.</p>
            </div>
            <Link className="boton boton-contorno" to="/noticias">
              Ver todas las noticias <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid-noticias" id="noticias-inicio">
            {noticiasDestacadas.map((noticia) => (
              <article className="tarjeta-noticia" key={noticia.id || noticia.titulo}>
                <div
                  className={`noticia-imagen ${noticia.claseImagen}`}
                  style={noticia.imagen ? { backgroundImage: `url("${noticia.imagen}")` } : undefined}
                >
                  <span>{noticia.etiqueta}</span>
                </div>
                <div className="noticia-contenido">
                  <h3>{noticia.titulo}</h3>
                  <p>{noticia.texto}</p>
                  <Link to="/noticias">Leer más →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Inicio
