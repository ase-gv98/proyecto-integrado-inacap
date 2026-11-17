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
    <main className="page-shell">
      <div className="container py-5">
        <div className="page-heading text-center mb-5">
          <p className="oirs-eyebrow">Atención primaria</p>
          <h1>Prestaciones disponibles</h1>
          <p>Conozca los principales servicios ofrecidos por la red municipal de salud.</p>
        </div>

        <div className="accordion prestations-accordion" id="prestacionesAccordion">
          {prestaciones.map((prestacion, index) => (
            <div className="accordion-item" key={prestacion.id}>
              <h2 className="accordion-header" id={`heading-${prestacion.id}`}>
                <button
                  className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${prestacion.id}`}
                  aria-expanded={index === 0 ? 'true' : 'false'}
                  aria-controls={`collapse-${prestacion.id}`}
                >
                  {prestacion.titulo}
                </button>
              </h2>
              <div
                id={`collapse-${prestacion.id}`}
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                aria-labelledby={`heading-${prestacion.id}`}
                data-bs-parent="#prestacionesAccordion"
              >
                <div className="accordion-body">{prestacion.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Prestaciones
