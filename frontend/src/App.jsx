import Navbar from './components/Navbar'
import SolicitudOIRSForm from './components/SolicitudOIRSForm'
import ConsultaEstado from './components/ConsultaEstado'
import LoginFuncionario from './components/LoginFuncionario'
import DashboardOIRS from './components/DashboardOIRS'
import Inicio from './pages/Inicio'
import Establecimientos from './pages/Establecimientos'
import Prestaciones from './pages/Prestaciones'
import EncuestaSatisfaccion from './pages/EncuestaSatisfaccion'
import Footer from './components/Footer'
import Institucion from './pages/Institucion'
import Contacto from './pages/Contacto'
import Programas from './pages/Programas'
import Noticias from './pages/Noticias'
import ParticipacionCiudadana from './pages/ParticipacionCiudadana'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('oirs_usuario')
    return stored ? JSON.parse(stored) : null
  })

  const handleLogin = (usuarioLogueado) => {
    setUsuario(usuarioLogueado)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('oirs_access_token')
    localStorage.removeItem('oirs_refresh_token')
    localStorage.removeItem('oirs_usuario')
    setUsuario(null)
    navigate('/')
  }

  return (
    <>
      <Navbar />
      <main id="inicio" className="portal-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/establecimientos" element={<Establecimientos />} />
          <Route path="/prestaciones" element={<Prestaciones />} />
          <Route path="/participacion-ciudadana" element={<SolicitudOIRSForm />} />
          <Route path="/oirs" element={<SolicitudOIRSForm />} />
          <Route path="/consulta-estado" element={<ConsultaEstado />} />
          <Route path="/encuesta-satisfaccion" element={<EncuestaSatisfaccion />} />
          <Route path="/encuesta" element={<EncuestaSatisfaccion />} />
          <Route path="/institucion" element={<Institucion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/participacion" element={<ParticipacionCiudadana />} />
          <Route
            path="/acceso-funcionarios"
            element={
              localStorage.getItem('oirs_access_token')
                ? <Navigate to="/dashboard" replace />
                : <LoginFuncionario onLogin={handleLogin} />
            }
          />
          <Route
            path="/dashboard"
            element={
              localStorage.getItem('oirs_access_token')
                ? <DashboardOIRS usuario={usuario || { nombre: 'Funcionario OIRS' }} onLogout={handleLogout} />
                : <Navigate to="/acceso-funcionarios" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
