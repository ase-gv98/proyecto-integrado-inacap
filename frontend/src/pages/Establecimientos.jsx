import { useEffect, useMemo, useState } from 'react'

const horarioCesfam = 'Lunes a jueves: 08:00 a 17:00 hrs. Viernes: 08:00 a 16:00 hrs.'

const establecimientosBase = [
  { id: 'cesfam-padre-las-casas', nombre: 'CESFAM Padre Las Casas', tipo: 'cesfam', categoria: 'Centro de Salud Familiar', direccion: 'Almirante Barroso 365, Padre Las Casas', telefono: '452962020', correo: 'roberto.balmora@padrelascasas.cl', responsable: 'Roberto Balmora Torres', cargo: 'Director de establecimiento', horario: horarioCesfam, descripcion: 'Los Centros de Salud Familiar brindan atención primaria con acciones de promoción, prevención, tratamiento y rehabilitación.' },
  { id: 'cesfam-las-colinas', nombre: 'CESFAM Las Colinas', tipo: 'cesfam', categoria: 'Centro de Salud Familiar', direccion: 'Mañil 130, Padre Las Casas', telefono: '452962250', correo: 'celso.navarrete@padrelascasas.cl', responsable: 'Celso Navarrete Berríos', cargo: 'Director de establecimiento', horario: horarioCesfam, descripcion: 'Los Centros de Salud Familiar brindan atención primaria con enfoque familiar y comunitario.' },
  { id: 'cesfam-pulmahue', nombre: 'CESFAM Pulmahue', tipo: 'cesfam', categoria: 'Centro de Salud Familiar', direccion: 'Avenida La Quebrada N.º 1419, Padre Las Casas', telefono: '452962100', correo: 'gquezada@padrelascasas.cl', responsable: 'Gabriela Quezada Vásquez', cargo: 'Directora de establecimiento', horario: horarioCesfam, descripcion: 'Los Centros de Salud Familiar brindan atención primaria con acciones de promoción, prevención, tratamiento y rehabilitación.' },
  { id: 'cesfam-conunhuenu', nombre: 'CESFAM Conunhueno', tipo: 'cesfam', categoria: 'Centro de Salud Familiar', direccion: 'Avenida Pulmahue 1405, Padre Las Casas', telefono: '452742300', correo: 'erosales@padrelascasas.cl', responsable: 'Elizabeth Rosales Velozo', cargo: 'Directora de establecimiento', horario: horarioCesfam, descripcion: 'Los Centros de Salud Familiar brindan atención primaria con enfoque familiar y comunitario.' },
  { id: 'sar-padre-las-casas', nombre: 'SAR Padre Las Casas', tipo: 'urgencia', categoria: 'Servicio de Urgencia de Alta Resolución', direccion: 'Las Águilas 1402, Padre Las Casas', telefono: '', correo: 'aaranda@padrelascasas.cl', responsable: 'Anita Aranda Parra', cargo: 'Directora de establecimiento', horario: 'Atención las 24 horas', descripcion: 'El SAR proporciona atención de urgencias de menor y mediana complejidad y permite derivar casos a centros hospitalarios.' },
  { id: 'ccr', nombre: 'Centro Comunitario de Rehabilitación (CCR)', tipo: 'rehabilitacion', categoria: 'Centro Comunitario de Rehabilitación', direccion: 'Francisco Pizarro 680, Padre Las Casas', telefono: '452746450', correo: 'contacto.ccr@padrelascasas.cl', responsable: 'Josefa Molina Sandoval', cargo: 'Encargada de programa', horario: horarioCesfam, descripcion: 'Apoyo a personas con discapacidad física mediante kinesiología, terapia ocupacional, psicología, asistencia social y fonoaudiología.' },
  { id: 'rural-roble-huacho', nombre: 'Centro de Salud Rural Roble Huacho', tipo: 'rural', categoria: 'Centro de Salud Rural', direccion: '', telefono: '', correo: '', responsable: '', cargo: '', horario: '', descripcion: 'Centro de salud rural mencionado en el directorio institucional. Sus datos específicos están pendientes de verificación.' },
  { id: 'rural-san-ramon', nombre: 'Centro de Salud Rural San Ramón', tipo: 'rural', categoria: 'Centro de Salud Rural', direccion: '', telefono: '', correo: '', responsable: '', cargo: '', horario: '', descripcion: 'Centro de salud rural mencionado en el directorio institucional. Sus datos específicos están pendientes de verificación.' },
  { id: 'rural-laurel-huacho', nombre: 'Centro de Salud Rural Laurel Huacho', tipo: 'rural', categoria: 'Centro de Salud Rural', direccion: '', telefono: '', correo: '', responsable: '', cargo: '', horario: '', descripcion: 'Centro de salud rural mencionado en el directorio institucional. Sus datos específicos están pendientes de verificación.' },
  { id: 'rural-metrenco', nombre: 'Centro de Salud Rural Metrenco', tipo: 'rural', categoria: 'Centro de Salud Rural', direccion: '', telefono: '', correo: '', responsable: '', cargo: '', horario: '', descripcion: 'Centro de salud rural mencionado en el directorio institucional. Sus datos específicos están pendientes de verificación.' },
  { id: 'rural-codopille', nombre: 'Centro de Salud Rural Codopille', tipo: 'rural', categoria: 'Centro de Salud Rural', direccion: '', telefono: '', correo: '', responsable: '', cargo: '', horario: '', descripcion: 'Centro de salud rural mencionado en el directorio institucional. Sus datos específicos están pendientes de verificación.' },
  { id: 'rural-truf-truf', nombre: 'Centro de Salud Rural Truf Truf', tipo: 'rural', categoria: 'Centro de Salud Rural', direccion: '', telefono: '', correo: '', responsable: '', cargo: '', horario: '', descripcion: 'Centro de salud rural mencionado en el directorio institucional. Sus datos específicos están pendientes de verificación.' },
]

const filtros = [
  { value: 'todos', label: 'Todos' },
  { value: 'cesfam', label: 'CESFAM' },
  { value: 'rural', label: 'Salud rural' },
  { value: 'urgencia', label: 'Urgencia' },
  { value: 'rehabilitacion', label: 'Rehabilitación' },
]

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

function datoDisponible(valor) {
  return String(valor || '').trim() || 'Información pendiente de confirmar'
}

function Establecimientos() {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null)

  const establecimientos = useMemo(() => {
    let fichas = []
    try {
      fichas = JSON.parse(localStorage.getItem('plc_establecimientos_info_demo_v1') || '[]')
      if (!Array.isArray(fichas)) fichas = []
    } catch {
      fichas = []
    }

    return establecimientosBase.map((item) => {
      const ficha = fichas.find((registro) => normalizar(registro?.nombre) === normalizar(item.nombre))
      return ficha ? { ...item, ...ficha, id: item.id } : item
    })
  }, [])

  useEffect(() => {
    const abrirDesdeHash = () => {
      if (!window.location.hash.startsWith('#ficha=')) {
        setSelectedEstablecimiento(null)
        return
      }
      const id = decodeURIComponent(window.location.hash.slice('#ficha='.length))
      setSelectedEstablecimiento(establecimientos.find((item) => item.id === id) || null)
    }
    abrirDesdeHash()
    window.addEventListener('popstate', abrirDesdeHash)
    window.addEventListener('hashchange', abrirDesdeHash)
    return () => {
      window.removeEventListener('popstate', abrirDesdeHash)
      window.removeEventListener('hashchange', abrirDesdeHash)
    }
  }, [establecimientos])

  const establecimientosFiltrados = useMemo(() => {
    const texto = normalizar(busqueda)
    return establecimientos.filter((establecimiento) => {
      const coincideTipo = filtro === 'todos' || establecimiento.tipo === filtro
      const coincideTexto = normalizar([
        establecimiento.nombre,
        establecimiento.direccion,
        establecimiento.categoria,
      ].join(' ')).includes(texto)
      return coincideTipo && coincideTexto
    })
  }, [busqueda, filtro, establecimientos])

  const abrirFicha = (establecimiento) => {
    const nuevoHash = `#ficha=${encodeURIComponent(establecimiento.id)}`
    if (window.location.hash !== nuevoHash) window.history.pushState({ establecimiento: establecimiento.id }, '', nuevoHash)
    setSelectedEstablecimiento(establecimiento)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const volverDirectorio = () => {
    window.history.pushState({}, '', window.location.pathname + window.location.search)
    setSelectedEstablecimiento(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main>
      {selectedEstablecimiento ? (
        <section className="ficha-establecimiento-seccion">
          <div className="contenedor">
            <button type="button" className="noticia-volver" onClick={volverDirectorio}>← Volver al directorio</button>
            <div className="ficha-cabecera">
              <span className="establecimiento-categoria" data-tipo={selectedEstablecimiento.tipo}>{selectedEstablecimiento.categoria}</span>
              <h1>{selectedEstablecimiento.nombre}</h1>
              <p>{selectedEstablecimiento.descripcion}</p>
            </div>
            <div className="ficha-grid">
              <article className="ficha-panel">
                <div className="ficha-dato"><dt>Dirección</dt><dd>{datoDisponible(selectedEstablecimiento.direccion)}</dd></div>
                <div className="ficha-dato"><dt>Teléfono</dt><dd>{selectedEstablecimiento.telefono ? <a href={`tel:${selectedEstablecimiento.telefono}`}>{selectedEstablecimiento.telefono}</a> : datoDisponible(selectedEstablecimiento.telefono)}</dd></div>
                <div className="ficha-dato"><dt>Correo electrónico</dt><dd>{selectedEstablecimiento.correo ? <a href={`mailto:${selectedEstablecimiento.correo}`}>{selectedEstablecimiento.correo}</a> : datoDisponible(selectedEstablecimiento.correo)}</dd></div>
                <div className="ficha-dato"><dt>Horario de funcionamiento</dt><dd>{datoDisponible(selectedEstablecimiento.horario)}</dd></div>
                <div className="ficha-dato"><dt>{selectedEstablecimiento.cargo || 'Responsable'}</dt><dd>{datoDisponible(selectedEstablecimiento.responsable)}</dd></div>
              </article>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="pagina-encabezado">
            <div className="contenedor">
              <div className="migas"><a href="/">Inicio</a><span>/</span><span>Establecimientos de salud</span></div>
              <span className="etiqueta">Red de salud municipal</span>
              <h1>Establecimientos de salud</h1>
              <p>Conoce los centros de salud familiar, dispositivos de urgencia, rehabilitación y centros de salud rural que forman parte de la red municipal de Padre Las Casas.</p>
            </div>
          </section>
          <section className="directorio-seccion" id="seccion-directorio">
            <div className="contenedor">
              <span className="etiqueta">Directorio</span>
              <h2 className="directorio-titulo">Encuentra tu establecimiento</h2>
              <p className="directorio-introduccion">Busca por nombre o selecciona un tipo de establecimiento. Puedes abrir cada ficha para consultar sus datos de contacto, ubicación y horario de atención disponibles.</p>
              <div className="directorio-controles">
                <div className="directorio-buscador">
                  <label htmlFor="buscar-establecimiento">Buscar establecimiento</label>
                  <div className="directorio-campo-busqueda">
                    <svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-search" /></svg>
                    <input id="buscar-establecimiento" type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por nombre o dirección..." autoComplete="off" />
                  </div>
                </div>
                <div className="directorio-filtros" role="group" aria-label="Filtrar establecimientos">
                  {filtros.map((opcion) => (
                    <button type="button" className={`filtro-boton ${filtro === opcion.value ? 'activo' : ''}`} aria-pressed={filtro === opcion.value} onClick={() => setFiltro(opcion.value)} key={opcion.value}>
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="directorio-resultado" aria-live="polite">Mostrando {establecimientosFiltrados.length} de {establecimientos.length} establecimientos.</p>
              {establecimientosFiltrados.length === 0 && <div className="directorio-vacio" role="status">No se encontraron establecimientos con los filtros seleccionados.</div>}
              <div className="establecimientos-grid">
                {establecimientosFiltrados.map((establecimiento) => (
                  <article className="establecimiento-tarjeta" data-tipo={establecimiento.tipo} key={establecimiento.id}>
                    <div className="establecimiento-imagen"><svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-building" /></svg></div>
                    <div className="establecimiento-cuerpo">
                      <span className="establecimiento-categoria">{establecimiento.categoria}</span>
                      <h3>{establecimiento.nombre}</h3>
                      <p className="establecimiento-dato"><strong>Dirección:</strong> {datoDisponible(establecimiento.direccion)}</p>
                      <p className="establecimiento-dato"><strong>Horario:</strong> {datoDisponible(establecimiento.horario)}</p>
                      <div className="establecimiento-acciones"><button type="button" className="boton-ficha" onClick={() => abrirFicha(establecimiento)}>Ver ficha del establecimiento</button></div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default Establecimientos
