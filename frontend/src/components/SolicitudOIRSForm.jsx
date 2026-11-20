import { useState } from 'react'
import axios from 'axios'
import API_URL from '../services/apiConfig'

const tiposSolicitud = [
  { value: 'Reclamo', label: 'Reclamo', icon: '!', description: 'Inconformidad con un servicio' },
  { value: 'Sugerencia', label: 'Sugerencia', icon: '+', description: 'Propuesta de mejora' },
  { value: 'Consulta', label: 'Consulta', icon: '?', description: 'Solicitud de información' },
  { value: 'Felicitación', label: 'Felicitación', icon: '★', description: 'Reconocimiento recibido' },
]

const establecimientos = [
  'CESFAM Barroso',
  'CESFAM Pulmahue',
  'CESFAM La Colina',
  'CESFAM Conunhueno',
  'Centro de Salud Familiar Labranza',
  'Posta Rural',
]

const initialForm = {
  tipo_solicitud: '',
  establecimiento: '',
  nombre: '',
  rut: '',
  correo: '',
  telefono: '',
  descripcion: '',
}

function SolicitudOIRSForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [folio, setFolio] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.tipo_solicitud) nextErrors.tipo_solicitud = 'Seleccione el tipo de solicitud.'
    if (!form.establecimiento) nextErrors.establecimiento = 'Seleccione un establecimiento.'
    if (!form.nombre.trim()) nextErrors.nombre = 'Ingrese su nombre.'
    if (!/^\d{7,8}-[\dKk]$/.test(form.rut)) {
      nextErrors.rut = 'Ingrese el RUT con formato 12345678-9.'
    }
    if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(form.correo)) {
      nextErrors.correo = 'Ingrese un correo electrónico válido.'
    }
    if (!/^\+569\d{8}$/.test(form.telefono)) {
      nextErrors.telefono = 'Use el formato chileno +569XXXXXXXX.'
    }
    if (!form.descripcion.trim()) nextErrors.descripcion = 'Ingrese el detalle de su solicitud.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFolio('')
    setSubmitError('')

    if (!validate()) return

    setSubmitting(true)
    try {
      const response = await axios.post(
        `${API_URL}/api/solicitudes-publicas/`,
        form,
      )
      setFolio(response.data.folio)
      setForm(initialForm)
    } catch (error) {
      if (error.response?.data) {
        const apiErrors = error.response.data
        if (typeof apiErrors === 'object') {
          setErrors(apiErrors)
          setSubmitError(apiErrors.detail || 'Revise los datos ingresados.')
        } else {
          setSubmitError(apiErrors)
        }
      } else {
        setSubmitError('No fue posible conectar con el sistema OIRS. Intente nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="oirs-form-page">
      <div className="container py-4 py-lg-5">
        <div className="text-center mb-4">
          <p className="oirs-eyebrow">Departamento de Salud Municipal</p>
          <h1 className="oirs-title">Solicitud Ciudadana OIRS</h1>
          <p className="text-secondary">Complete los datos para ingresar su solicitud</p>
        </div>

        {folio && (
          <div className="alert alert-success folio-alert text-center" role="alert">
            <strong>Solicitud enviada correctamente.</strong>
            <span className="d-block mt-1">Guarde su número de folio:</span>
            <span className="folio-number">{folio}</span>
          </div>
        )}

        {submitError && (
          <div className="alert alert-danger" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="card oirs-card mb-4">
            <div className="card-header oirs-card-header">
              <span className="step-number">1</span>
              <div>
                <h2>Tipo de solicitud</h2>
                <p>Seleccione la categoría que mejor representa su requerimiento</p>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {tiposSolicitud.map((tipo) => (
                  <div className="col-6 col-lg-3" key={tipo.value}>
                    <label className={`type-option ${form.tipo_solicitud === tipo.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="tipo_solicitud"
                        value={tipo.value}
                        checked={form.tipo_solicitud === tipo.value}
                        onChange={updateField}
                      />
                      <span className="type-icon" aria-hidden="true">{tipo.icon}</span>
                      <strong>{tipo.label}</strong>
                      <small>{tipo.description}</small>
                    </label>
                  </div>
                ))}
              </div>
              {errors.tipo_solicitud && <div className="invalid-feedback d-block mt-2">{errors.tipo_solicitud}</div>}
            </div>
          </div>

          <div className="card oirs-card mb-4">
            <div className="card-header oirs-card-header">
              <span className="step-number">2</span>
              <div>
                <h2>Establecimiento</h2>
                <p>Seleccione el centro de salud relacionado</p>
              </div>
            </div>
            <div className="card-body">
              <label className="form-label fw-semibold" htmlFor="establecimiento">Establecimiento de salud</label>
              <select
                id="establecimiento"
                name="establecimiento"
                className={`form-select ${errors.establecimiento ? 'is-invalid' : ''}`}
                value={form.establecimiento}
                onChange={updateField}
              >
                <option value="">Seleccione un establecimiento</option>
                {establecimientos.map((establecimiento) => (
                  <option value={establecimiento} key={establecimiento}>{establecimiento}</option>
                ))}
              </select>
              {errors.establecimiento && <div className="invalid-feedback">{errors.establecimiento}</div>}
            </div>
          </div>

          <div className="card oirs-card mb-4">
            <div className="card-header oirs-card-header">
              <span className="step-number">3</span>
              <div>
                <h2>Datos de contacto</h2>
                <p>Información para la identificación y respuesta</p>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="nombre">Nombre completo</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={form.nombre}
                    onChange={updateField}
                    placeholder="Ej. Juan Pérez"
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="rut">RUT</label>
                  <input
                    id="rut"
                    name="rut"
                    type="text"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    value={form.rut}
                    onChange={updateField}
                    placeholder="12345678-9"
                    maxLength="12"
                  />
                  {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="correo">Correo electrónico</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                    value={form.correo}
                    onChange={updateField}
                    placeholder="nombre@correo.cl"
                  />
                  {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    value={form.telefono}
                    onChange={updateField}
                    placeholder="+56912345678"
                    maxLength="12"
                  />
                  {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="card oirs-card mb-4">
            <div className="card-header oirs-card-header">
              <span className="step-number">4</span>
              <div>
                <h2>Detalle de su solicitud</h2>
                <p>Describa claramente su requerimiento</p>
              </div>
            </div>
            <div className="card-body">
              <label className="form-label fw-semibold" htmlFor="descripcion">Mensaje</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                value={form.descripcion}
                onChange={updateField}
                rows="5"
                placeholder="Escriba aquí los detalles de su solicitud..."
              ></textarea>
              {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
            </div>
          </div>

          <div className="d-grid d-md-flex justify-content-md-end">
            <button type="submit" className="btn submit-oirs-btn" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SolicitudOIRSForm
