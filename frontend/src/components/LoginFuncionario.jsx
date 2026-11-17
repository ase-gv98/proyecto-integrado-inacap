import { useState } from 'react'
import axios from 'axios'

function LoginFuncionario({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password) {
      setError('Ingrese su usuario y contraseña.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/token/',
        form,
      )
      localStorage.setItem('oirs_access_token', response.data.access)
      localStorage.setItem('oirs_refresh_token', response.data.refresh)
      localStorage.setItem(
        'oirs_usuario',
        JSON.stringify(response.data.usuario),
      )
      onLogin(response.data.usuario)
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        'No fue posible iniciar sesión. Verifique su usuario y contraseña.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-section">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-7 col-lg-5">
            <div className="card login-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="login-icon">OIRS</div>
                  <h1 className="login-title">Acceso funcionarios</h1>
                  <p className="text-secondary mb-0">Departamento de Salud Municipal</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="username-login">
                      Usuario
                    </label>
                    <input
                      id="username-login"
                      name="username"
                      type="text"
                      className="form-control"
                      value={form.username}
                      onChange={updateField}
                      placeholder="Ingrese su nombre de usuario"
                      autoComplete="username"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="password-login">
                      Contraseña
                    </label>
                    <input
                      id="password-login"
                      name="password"
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={updateField}
                      placeholder="Ingrese su contraseña"
                      autoComplete="current-password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn login-submit w-100"
                    disabled={loading}
                  >
                    {loading ? 'Ingresando...' : 'Iniciar sesión'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginFuncionario
