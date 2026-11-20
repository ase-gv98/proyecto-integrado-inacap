import { useEffect, useMemo, useState } from 'react'
import { getWordPressPosts } from '../services/wordpressService'

const publicaciones = [
  { id: 'fallback-1', etiqueta: 'Noticia', titulo: 'Mejoras en infraestructura de establecimientos de salud', texto: 'Conoce las mejoras y trabajos realizados en la red de establecimientos de salud.', claseImagen: 'noticia-imagen-uno', fecha: null },
  { id: 'fallback-2', etiqueta: 'Actividad', titulo: 'Campaña de vacunación', texto: 'Información sobre jornadas preventivas y actividades de vacunación comunitaria.', claseImagen: 'noticia-imagen-dos', fecha: null },
  { id: 'fallback-3', etiqueta: 'Comunicado', titulo: 'Feria de salud en la comunidad', texto: 'Actividades comunitarias y difusión de servicios de salud disponibles.', claseImagen: 'noticia-imagen-tres', fecha: null },
]

function Noticias() {
  const [publicacionesActuales, setPublicacionesActuales] = useState(publicaciones)
  const [filtro, setFiltro] = useState('Todas')

  useEffect(() => {
    let activo = true
    getWordPressPosts(12)
      .then((publicacionesWp) => {
        if (activo && publicacionesWp?.length) {
          setPublicacionesActuales(publicacionesWp)
        }
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  const publicacionesFiltradas = useMemo(() => {
    if (filtro === 'Todas') return publicacionesActuales
    return publicacionesActuales.filter((publicacion) =>
      publicacion.etiqueta.toLowerCase().includes(filtro.toLowerCase().replace(/s$/, ''))
    )
  }, [filtro, publicacionesActuales])

  return (
    <main>
      <section className="pagina-encabezado">
        <div className="contenedor">
          <div className="migas"><a href="/">Inicio</a><span>/</span><span>Noticias y actividades</span></div>
          <span className="etiqueta">Actualidad institucional</span>
          <h1>Noticias y actividades</h1>
          <p>Infórmate sobre iniciativas, proyectos, actividades comunitarias y acontecimientos de la red de salud municipal de Padre Las Casas.</p>
        </div>
      </section>
      <section className="noticias">
        <div className="contenedor">
          <span className="etiqueta">Publicaciones institucionales</span>
          <h2 className="noticias-titulo">Conoce nuestras publicaciones</h2>
          <p className="noticias-introduccion">Explora nuestras publicaciones y filtra entre noticias institucionales y actividades comunitarias. Las fechas corresponden a los registros de publicación de cada contenido.</p>
          <div className="noticias-filtros">
            {['Todas', 'Noticias', 'Actividades'].map((opcion) => (
              <button
                type="button"
                className={`noticia-filtro ${filtro === opcion ? 'activo' : ''}`}
                key={opcion}
                onClick={() => setFiltro(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
          <div className="grid-noticias">
            {publicacionesFiltradas.map((publicacion) => (
              <article className="tarjeta-noticia" key={publicacion.id || publicacion.titulo}>
                <div
                  className={`noticia-imagen ${publicacion.claseImagen}`}
                  style={publicacion.imagen ? { backgroundImage: `url("${publicacion.imagen}")` } : undefined}
                >
                  <span>{publicacion.etiqueta}</span>
                </div>
                <div className="noticia-contenido">
                  <h3>{publicacion.titulo}</h3>
                  {publicacion.texto && <p>{publicacion.texto}</p>}
                  {publicacion.fecha && <small>{new Date(publicacion.fecha).toLocaleDateString('es-CL')}</small>}
                  <a href={publicacion.enlace || '/noticias'} target={publicacion.enlace?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">Leer más →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Noticias
