# Simulador de Maximización de Rentabilidad con Algoritmos Genéticos

Sistema inteligente basado en Algoritmos Genéticos para maximizar la rentabilidad de electrodomésticos dentro de un área de 50 m².

## 🚀 Características

- **Backend en Python**: Implementación del algoritmo genético con Flask
- **Frontend Interactivo**: Interfaz moderna con React
- **Algoritmo Genético Configurable**: Ajusta parámetros como tasa de cruce, mutación, selección y elitismo
- **Visualización 2D**: Canvas interactivo mostrando la distribución espacial de artículos
- **Gráfica de Convergencia**: Evolución del fitness a través de las generaciones
- **Catálogo Personalizable**: Modifica costos, beneficios y stock de cada artículo

## 📋 Requisitos

### Backend
- Python 3.8+
- pip

### Frontend
- Node.js 16+
- npm o yarn

## 🛠️ Instalación y Ejecución

### 1. Clonar el repositorio

\`\`\`bash
git clone [https://github.com/smoscoso/Algoritmo-Genetico-Distribucion-Productos.git]
cd Algoritmo Genetico para optimización de Productos
\`\`\`

### 2. Configurar y ejecutar el Backend

\`\`\`bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar el servidor
python main.py
\`\`\`

El backend estará disponible en `http://localhost:5000`

### 3. Configurar y ejecutar el Frontend

**En una nueva terminal:**

\`\`\`bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
\`\`\`

El frontend estará disponible en `http://localhost:3000`

## 🎮 Uso

### 1. Configurar Catálogo
- Selecciona los artículos que deseas incluir (checkbox)
- Modifica área, ganancia y stock según necesites

### 2. Ajustar Parámetros del GA
- **Tamaño de Población**: Número de individuos por generación (20-200)
- **Número de Generaciones**: Iteraciones del algoritmo (10-100)
- **Tasa de Cruce (Pc)**: Probabilidad de cruce entre padres (0-1)
- **Tasa de Mutación (Pm)**: Probabilidad de mutación (0-0.5)
- **Tipo de Selección**: Torneo o Ruleta
- **Tamaño de Torneo (K)**: Solo para selección por torneo (2-10)
- **Elitismo**: Número de mejores individuos que pasan directamente
- **Semilla**: Para reproducibilidad de resultados

### 3. Ejecutar Simulación
- Haz clic en "Ejecutar Algoritmo Genético"
- Espera a que termine el procesamiento

### 4. Ver Resultados
- **Métricas**: Ganancia total, área utilizada y porcentaje de utilización
- **Tabla de Distribución**: Detalle de cada artículo seleccionado
- **Visualización 2D**: Plano con artículos distribuidos proporcionalmente
- **Gráfica de Convergencia**: Evolución del fitness por generación
- **Descargar JSON**: Exporta los resultados completos

## 🧬 Algoritmo Genético

### Operadores Implementados

1. **Inicialización**: Población aleatoria respetando stock disponible
2. **Evaluación**: 
   - Fitness = Ganancia total
   - Penalización por exceso de área: Fitness - 1000 × (área_excedida)
3. **Selección**: 
   - **Torneo**: Selecciona el mejor de K individuos aleatorios
   - **Ruleta**: Probabilidad proporcional al fitness ajustado
4. **Cruce**: Uniforme con probabilidad Pc por cada gen
5. **Mutación**: Incremento/decremento aleatorio con probabilidad Pm
6. **Elitismo**: Preserva los N mejores individuos sin modificación

### Restricciones
- Área máxima: 50 m²
- Stock máximo por artículo
- Cantidad mínima: 0 unidades

## 📊 Ejemplo de Resultados

Ver `public/resultados_ejemplo.json` para una ejecución con parámetros por defecto:
- **Ganancia**: $1,926
- **Área utilizada**: 49.86 m² (99.7%)
- **12 tipos de artículos** distribuidos óptimamente
- **Convergencia**: ~30 generaciones

## 🏗️ Tecnologías

### Backend
- Python 3.8+
- Flask 3.0.0
- flask-cors 4.0.0

### Frontend
- React 18.2.0
- Recharts 2.10.0 (gráficas)
- CSS3 (estilos personalizados)

## 🔧 API Endpoints

### GET `/api/catalogo`
Retorna el catálogo de artículos por defecto.

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "nombre": "Mini nevera",
    "area": 0.25,
    "ganancia": 40,
    "stock": 20
  },
  ...
]
\`\`\`

### POST `/api/ejecutar`
Ejecuta el algoritmo genético con los parámetros proporcionados.

**Request Body:**
\`\`\`json
{
  "catalogo": [...],
  "tamPoblacion": 100,
  "numGeneraciones": 50,
  "probCruce": 0.6,
  "probMutacion": 0.15,
  "tipoSeleccion": "torneo",
  "torneoK": 3,
  "elitismo": 2,
  "semilla": 42
}
\`\`\`

**Response:**
\`\`\`json
{
  "mejorSolucion": [3, 5, 2, ...],
  "distribucion": [...],
  "areaTotal": 49.86,
  "gananciaTotal": 1926,
  "utilizacionArea": 99.7,
  "historialFitness": [850, 920, ...],
  "parametros": {...}
}
\`\`\`

### GET `/api/health`
Verifica el estado del servidor.

## 🐛 Solución de Problemas

### Error de CORS
Si el frontend no puede conectarse al backend, verifica que:
- El backend esté ejecutándose en `http://localhost:5000`
- Flask-CORS esté instalado correctamente

### Puerto ocupado
Si el puerto 5000 o 3000 está ocupado:
- Backend: Cambia el puerto en `main.py`: `app.run(debug=True, port=OTRO_PUERTO)`
- Frontend: Cambia el puerto con `PORT=OTRO_PUERTO npm start`
- Actualiza `API_URL` en `frontend/src/App.jsx`

## 👨‍💻 Autor
Sergio Leonardo Moscoso
Desarrollado para el curso de Machine Learning - Algoritmos Genéticos
Universidad de Cundinamarca - Ingeniería de Sistemas y Computación
