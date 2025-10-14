"use client"

import { useState, useEffect } from "react"
import DistributionCanvas from "./components/DistributionCanvas"
import ConvergenceChart from "./components/ConvergenceChart"
import "./App.css"

const API_URL = "http://localhost:5000"

function App() {
  const [catalogo, setCatalogo] = useState([])
  const [articulosSeleccionados, setArticulosSeleccionados] = useState({})
  const [parametros, setParametros] = useState({
    tamPoblacion: 100,
    numGeneraciones: 50,
    probCruce: 0.6,
    probMutacion: 0.15,
    tipoSeleccion: "torneo",
    torneoK: 3,
    elitismo: 2,
    semilla: 42,
  })
  const [resultado, setResultado] = useState(null)
  const [ejecutando, setEjecutando] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("configuracion")

  useEffect(() => {
    cargarCatalogo()
  }, [])

  const cargarCatalogo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/catalogo`)
      const data = await response.json()
      console.log("Catálogo cargado:", data);

      const catalogoConCosto = data.map((item) => ({
        ...item,
        costo: item.costo || 0,
      }))

      setCatalogo(catalogoConCosto)

      const seleccionados = {}
      catalogoConCosto.forEach((item) => {
        seleccionados[item.id || item._id] = true
      })
      setArticulosSeleccionados(seleccionados)
    } catch (err) {
      setError("Error al cargar el catálogo: " + err.message)
    }
  }

  const handleCheckboxChange = (id) => {
    setArticulosSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleArticuloChange = (id, campo, valor) => {
    setCatalogo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [campo]: Number.parseFloat(valor) || 0 } : item)),
    )
  }

  const handleParametroChange = (campo, valor) => {
    setParametros((prev) => ({
      ...prev,
      [campo]: campo === "tipoSeleccion" ? valor : Number.parseFloat(valor) || 0,
    }))
  }

  const ejecutarAlgoritmo = async () => {
    setEjecutando(true)
    setError(null)

    try {
      const catalogoFiltrado = catalogo.filter((item) => articulosSeleccionados[item.id])

      if (catalogoFiltrado.length === 0) {
        throw new Error("Debe seleccionar al menos un artículo")
      }

      const response = await fetch(`${API_URL}/api/ejecutar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          catalogo: catalogoFiltrado,
          ...parametros,
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la ejecución del algoritmo")
      }

      const data = await response.json()
      setResultado(data)
      setActiveTab("resultados")
    } catch (err) {
      setError("Error: " + err.message)
    } finally {
      setEjecutando(false)
    }
  }

  const descargarResultados = () => {
    if (!resultado) return

    const dataStr = JSON.stringify(resultado, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "resultados_ejemplo.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L10.5 5.5L16 8L10.5 10.5L8 16L5.5 10.5L0 8L5.5 5.5L8 0Z" fill="currentColor" />
            </svg>
            <span>Machine Learning</span>
          </div>
          <h1>Optimización de Área con Algoritmos Genéticos</h1>
          <p>Maximización de rentabilidad en 50 m² usando Machine Learning</p>
        </div>
      </header>

      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "configuracion" ? "active" : ""}`}
          onClick={() => setActiveTab("configuracion")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
          </svg>
          <span>Configuración</span>
        </button>
        <button
          className={`tab ${activeTab === "resultados" ? "active" : ""}`}
          onClick={() => setActiveTab("resultados")}
          disabled={!resultado}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          <span>Resultados</span>
          {resultado && <span className="tab-badge">✓</span>}
        </button>
        <button
          className={`tab ${activeTab === "visualizacion" ? "active" : ""}`}
          onClick={() => setActiveTab("visualizacion")}
          disabled={!resultado}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
          </svg>
          <span>Visualización</span>
          {resultado && <span className="tab-badge">✓</span>}
        </button>
      </div>

      <div className="container">
        {activeTab === "configuracion" && (
          <div className="config-layout">
            <div className="config-column">
              <section className="section section-catalog">
                <div className="section-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <h2>Catálogo de Artículos</h2>
                <p className="section-subtitle">Selecciona y configura los electrodomésticos</p>

                <div className="articulos-list">
                  {catalogo.map((item) => (
                    <div
                      key={item.id || item._id}
                      className={`articulo-item ${!articulosSeleccionados[item.id] ? "disabled" : ""}`}
                    >
                      <div className="articulo-header">
                        <input
                          type="checkbox"
                          checked={articulosSeleccionados[item.id || item._id] || false}
                          onChange={() => handleCheckboxChange(item.id || item._id)}
                          className="checkbox"
                          id={`check-${item.id || item._id}`}
                        />
                        <label htmlFor={`check-${item.id}`} className="articulo-nombre">
                          {item.nombre}
                        </label>
                        {articulosSeleccionados[item.id] && <span className="badge badge-active">Activo</span>}
                      </div>
                      <div className="articulo-fields">
                        <div className="field">
                          <label className="field-label">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                            </svg>
                            Área (m²)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.area}
                            onChange={(e) => handleArticuloChange(item.id, "area", e.target.value)}
                            disabled={!articulosSeleccionados[item.id]}
                            className="input"
                          />
                        </div>
                        <div className="field">
                          <label className="field-label">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                              <path d="M12 18V6" />
                            </svg>
                            Costo ($)
                          </label>
                          <input
                            type="number"
                            value={item.costo || 0}
                            onChange={(e) => handleArticuloChange(item.id, "costo", e.target.value)}
                            disabled={!articulosSeleccionados[item.id]}
                            className="input"
                          />
                        </div>
                        <div className="field">
                          <label className="field-label">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="12" y1="1" x2="12" y2="23" />
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              <path d="M12 18V6" />
                            </svg>
                            Ganancia ($)
                          </label>
                          <input
                            type="number"
                            value={item.ganancia}
                            onChange={(e) => handleArticuloChange(item.id, "ganancia", e.target.value)}
                            disabled={!articulosSeleccionados[item.id]}
                            className="input"
                          />
                        </div>
                        <div className="field">
                          <label className="field-label">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            Stock
                          </label>
                          <input
                            type="number"
                            value={item.stock}
                            onChange={(e) => handleArticuloChange(item.id, "stock", e.target.value)}
                            disabled={!articulosSeleccionados[item.id]}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="config-column">
              <section className="section section-params">
                <div className="section-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <h2>Parámetros del Algoritmo Genético</h2>
                <p className="section-subtitle">Ajusta los parámetros de evolución</p>

                <div className="parametros-list">
                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Tamaño de Población
                      </span>
                      <span className="parametro-value">{parametros.tamPoblacion}</span>
                    </label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={parametros.tamPoblacion}
                        onChange={(e) => handleParametroChange("tamPoblacion", e.target.value)}
                        className="slider"
                      />
                      <div
                        className="slider-track"
                        style={{ width: `${((parametros.tamPoblacion - 10) / 490) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                          <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                        Número de Generaciones
                      </span>
                      <span className="parametro-value">{parametros.numGeneraciones}</span>
                    </label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={parametros.numGeneraciones}
                        onChange={(e) => handleParametroChange("numGeneraciones", e.target.value)}
                        className="slider"
                      />
                      <div
                        className="slider-track"
                        style={{ width: `${((parametros.numGeneraciones - 10) / 190) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2v20M2 12h20" />
                        </svg>
                        Tasa de Cruce (Pc)
                      </span>
                      <span className="parametro-value">{parametros.probCruce.toFixed(2)}</span>
                    </label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={parametros.probCruce}
                        onChange={(e) => handleParametroChange("probCruce", e.target.value)}
                        className="slider"
                      />
                      <div className="slider-track" style={{ width: `${parametros.probCruce * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        Tasa de Mutación (Pm)
                      </span>
                      <span className="parametro-value">{parametros.probMutacion.toFixed(2)}</span>
                    </label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={parametros.probMutacion}
                        onChange={(e) => handleParametroChange("probMutacion", e.target.value)}
                        className="slider"
                      />
                      <div className="slider-track" style={{ width: `${parametros.probMutacion * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Tipo de Selección
                      </span>
                    </label>
                    <select
                      value={parametros.tipoSeleccion}
                      onChange={(e) => handleParametroChange("tipoSeleccion", e.target.value)}
                      className="select"
                    >
                      <option value="torneo">Torneo</option>
                      <option value="ruleta">Ruleta</option>
                    </select>
                  </div>

                  {parametros.tipoSeleccion === "torneo" && (
                    <div className="parametro-item">
                      <label className="parametro-label">
                        <span className="parametro-name">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                          </svg>
                          Tipo del Torneo (k)
                        </span>
                        <span className="parametro-value">{parametros.torneoK}</span>
                      </label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="2"
                          max="10"
                          step="1"
                          value={parametros.torneoK}
                          onChange={(e) => handleParametroChange("torneoK", e.target.value)}
                          className="slider"
                        />
                        <div
                          className="slider-track"
                          style={{ width: `${((parametros.torneoK - 2) / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Elitismo
                      </span>
                      <span className="parametro-value">{parametros.elitismo}</span>
                    </label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={parametros.elitismo}
                        onChange={(e) => handleParametroChange("elitismo", e.target.value)}
                        className="slider"
                      />
                      <div className="slider-track" style={{ width: `${(parametros.elitismo / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="parametro-item">
                    <label className="parametro-label">
                      <span className="parametro-name">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        Semilla
                      </span>
                    </label>
                    <input
                      type="number"
                      value={parametros.semilla}
                      onChange={(e) => handleParametroChange("semilla", e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              </section>

              <button className="btn-ejecutar" onClick={ejecutarAlgoritmo} disabled={ejecutando}>
                {ejecutando ? (
                  <>
                    <svg
                      className="spinner"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Ejecutando Algoritmo...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Ejecutar Algoritmo Genético</span>
                  </>
                )}
              </button>

              {error && (
                <div className="error-message">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "resultados" && resultado && (
          <div className="results-layout">
            <section className="section">
              <div className="section-header">
                <div>
                  <h2>Resultados de la Optimización</h2>
                  <p className="section-subtitle">Análisis completo del algoritmo genético</p>
                </div>
                <button className="btn-download" onClick={descargarResultados}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span>Descargar JSON</span>
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card stat-card-primary">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Ganancia Total</div>
                    <div className="stat-value">${resultado.distribucion.resumen.gananciaTotal.toFixed(2)}</div>
                    <div className="stat-trend">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      <span>Optimizado</span>
                    </div>
                  </div>
                </div>
                <div className="stat-card stat-card-success">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Área Utilizada</div>
                    <div className="stat-value">{resultado.distribucion.resumen.areaTotal.toFixed(2)} m²</div>
                    <div className="stat-trend">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>de 50 m²</span>
                    </div>
                  </div>
                </div>
                <div className="stat-card stat-card-warning">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Utilización</div>
                    <div className="stat-value">{resultado.distribucion.resumen.utilizacionArea.toFixed(1)}%</div>
                    <div className="stat-trend">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${resultado.distribucion.resumen.utilizacionArea}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-section">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  Distribución de Artículos
                </h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Artículo</th>
                        <th>Cantidad</th>
                        <th>Área Total</th>
                        <th>Ganancia Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.distribucion.distribucionArticulos.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div className="table-cell-with-badge">
                              <strong>{item.nombre}</strong>
                              <span
                                className="table-badge"
                                style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                              ></span>
                            </div>
                          </td>
                          <td>
                            <span className="table-quantity">{item.cantidad}</span>
                          </td>
                          <td>{item.areaTotal.toFixed(2)} m²</td>
                          <td className="table-highlight">${item.gananciaTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "visualizacion" && resultado && (
          <div className="visualization-layout">
            <section className="section">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M15 3v18" />
                </svg>
                Distribución Espacial 2D
              </h2>
              <p className="section-subtitle">Visualización de la disposición óptima de artículos</p>
              <DistributionCanvas distribucion={resultado.distribucion.distribucionArticulos} />
            </section>

            <section className="section">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Gráfica de Convergencia
              </h2>
              <p className="section-subtitle">Evolución del fitness a través de las generaciones</p>
              <ConvergenceChart historial={resultado.historialFitness} />
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
