import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const estadoBadge = {
  Ingresado: 'bg-primary',
  Derivado: 'bg-info text-dark',
  'En Proceso': 'bg-warning text-dark',
  Respondido: 'bg-secondary',
  Cerrado: 'bg-success',
}

function formatDate(value) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function DashboardOIRS({ usuario, onLogout }) {
  const [solicitudes, setSolicitudes] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [estado, setEstado] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [solicitudGestion, setSolicitudGestion] = useState(null)
  const [departamentoGestion, setDepartamentoGestion] = useState('')
  const [estadoGestion, setEstadoGestion] = useState('Ingresado')
  const [saving, setSaving] = useState(false)
  const [managementError, setManagementError] = useState('')

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('oirs_access_token')}`,
  })

  useEffect(() => {
    const loadSolicitudes = async () => {
      setLoading(true)
      setError('')
      try {
        const accessToken = localStorage.getItem('oirs_access_token')
        const response = await axios.get(
          'http://127.0.0.1:8000/api/solicitudes/',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        setSolicitudes(response.data.results || response.data)
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          setError('La sesión expiró. Inicie sesión nuevamente.')
        } else {
          setError('No fue posible cargar las solicitudes asignadas.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadSolicitudes()
  }, [])

  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/departamentos/',
          { headers: getAuthHeaders() },
        )
        setDepartamentos(response.data.results || response.data)
      } catch {
        setDepartamentos([])
      }
    }

    loadDepartamentos()
  }, [])

  const abrirGestion = (solicitud) => {
    setSolicitudGestion(solicitud)
    setDepartamentoGestion(String(solicitud.id_departamento || ''))
    setEstadoGestion(solicitud.estado_actual || 'Ingresado')
    setManagementError('')
  }

  const guardarGestion = async () => {
    if (!solicitudGestion) return

    setSaving(true)
    setManagementError('')
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudGestion.id_solicitud}/`,
        { id_departamento: Number(departamentoGestion) },
        { headers: getAuthHeaders() },
      )

      await axios.post(
        'http://127.0.0.1:8000/api/estados/',
        {
          id_solicitud: solicitudGestion.id_solicitud,
          nombre_estado: estadoGestion,
        },
        { headers: getAuthHeaders() },
      )

      setSolicitudes((actuales) =>
        actuales.map((solicitud) =>
          solicitud.id_solicitud === solicitudGestion.id_solicitud
            ? {
                ...solicitud,
                id_departamento: Number(departamentoGestion),
                estado_actual: estadoGestion,
              }
            : solicitud,
        ),
      )

      const modalElement = document.getElementById('gestionSolicitudModal')
      const modal = window.bootstrap?.Modal.getInstance(modalElement)
      modal?.hide()
    } catch (requestError) {
      setManagementError(
        requestError.response?.data?.detail ||
        'No fue posible guardar los cambios de la solicitud.',
      )
    } finally {
      setSaving(false)
    }
  }

  const solicitudesFiltradas = useMemo(() => {
    if (estado === 'Todos') return solicitudes
    return solicitudes.filter((solicitud) => {
      return (solicitud.estado_actual || 'Ingresado') === estado
    })
  }, [estado, solicitudes])

  return (
    <section className="dashboard-section">
      <div className="container-fluid px-lg-4 px-xl-5 py-4">
        <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-md-items-center mb-4">
          <div>
            <p className="dashboard-eyebrow">Panel interno OIRS</p>
            <h1>Solicitudes asignadas</h1>
            <p className="mb-0 text-secondary">{usuario.nombre}</p>
          </div>
          <button type="button" className="btn logout-btn mt-3 mt-md-0" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>

        <div className="card dashboard-card">
          <div className="card-header dashboard-toolbar d-flex flex-column flex-sm-row justify-content-between align-sm-items-center">
            <strong>Listado de solicitudes</strong>
            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
              <label className="form-label mb-0 fw-semibold" htmlFor="estado-filtro">
                Estado
              </label>
              <select
                id="estado-filtro"
                className="form-select estado-filter"
                value={estado}
                onChange={(event) => setEstado(event.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Ingresado">Ingresado</option>
                <option value="Derivado">Derivado</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Respondido">Respondido</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
          </div>
          <div className="card-body p-0">
            {loading && <div className="p-4 text-center text-secondary">Cargando solicitudes...</div>}
            {error && <div className="alert alert-danger m-3">{error}</div>}

            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 dashboard-table">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Tipo</th>
                      <th>Fecha ingreso</th>
                      <th>Plazo respuesta</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudesFiltradas.map((solicitud) => {
                      const estadoActual = solicitud.estado_actual || 'Ingresado'
                      return (
                        <tr key={solicitud.id_solicitud}>
                          <td><strong className="folio-table">{solicitud.folio}</strong></td>
                          <td>{solicitud.tipo_solicitud}</td>
                          <td>{formatDate(solicitud.fecha_ingreso)}</td>
                          <td>{formatDate(solicitud.plazo_respuesta)}</td>
                          <td>
                            <span className={`badge rounded-pill ${estadoBadge[estadoActual] || 'bg-secondary'}`}>
                              {estadoActual}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm manage-request-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#gestionSolicitudModal"
                              onClick={() => abrirGestion(solicitud)}
                            >
                              Ver / Gestionar
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {solicitudesFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-secondary py-4">
                          No existen solicitudes con el estado seleccionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {solicitudGestion && (
        <div
          className="modal fade"
          id="gestionSolicitudModal"
          tabIndex="-1"
          aria-labelledby="gestionSolicitudModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <span className="modal-kicker">Gestión de solicitud</span>
                  <h2 className="modal-title fs-5" id="gestionSolicitudModalLabel">
                    {solicitudGestion.folio}
                  </h2>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                {managementError && (
                  <div className="alert alert-danger">{managementError}</div>
                )}

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="management-detail">
                      <span>Tipo de solicitud</span>
                      <strong>{solicitudGestion.tipo_solicitud}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="management-detail">
                      <span>Estado actual</span>
                      <strong>{solicitudGestion.estado_actual || 'Ingresado'}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="management-detail">
                      <span>Fecha de ingreso</span>
                      <strong>{formatDate(solicitudGestion.fecha_ingreso)}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="management-detail">
                      <span>Plazo de respuesta</span>
                      <strong>{formatDate(solicitudGestion.plazo_respuesta)}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="management-detail">
                      <span>Correo de contacto</span>
                      <strong>{solicitudGestion.correo || 'No informado'}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="management-detail">
                      <span>Teléfono de contacto</span>
                      <strong>{solicitudGestion.telefono || 'No informado'}</strong>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="management-detail">
                      <span>Descripción del ciudadano</span>
                      <p>{solicitudGestion.descripcion}</p>
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="departamento-gestion">
                      Derivar a departamento
                    </label>
                    <select
                      id="departamento-gestion"
                      className="form-select"
                      value={departamentoGestion}
                      onChange={(event) => setDepartamentoGestion(event.target.value)}
                    >
                      <option value="">Seleccione un departamento</option>
                      {departamentos.map((departamento) => (
                        <option
                          value={departamento.id_departamento}
                          key={departamento.id_departamento}
                        >
                          {departamento.nombre_depto}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="estado-gestion">
                      Cambiar estado
                    </label>
                    <select
                      id="estado-gestion"
                      className="form-select"
                      value={estadoGestion}
                      onChange={(event) => setEstadoGestion(event.target.value)}
                    >
                      <option value="Ingresado">Ingresado</option>
                      <option value="Derivado">Derivado</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Respondido">Respondido</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn manage-save-btn"
                  onClick={guardarGestion}
                  disabled={saving || !departamentoGestion}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default DashboardOIRS
