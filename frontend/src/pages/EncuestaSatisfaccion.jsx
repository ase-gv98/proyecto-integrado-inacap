import { useState } from 'react'

const niveles = [
  { value: 1, label: 'Muy malo', clase: 'nivel-1', path: 'M20 46 Q32 29 44 46' },
  { value: 2, label: 'Malo', clase: 'nivel-2', path: 'M21 43 Q32 34 43 43' },
  { value: 3, label: 'Regular', clase: 'nivel-3', path: 'M22 40 H42' },
  { value: 4, label: 'Bueno', clase: 'nivel-4', path: 'M21 37 Q32 47 43 37' },
  { value: 5, label: 'Muy bueno', clase: 'nivel-5', path: 'M19 35 Q32 54 45 35' },
]

const preguntas = [
  { id: 'trato', title: '¿Cómo evalúas el trato recibido?' },
  { id: 'tiempoEspera', title: '¿Cómo evalúas el tiempo de espera?' },
  { id: 'claridad', title: '¿Qué tan clara fue la información entregada?' },
  { id: 'satisfaccionGeneral', title: '¿Cómo evalúas tu satisfacción general?' },
]

const establecimientos = [
  'CESFAM Padre Las Casas',
  'CESFAM Las Colinas',
  'CESFAM Pulmahue',
  'CESFAM Conunhuenu',
  'Posta Codopille',
  'Posta Laurel Huacho',
  'Posta Metrenco',
  'Posta San Ramón',
  'Posta Roble Huacho',
  'Posta Truf Truf',
  'Centro Comunitario de Rehabilitación',
  'Programa de Atención Domiciliaria',
]

function Cara({ path }) {
  return (
    <svg className="encuesta-carita" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="27" />
      <circle cx="23" cy="25" r="2.5" className="cara-ojo" />
      <circle cx="41" cy="25" r="2.5" className="cara-ojo" />
      <path d={path} />
    </svg>
  )
}

function EncuestaSatisfaccion() {
  const [establecimiento, setEstablecimiento] = useState('')
  const [respuestas, setRespuestas] = useState({})
  const [comentarios, setComentarios] = useState('')
  const [error, setError] = useState('')
  const [confirmada, setConfirmada] = useState(false)

  const limpiar = () => {
    setEstablecimiento('')
    setRespuestas({})
    setComentarios('')
    setError('')
  }

  const enviar = (event) => {
    event.preventDefault()
    if (!establecimiento) {
      setError('Debes seleccionar un establecimiento de salud.')
      return
    }
    if (preguntas.some(({ id }) => !respuestas[id])) {
      setError('Debes responder las cuatro preguntas obligatorias de evaluación.')
      return
    }
    if (comentarios.length > 1000) {
      setError('Los comentarios no pueden superar los 1000 caracteres.')
      return
    }
    if (/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|(?:\+?56[\s.-]?)?9[\s.-]?\d{4}[\s.-]?\d{4}|\d{1,2}\.\d{3}\.\d{3}-[\dkK]/i.test(comentarios)) {
      setError('Por seguridad, elimina los correos, teléfonos o RUT de tus comentarios. Esta encuesta debe ser anónima.')
      return
    }

    const registro = {
      establecimiento,
      trato: respuestas.trato,
      tiempoEspera: respuestas.tiempoEspera,
      claridad: respuestas.claridad,
      satisfaccionGeneral: respuestas.satisfaccionGeneral,
      comentarios: comentarios.trim(),
      fechaRegistro: new Date().toISOString(),
    }

    try {
      const contenido = localStorage.getItem('plc_encuestas_demo_v1')
      const encuestas = contenido ? JSON.parse(contenido) : []
      if (!Array.isArray(encuestas)) throw new Error('Formato inválido')
      encuestas.push(registro)
      localStorage.setItem('plc_encuestas_demo_v1', JSON.stringify(encuestas))
    } catch {
      setError('No fue posible guardar la encuesta. Los registros anteriores no se han modificado.')
      return
    }

    setError('')
    setConfirmada(true)
  }

  if (confirmada) {
    return (
      <section className="encuesta-seccion" id="seccion-confirmacion-encuesta">
        <div className="contenedor encuesta-confirmacion">
          <div className="encuesta-confirmacion-icono">✓</div>
          <h2>¡Gracias por tu opinión!</h2>
          <p>Tu evaluación fue registrada de forma anónima y ayudará a mejorar la atención de salud municipal.</p>
          <div className="encuesta-acciones">
            <button type="button" className="encuesta-boton" onClick={() => { setConfirmada(false); limpiar(); }}>Responder otra encuesta</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <main>
      <section className="encuesta-encabezado">
        <div className="contenedor">
          <div className="encuesta-migas">
            <a href="/">Inicio</a><span>/</span><a href="/participacion-ciudadana">Participación ciudadana</a><span>/</span><span>Encuesta de satisfacción</span>
          </div>
          <span className="etiqueta">Tu opinión importa</span>
          <h1>Encuesta de satisfacción</h1>
          <p>Comparte tu experiencia con la atención recibida en la red de salud municipal. Esta encuesta es anónima y no requiere iniciar sesión.</p>
        </div>
      </section>

      <section className="encuesta-seccion" id="seccion-encuesta">
        <div className="contenedor encuesta-distribucion">
          <div className="encuesta-panel">
            <h2>Cuéntanos tu experiencia</h2>
            <p className="encuesta-introduccion">Selecciona el establecimiento donde recibiste atención y responde las siguientes preguntas. Los campos marcados con (*) son obligatorios.</p>
            <form onSubmit={enviar}>
              <div className="encuesta-bloque">
                <h3>1. Información de la atención</h3>
                <div className="encuesta-campo">
                  <label htmlFor="encuesta-establecimiento">Establecimiento de salud <span className="encuesta-obligatorio">*</span></label>
                  <select id="encuesta-establecimiento" name="establecimiento" value={establecimiento} onChange={(event) => setEstablecimiento(event.target.value)} required>
                    <option value="">Seleccionar establecimiento</option>
                    {establecimientos.map((nombre) => <option value={nombre} key={nombre}>{nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="encuesta-bloque">
                <h3>2. Evaluación de la atención</h3>
                {preguntas.map((pregunta) => (
                  <div className="encuesta-campo" key={pregunta.id}>
                    <span className="encuesta-pregunta" id={`pregunta-${pregunta.id}`}>{pregunta.title} <span className="encuesta-obligatorio">*</span></span>
                    <div className="encuesta-opciones" role="radiogroup" aria-labelledby={`pregunta-${pregunta.id}`}>
                      {niveles.map((nivel) => (
                        <label className={`encuesta-opcion ${nivel.clase}`} key={nivel.value}>
                          <input type="radio" name={pregunta.id} value={nivel.value} checked={respuestas[pregunta.id] === nivel.value} onChange={() => setRespuestas((actual) => ({ ...actual, [pregunta.id]: nivel.value }))} required />
                          <Cara path={nivel.path} />
                          <span>{nivel.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="encuesta-bloque">
                <h3>3. Comentarios adicionales</h3>
                <div className="encuesta-campo">
                  <label htmlFor="encuesta-comentarios">¿Deseas agregar algún comentario? <span className="encuesta-ayuda">(máximo 1000 caracteres)</span></label>
                  <textarea id="encuesta-comentarios" name="comentarios" maxLength="1000" value={comentarios} onChange={(event) => setComentarios(event.target.value)} placeholder="Escribe aquí tu comentario..." />
                </div>
              </div>

              {error && <div className="encuesta-error" role="alert">{error}</div>}
              <div className="encuesta-acciones">
                <button type="submit" className="encuesta-boton">Enviar encuesta</button>
                <button type="button" className="encuesta-boton secundario" onClick={limpiar}>Limpiar formulario</button>
              </div>
            </form>
          </div>

          <aside className="encuesta-lateral">
            <div className="encuesta-info">
              <h3>Encuesta anónima</h3>
              <p>Sus respuestas son confidenciales y no requieren iniciar sesión.</p>
            </div>
            <div className="encuesta-info">
              <h3>Qué evaluamos</h3>
              <ul>
                <li>Trato recibido</li>
                <li>Tiempo de espera</li>
                <li>Información entregada</li>
                <li>Satisfacción general</li>
              </ul>
            </div>
            <div className="encuesta-aviso"><strong>Prototipo académico</strong>Los datos se almacenan únicamente en el navegador mediante localStorage.</div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default EncuestaSatisfaccion
