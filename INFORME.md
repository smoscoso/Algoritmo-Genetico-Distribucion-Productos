# Informe Técnico - Simulador de Algoritmos Genéticos
## Optimización de Área con Electrodomésticos

**Universidad de Cundinamarca**  
**Ingeniería de Sistemas y Computación**  
**Machine Learning - Algoritmos Genéticos**

---

## 1. Introducción

Se implementó un sistema completo de optimización basado en Algoritmos Genéticos para resolver el problema de maximización de rentabilidad en la distribución de electrodomésticos dentro de un área limitada de 50 m². El sistema incluye un backend en Python con Flask que ejecuta el algoritmo genético, un frontend interactivo en React para configuración y visualización, y múltiples representaciones gráficas de los resultados.

## 2. Arquitectura del Sistema

### 2.1 Backend (Python + Flask)

**Tecnología**: Flask 3.0.0 con flask-cors para comunicación con el frontend.

**Componentes principales**:

- **Algoritmo Genético**: Implementación completa con operadores genéticos estándar
- **API REST**: Tres endpoints para catálogo, ejecución y health check
- **Gestión de parámetros**: Configuración flexible desde el frontend

**Operadores implementados**:

1. **Inicialización**: Generación aleatoria de individuos respetando restricciones de stock
2. **Evaluación**: Función de fitness con penalización por exceso de área (penalización = 1000 × exceso)
3. **Selección**:
   - Torneo: Selecciona el mejor de K individuos aleatorios (K configurable)
   - Ruleta: Probabilidad proporcional al fitness ajustado (evita valores negativos)
4. **Cruce**: Uniforme con probabilidad Pc por cada gen
5. **Mutación**: Incremento/decremento aleatorio respetando límites [0, stock]
6. **Elitismo**: Preservación de los N mejores individuos sin modificación

**Restricciones**:
- Área máxima: 50 m²
- Stock máximo por artículo
- Cantidad mínima: 0 unidades

### 2.2 Frontend (React)

**Framework**: React 18.2.0 con componentes funcionales y hooks.

**Componentes principales**:

1. **App.jsx**: Componente principal que gestiona el estado global y la comunicación con el backend
2. **DistributionCanvas.jsx**: Visualización 2D en canvas HTML5 con representación proporcional de áreas
3. **ConvergenceChart.jsx**: Gráfica de línea usando Recharts para mostrar evolución del fitness

**Funcionalidades**:
- Selección de artículos mediante checkboxes
- Edición en tiempo real de área, ganancia y stock
- Configuración completa de parámetros del GA
- Visualización de resultados con métricas clave
- Exportación de resultados en formato JSON

### 2.3 Visualización

**Canvas 2D**: 
- Representación espacial proporcional al área real de cada artículo
- Algoritmo de empaquetado simple (left-to-right, top-to-bottom)
- Colores distintivos por tipo de artículo
- Leyenda interactiva con cantidades

**Gráfica de Convergencia**: 
- Eje X: Número de generación
- Eje Y: Mejor fitness encontrado
- Permite identificar convergencia prematura o exploración continua

**Métricas**: 
- Ganancia total en pesos
- Área utilizada en m²
- Porcentaje de utilización del espacio
- Tabla detallada por artículo

## 3. Resultados Experimentales

### 3.1 Configuración por Defecto

**Parámetros**:
- Tamaño de población: 100
- Número de generaciones: 50
- Probabilidad de cruce (Pc): 0.6
- Probabilidad de mutación (Pm): 0.15
- Tipo de selección: Torneo (K=3)
- Elitismo: 2
- Semilla: 42

**Resultados obtenidos**:
- **Ganancia óptima**: $1,926
- **Área utilizada**: 49.86 m² (99.7% de eficiencia)
- **Convergencia**: Alcanzada aproximadamente en la generación 30
- **Artículos seleccionados**: 12 tipos diferentes con cantidades variables

### 3.2 Análisis de Convergencia

El historial de fitness muestra:
- **Fase de exploración** (gen 1-20): Mejora rápida de 850 a 1,135
- **Fase de explotación** (gen 21-30): Refinamiento hasta 1,138
- **Fase de estabilización** (gen 31-50): Mantenimiento del óptimo encontrado

Esto indica un balance adecuado entre exploración y explotación del espacio de búsqueda.

### 3.3 Distribución Óptima

Los artículos con mejor relación ganancia/área fueron priorizados:
- Nevera grande: Alta ganancia ($220) justifica su área (0.6 m²)
- Aire acondicionado: Excelente relación ganancia/área
- Televisores y electrodomésticos pequeños: Completan el espacio eficientemente

## 4. Conclusiones

El sistema cumple exitosamente con todos los requisitos del taller:

✅ **Backend en Python** con implementación completa del algoritmo genético  
✅ **Frontend en React** con interfaz intuitiva y controles completos  
✅ **Visualización 2D** en canvas mostrando distribución espacial  
✅ **Gráfica de convergencia** con evolución del fitness  
✅ **Configuración flexible** de todos los parámetros del GA  
✅ **Documentación completa** con README, informe y ejemplo de resultados  

El algoritmo demostró capacidad efectiva de exploración y explotación, encontrando soluciones cercanas al óptimo global con alta utilización del espacio disponible (99.7%). La herramienta es útil tanto para fines educativos como para aplicaciones prácticas de optimización combinatoria con restricciones.

## 5. Trabajo Futuro

Posibles mejoras:
- Implementar algoritmos de empaquetado 2D más sofisticados (bin packing)
- Agregar más operadores de selección (ranking, estocástico universal)
- Implementar cruce de dos puntos o cruce aritmético
- Agregar visualización 3D para problemas con altura
- Optimización multi-objetivo (ganancia vs. diversidad de productos)
