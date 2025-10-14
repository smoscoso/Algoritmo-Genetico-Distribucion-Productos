"use client"

import { useEffect, useRef } from "react"

const AREA_MAXIMA = 50
const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 650

const DistributionCanvas = ({ distribucion }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !distribucion) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    gradient.addColorStop(0, "#f8f9fa")
    gradient.addColorStop(1, "#e9ecef")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.strokeStyle = "#dee2e6"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])

    const gridSize = 50
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_WIDTH, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    ctx.strokeStyle = "#495057"
    ctx.lineWidth = 4
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const colores = [
      { fill: "#667eea", shadow: "#4c63d2" },
      { fill: "#12b886", shadow: "#0ca678" },
      { fill: "#fab005", shadow: "#e09f04" },
      { fill: "#fa5252", shadow: "#e03e3e" },
      { fill: "#228be6", shadow: "#1c7ed6" },
      { fill: "#be4bdb", shadow: "#ae3ec9" },
      { fill: "#20c997", shadow: "#1bb386" },
      { fill: "#fd7e14", shadow: "#e8590c" },
      { fill: "#4c6ef5", shadow: "#3b5bdb" },
      { fill: "#82c91e", shadow: "#74b816" },
      { fill: "#15aabf", shadow: "#1098ad" },
      { fill: "#e64980", shadow: "#d6336c" },
    ]

    const escala = Math.sqrt((CANVAS_WIDTH * CANVAS_HEIGHT) / AREA_MAXIMA) * 0.85

    let x = 20
    let y = 20
    let maxHeightInRow = 0

    distribucion.forEach((item, index) => {
      const areaUnitaria = item.area
      const cantidad = item.cantidad
      const colorSet = colores[index % colores.length]

      for (let i = 0; i < cantidad; i++) {
        const lado = Math.sqrt(areaUnitaria) * escala

        if (x + lado > CANVAS_WIDTH - 20) {
          x = 20
          y += maxHeightInRow + 10
          maxHeightInRow = 0
        }

        if (y + lado > CANVAS_HEIGHT - 20) {
          break
        }

        ctx.shadowColor = "rgba(0, 0, 0, 0.25)"
        ctx.shadowBlur = 15
        ctx.shadowOffsetX = 4
        ctx.shadowOffsetY = 4

        const radius = Math.min(lado * 0.1, 12)
        ctx.fillStyle = colorSet.fill
        ctx.beginPath()
        ctx.roundRect(x, y, lado, lado, radius)
        ctx.fill()

        const internalGradient = ctx.createLinearGradient(x, y, x + lado, y + lado)
        internalGradient.addColorStop(0, colorSet.fill)
        internalGradient.addColorStop(1, colorSet.shadow)
        ctx.fillStyle = internalGradient
        ctx.beginPath()
        ctx.roundRect(x, y, lado, lado, radius)
        ctx.fill()

        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.roundRect(x, y, lado, lado, radius)
        ctx.stroke()

        if (lado > 50) {
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          const texto = item.nombre.length > 15 ? item.nombre.substring(0, 12) + "..." : item.nombre

          // Sombra para el texto
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
          ctx.shadowBlur = 6
          ctx.fillText(texto, x + lado / 2, y + lado / 2 - 8)

          ctx.font = "600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          ctx.fillText(`${areaUnitaria.toFixed(2)} m²`, x + lado / 2, y + lado / 2 + 10)

          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
        } else if (lado > 30) {
          // Para rectángulos medianos, solo mostrar inicial
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
          ctx.shadowBlur = 4
          ctx.fillText(item.nombre.charAt(0), x + lado / 2, y + lado / 2)
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
        }

        x += lado + 10
        maxHeightInRow = Math.max(maxHeightInRow, lado)
      }
    })

    const legendX = 20
    const legendY = CANVAS_HEIGHT - 30 - distribucion.length * 32
    const legendWidth = 280

    // Sombra para la leyenda
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 4

    // Fondo con gradiente
    const legendGradient = ctx.createLinearGradient(
      legendX - 12,
      legendY - 12,
      legendX - 12,
      legendY + distribucion.length * 32 + 24,
    )
    legendGradient.addColorStop(0, "rgba(255, 255, 255, 0.98)")
    legendGradient.addColorStop(1, "rgba(248, 249, 250, 0.98)")
    ctx.fillStyle = legendGradient
    ctx.beginPath()
    ctx.roundRect(legendX - 12, legendY - 12, legendWidth, distribucion.length * 32 + 24, 12)
    ctx.fill()

    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // Borde de la leyenda
    ctx.strokeStyle = "#dee2e6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(legendX - 12, legendY - 12, legendWidth, distribucion.length * 32 + 24, 12)
    ctx.stroke()

    distribucion.forEach((item, index) => {
      const colorSet = colores[index % colores.length]

      // Sombra para cada cuadro de color
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
      ctx.shadowBlur = 6

      // Cuadro de color con gradiente
      const itemGradient = ctx.createLinearGradient(
        legendX,
        legendY + index * 32,
        legendX + 22,
        legendY + index * 32 + 22,
      )
      itemGradient.addColorStop(0, colorSet.fill)
      itemGradient.addColorStop(1, colorSet.shadow)
      ctx.fillStyle = itemGradient
      ctx.beginPath()
      ctx.roundRect(legendX, legendY + index * 32, 22, 22, 4)
      ctx.fill()

      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Borde blanco
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(legendX, legendY + index * 32, 22, 22, 4)
      ctx.stroke()

      // Texto del nombre
      ctx.fillStyle = "#212529"
      ctx.font = "600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${item.nombre}`, legendX + 32, legendY + index * 32 + 11)

      // Cantidad con badge
      ctx.fillStyle = "#6c757d"
      ctx.font = "500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      ctx.fillText(
        `× ${item.cantidad}`,
        legendX + 32 + ctx.measureText(item.nombre).width + 8,
        legendY + index * 32 + 11,
      )
    })

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.roundRect(CANVAS_WIDTH / 2 - 150, 15, 300, 45, 8)
    ctx.fill()
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    ctx.strokeStyle = "#dee2e6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(CANVAS_WIDTH / 2 - 150, 15, 300, 45, 8)
    ctx.stroke()

    ctx.fillStyle = "#212529"
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Distribución Óptima", CANVAS_WIDTH / 2, 32)

    ctx.fillStyle = "#6c757d"
    ctx.font = "500 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.fillText(
      `Área total: ${distribucion.reduce((sum, item) => sum + item.areaTotal, 0).toFixed(2)} m²`,
      CANVAS_WIDTH / 2,
      48,
    )
  }, [distribucion])

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  )
}

export default DistributionCanvas
