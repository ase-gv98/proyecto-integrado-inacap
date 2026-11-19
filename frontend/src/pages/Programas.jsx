function Programas() {
  return (
    <main>
      <section className="pagina-encabezado">
        <div className="contenedor">
          <div className="migas"><a href="/">Inicio</a><span>/</span><span>Prestaciones y programas</span><span>/</span><span>Programas</span></div>
          <span className="etiqueta">Atención integral</span>
          <h1>Programas de salud</h1>
          <p>Conoce los programas que forman parte de la información institucional de salud municipal, sus objetivos y las personas a quienes están dirigidos.</p>
        </div>
      </section>
      <section className="programas-seccion" id="seccion-programas">
        <div className="contenedor">
          <span className="etiqueta">Programas disponibles</span>
          <h2 className="programas-titulo">Explora nuestros programas</h2>
          <p className="programas-introduccion">Utiliza el buscador o selecciona un área de interés. Consulta la ficha de cada programa, sus objetivos y sus principales líneas de acción.</p>
          <div className="programas-herramientas">
            <div className="programas-busqueda"><label htmlFor="buscar-programa">Buscar programa de salud</label><input type="search" id="buscar-programa" placeholder="Ej.: adulto mayor, infancia, vida sana..." /></div>
            <div className="programas-filtros" role="group" aria-label="Filtrar programas de salud">
              <button type="button" className="programa-filtro activo">Todos</button>
              <button type="button" className="programa-filtro">Infancia y adolescencia</button>
              <button type="button" className="programa-filtro">Bienestar y prevención</button>
              <button type="button" className="programa-filtro">Personas mayores</button>
              <button type="button" className="programa-filtro">Atención domiciliaria</button>
            </div>
          </div>
          <p className="programas-nota">Las condiciones de ingreso, cupos y disponibilidad deben consultarse directamente con el establecimiento.</p>
        </div>
      </section>
    </main>
  )
}

export default Programas
