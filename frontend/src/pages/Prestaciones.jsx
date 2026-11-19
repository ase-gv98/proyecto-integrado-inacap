const prestaciones = [
  {
    id: 'policlinica',
    titulo: 'Atención policlínica',
    descripcion: 'Atención médica general, control de enfermedades crónicas y consulta de especialidades según derivación.',
  },
  {
    id: 'vacunatorio',
    titulo: 'Vacunatorio',
    descripcion: 'Vacunación infantil, adulta y campañas municipales, siempre según el calendario vigente.',
  },
  {
    id: 'medicamentos',
    titulo: 'Entrega de medicamentos',
    descripcion: 'Retiro y seguimiento de tratamientos farmacológicos recetados y gestionados a través de la atención primaria.',
  },
  {
    id: 'dental',
    titulo: 'Salud dental',
    descripcion: 'Atención odontológica, controles, urgencias dentales y procedimientos según prioridad clínica.',
  },
]

function Prestaciones() {
  return (
    <main>
      <section className="pagina-encabezado">
        <div className="contenedor">
          <div className="migas"><a href="/">Inicio</a><span>/</span><span>Prestaciones y programas</span><span>/</span><span>Prestaciones</span></div>
          <span className="etiqueta">Atención primaria</span>
          <h1>Prestaciones de salud</h1>
          <p>Conoce las prestaciones y actividades de salud que forman parte de la atención primaria municipal, organizadas según las áreas de atención.</p>
        </div>
      </section>
      <section className="prestaciones-seccion">
        <div className="contenedor">
          <span className="etiqueta">Servicios de salud</span>
          <h2 className="prestaciones-titulo">Explora nuestras prestaciones</h2>
          <p className="prestaciones-introduccion">Selecciona un área de atención o utiliza el buscador para encontrar prestaciones específicas.</p>
          <div className="prestaciones-grid">
            {prestaciones.map((prestacion) => (
              <article className="prestacion-tarjeta" key={prestacion.id}>
                <div className="prestacion-icono"><svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-stethoscope" /></svg></div>
                <h3>{prestacion.titulo}</h3>
                <p>{prestacion.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Prestaciones
