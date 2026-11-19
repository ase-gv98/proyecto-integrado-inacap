const publicaciones = [
  ['Noticia', 'Mejoras en infraestructura de establecimientos de salud', 'noticia-imagen-uno'],
  ['Actividad', 'Campaña de vacunación', 'noticia-imagen-dos'],
  ['Comunicado', 'Feria de salud en la comunidad', 'noticia-imagen-tres'],
]

function Noticias() {
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
          <div className="noticias-filtros"><button type="button" className="noticia-filtro activo">Todas</button><button type="button" className="noticia-filtro">Noticias</button><button type="button" className="noticia-filtro">Actividades</button></div>
          <div className="grid-noticias">
            {publicaciones.map(([etiqueta, titulo, clase]) => (
              <article className="tarjeta-noticia" key={titulo}>
                <div className={`noticia-imagen ${clase}`}><span>{etiqueta}</span></div>
                <div className="noticia-contenido"><h3>{titulo}</h3><a href="/noticias">Leer más →</a></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Noticias
