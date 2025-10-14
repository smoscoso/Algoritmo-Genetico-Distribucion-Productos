import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const ConvergenceChart = ({ historial }) => {
  const data = historial.map((fitness, index) => ({
    generacion: index + 1,
    fitness: fitness,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #667eea",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "#6c757d", fontWeight: 600 }}>
            Generación: {payload[0].payload.generacion}
          </p>
          <p style={{ margin: "6px 0 0 0", fontSize: "16px", fontWeight: 700, color: "#667eea" }}>
            Fitness: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />

        <XAxis
          dataKey="generacion"
          label={{ value: "Generación", position: "insideBottom", offset: -5, fill: "#6c757d", fontWeight: 600 }}
          stroke="#adb5bd"
          tick={{ fill: "#6c757d", fontWeight: 600 }}
        />
        <YAxis
          label={{ value: "Fitness (Ganancia)", angle: -90, position: "insideLeft", fill: "#6c757d", fontWeight: 600 }}
          stroke="#adb5bd"
          tick={{ fill: "#6c757d", fontWeight: 600 }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend wrapperStyle={{ color: "#212529", fontWeight: 600 }} />

        <defs>
          <linearGradient id="colorFitness" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        <Line
          type="monotone"
          dataKey="fitness"
          stroke="url(#colorFitness)"
          strokeWidth={4}
          dot={false}
          name="Mejor Fitness"
          activeDot={{ r: 8, fill: "#667eea", stroke: "#fff", strokeWidth: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ConvergenceChart
