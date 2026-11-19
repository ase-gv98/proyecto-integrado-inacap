import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [submenuAbierto, setSubmenuAbierto] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const navigate = useNavigate()
  const secciones = [
    { titulo: 'Inicio', ruta: '/' },
    { titulo: 'Institución', descripcion: 'Información institucional', palabrasClave: ['quienes somos', 'departamento', 'salud municipal'], ruta: '/institucion' },
    { titulo: 'Contacto', descripcion: 'Información de contacto', palabrasClave: ['telefono', 'correo', 'direccion'], ruta: '/contacto' },
    { titulo: 'Establecimientos', descripcion: 'Directorio de establecimientos', palabrasClave: ['cesfam', 'postas', 'ubicacion', 'horarios'], ruta: '/establecimientos' },
    { titulo: 'Prestaciones de salud', descripcion: 'Servicios y prestaciones disponibles', palabrasClave: ['atencion', 'servicios', 'salud'], ruta: '/prestaciones' },
    { titulo: 'Programas de salud', descripcion: 'Programas de salud municipal', palabrasClave: ['prevencion', 'promocion', 'salud'], ruta: '/programas' },
    { titulo: 'Noticias y actividades', descripcion: 'Noticias y publicaciones', palabrasClave: ['actividades', 'comunicados', 'publicaciones'], ruta: '/noticias' },
    { titulo: 'Participación ciudadana', descripcion: 'Canales de participación', palabrasClave: ['comunidad', 'ciudadania', 'organizaciones'], ruta: '/participacion' },
    { titulo: 'Ingresar solicitud OIRS', descripcion: 'Ingreso de solicitudes ciudadanas', palabrasClave: ['reclamos', 'consultas', 'sugerencias', 'felicitaciones'], ruta: '/oirs' },
    { titulo: 'Encuesta de satisfacción', descripcion: 'Evaluación de la atención recibida', palabrasClave: ['encuesta', 'satisfaccion', 'opinion', 'evaluacion'], ruta: '/encuesta' },
  ]

  const normalizarTexto = (texto) => String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()

  const termino = normalizarTexto(busqueda)
  const resultadosBuscador = termino
    ? secciones.filter((seccion) => normalizarTexto([
      seccion.titulo,
      seccion.descripcion || '',
      ...(seccion.palabrasClave || []),
    ].join(' ')).includes(termino))
    : []

  useEffect(() => {
    const cerrarPorEscape = (evento) => {
      if (evento.key === 'Escape') {
        setSubmenuAbierto(null)
        setBuscadorAbierto(false)
        setMenuAbierto(false)
      }
    }

    const cerrarPorFuera = (evento) => {
      if (!evento.target.closest('.tiene-submenu')) setSubmenuAbierto(null)
      if (!evento.target.closest('.buscador-navegacion')) setBuscadorAbierto(false)
    }

    document.addEventListener('keydown', cerrarPorEscape)
    document.addEventListener('click', cerrarPorFuera)
    return () => {
      document.removeEventListener('keydown', cerrarPorEscape)
      document.removeEventListener('click', cerrarPorFuera)
    }
  }, [])

  return (
    <header className="encabezado">
      <div className="contenedor encabezado-contenido">
        <Link className="identidad" to="/" aria-label="Volver al inicio">
          <img className="logo-institucional" src="/logo-salud-encabezado.png" alt="Departamento de Salud Municipal de Padre Las Casas" />
        </Link>
        <Link className="boton-funcionarios" to="/acceso-funcionarios">
          <svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-user" /></svg>
          <span>Acceso funcionarios</span>
        </Link>
      </div>
      <nav className="navegacion" aria-label="Navegación principal">
        <div className="contenedor navegacion-contenido">
          <button className="boton-menu-movil" type="button" onClick={() => setMenuAbierto((actual) => !actual)} aria-controls="menu-principal" aria-expanded={menuAbierto}>
            ☰ <span>Menú</span>
          </button>
          <ul className={`menu ${menuAbierto ? 'menu-abierto' : ''}`} id="menu-principal">
            <li className="menu-item"><NavLink to="/" end>Inicio</NavLink></li>
            <li
              className={`menu-item tiene-submenu ${submenuAbierto === 'institucion' ? 'submenu-abierto' : ''}`}
              onMouseEnter={() => setSubmenuAbierto('institucion')}
              onMouseLeave={() => setSubmenuAbierto(null)}
            >
              <button className="menu-desplegable" type="button" aria-expanded={submenuAbierto === 'institucion'} onClick={() => setSubmenuAbierto((actual) => actual === 'institucion' ? null : 'institucion')}>
                Institución
                <span className="icono-flecha" aria-hidden="true">⌄</span>
              </button>
              <ul className="submenu">
                <li><NavLink to="/institucion" onClick={() => setSubmenuAbierto(null)}>Quiénes somos</NavLink></li>
                <li><NavLink to="/contacto" onClick={() => setSubmenuAbierto(null)}>Contacto</NavLink></li>
              </ul>
            </li>
            <li className="menu-item"><NavLink to="/establecimientos">Establecimientos</NavLink></li>
            <li
              className={`menu-item tiene-submenu ${submenuAbierto === 'prestaciones' ? 'submenu-abierto' : ''}`}
              onMouseEnter={() => setSubmenuAbierto('prestaciones')}
              onMouseLeave={() => setSubmenuAbierto(null)}
            >
              <button className="menu-desplegable" type="button" aria-expanded={submenuAbierto === 'prestaciones'} onClick={() => setSubmenuAbierto((actual) => actual === 'prestaciones' ? null : 'prestaciones')}>
                Prestaciones y programas
                <span className="icono-flecha" aria-hidden="true">⌄</span>
              </button>
              <ul className="submenu">
                <li><NavLink to="/prestaciones" onClick={() => setSubmenuAbierto(null)}>Prestaciones de salud</NavLink></li>
                <li><NavLink to="/programas" onClick={() => setSubmenuAbierto(null)}>Programas de salud</NavLink></li>
              </ul>
            </li>
            <li className="menu-item"><NavLink to="/noticias">Noticias y actividades</NavLink></li>
            <li
              className={`menu-item tiene-submenu ${submenuAbierto === 'participacion' ? 'submenu-abierto' : ''}`}
              onMouseEnter={() => setSubmenuAbierto('participacion')}
              onMouseLeave={() => setSubmenuAbierto(null)}
            >
              <button className="menu-desplegable" type="button" aria-expanded={submenuAbierto === 'participacion'} onClick={() => setSubmenuAbierto((actual) => actual === 'participacion' ? null : 'participacion')}>
                Participación ciudadana
                <span className="icono-flecha" aria-hidden="true">⌄</span>
              </button>
              <ul className="submenu">
                <li><NavLink to="/oirs" onClick={() => setSubmenuAbierto(null)}>Ingresar solicitud OIRS</NavLink></li>
                <li><NavLink to="/encuesta" onClick={() => setSubmenuAbierto(null)}>Encuesta de satisfacción</NavLink></li>
                <li><NavLink to="/participacion" onClick={() => setSubmenuAbierto(null)}>Canales de participación</NavLink></li>
              </ul>
            </li>
            <li className="menu-item"><NavLink to="/consulta-estado">Consultar estado</NavLink></li>
          </ul>
          <div className={`buscador-navegacion ${buscadorAbierto ? 'buscador-abierto' : ''}`}>
            <label className="buscador-campo" htmlFor="campo-busqueda">
              <svg className="icono" aria-hidden="true"><use href="/institutional-icons.svg#icon-search" /></svg>
              <input
                id="campo-busqueda"
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                onFocus={() => setBuscadorAbierto(true)}
                placeholder="Buscar en el sitio..."
                autoComplete="off"
                aria-controls="resultados-busqueda"
              />
            </label>
            {buscadorAbierto && (
              <div className="resultados-busqueda" id="resultados-busqueda" aria-live="polite">
                {busqueda && resultadosBuscador.length === 0 && <p>No se encontraron resultados.</p>}
                {busqueda && resultadosBuscador.map((resultado) => (
                  <button
                    type="button"
                    key={resultado.ruta}
                    onClick={() => {
                      navigate(resultado.ruta)
                      setBusqueda('')
                      setBuscadorAbierto(false)
                    }}
                  >
                    {resultado.titulo}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
