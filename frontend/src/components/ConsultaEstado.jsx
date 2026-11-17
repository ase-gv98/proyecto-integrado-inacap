import { useState } from 'react'
import axios from 'axios'

const estadoBadges = {
  Ingresado: 'bg-primary',
  Derivado: 'bg-info text-dark',
  'En Proceso': 'bg-warning text-dark',
  Cerrado: 'bg-success',
}

function formatDate(value) {
  if (!value) return 'No disponible'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function ConsultaEstado() {
  const [folio, setFolio] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [searching, setSearching] = useState(false)

  const consultarEstado = async (event) => {
    event.preventDefault()

    const folioNormalizado = folio.trim().toUpperCase()
    setResultado(null)
    setError('')

    if (!folioNormalizado) {
      setError('Ingrese el número de folio de su solicitud.')
      return
    }

    setSearching(true)
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/solicitudes-publicas/estado/${encodeURIComponent(folioNormalizado)}/`,
      )
      setResultado(response.data)
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setError('No se encontró una solicitud con ese folio.')
      } else if (requestError.response?.data?.detail) {
        setError(requestError.response.data.detail)
      } else {
        setError('No fue posible consultar el estado. Intente nuevamente.')
      }
    } finally {
      setSearching(false)
    }
  }

  const badgeClass = resultado
    ? estadoBadges[resultado.estado] || 'bg-secondary'
    : 'bg-secondary'

  return (
    <section id="consulta-estado" className="consulta-estado-section">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="text-center mb-4">
              <p className="oirs-eyebrow">Seguimiento ciudadano</p>
              <h2 className="consulta-title">Consultar estado de solicitud</h2>
              <p className="text-secondary">Ingrese el folio entregado al enviar su solicitud</p>
            </div>

            <div className="card consulta-card mb-4">
              <div className="card-body p-4">
                <form onSubmit={consultarEstado} noValidate>
                  <label className="form-label fw-semibold" htmlFor="folio-consulta">
                    Número de folio
                  </label>
                  <div className="input-group consulta-input">
                    <input
                      id="folio-consulta"
                      type="text"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      value={folio}
                      onChange={(event) => {
                        setFolio(event.target.value)
                        setError('')
                      }}
                      placeholder="Ej. OIRS-2026-0001"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="btn consulta-submit"
                      disabled={searching}
                    >
                      {searching ? 'Consultando...' : 'Consultar Estado'}
                    </button>
                  </div>
                  {error && <div className="invalid-feedback d-block">{error}</div>}
                </form>
              </div>
            </div>

            {resultado && (
              <div className="card consulta-result-card" role="status" aria-live="polite">
                <div className="card-header consulta-result-header">
                  <div>
                    <span className="result-label">Folio consultado</span>
                    <strong className="result-folio">{resultado.folio}</strong>
                  </div>
                  <span className={`badge rounded-pill ${badgeClass} result-badge`}>
                    {resultado.estado}
                  </span>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="result-item">
                        <span>Tipo de solicitud</span>
                        <strong>{resultado.tipo_solicitud}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="result-item">
                        <span>Estado actual</span>
                        <strong>
                          <span className={`badge rounded-pill ${badgeClass}`}>
                            {resultado.estado}
                          </span>
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="result-item">
                        <span>Fecha de ingreso</span>
                        <strong>{formatDate(resultado.fecha_ingreso)}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="result-item">
                        <span>Plazo límite de respuesta</span>
                        <strong>{formatDate(resultado.plazo_respuesta)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConsultaEstado
