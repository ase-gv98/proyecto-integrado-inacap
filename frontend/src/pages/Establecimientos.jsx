const establecimientos = [
  {
    nombre: 'CESFAM Dr. Botto',
    direccion: 'Av. España 0123, Padre Las Casas',
    telefono: '+56 45 275 1001',
    horario: 'Lunes a viernes · 08:00 a 17:00',
  },
  {
    nombre: 'CESFAM Pulmahue',
    direccion: 'Los Laureles 0450, Padre Las Casas',
    telefono: '+56 45 275 1002',
    horario: 'Lunes a viernes · 08:00 a 17:00',
  },
  {
    nombre: 'CESFAM Conunhueno',
    direccion: 'Ruta S-40 N° 220, Padre Las Casas',
    telefono: '+56 45 275 1003',
    horario: 'Lunes a viernes · 08:00 a 17:00',
  },
  {
    nombre: 'Postas de Salud Rural',
    direccion: 'Sector rural de la comuna',
    telefono: '+56 45 275 1004',
    horario: 'Días y horarios variables por sector',
  },
]

function Establecimientos() {
  return (
    <main className="page-shell">
      <div className="container py-5">
        <div className="page-heading text-center mb-5">
          <p className="oirs-eyebrow">Red asistencial municipal</p>
          <h1>Establecimientos de salud</h1>
          <p>Encuentre información de contacto y atención de los centros de la comuna.</p>
        </div>

        <div className="row g-4">
          {establecimientos.map((establecimiento) => (
            <div className="col-md-6 col-xl-3" key={establecimiento.nombre}>
              <article className="card establishment-card h-100">
                <div className="card-body">
                  <div className="establishment-icon" aria-hidden="true">+</div>
                  <h2>{establecimiento.nombre}</h2>
                  <dl className="establishment-details">
                    <div>
                      <dt>Dirección</dt>
                      <dd>{establecimiento.direccion}</dd>
                    </div>
                    <div>
                      <dt>Teléfono</dt>
                      <dd><a href={`tel:${establecimiento.telefono}`}>{establecimiento.telefono}</a></dd>
                    </div>
                    <div>
                      <dt>Horario</dt>
                      <dd>{establecimiento.horario}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Establecimientos
