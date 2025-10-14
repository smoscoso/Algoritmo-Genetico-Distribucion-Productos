from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from copy import deepcopy

app = Flask(__name__)
CORS(app)

# Catálogo de artículos por defecto
CATALOGO_DEFAULT = [
    {"id": 1, "nombre": "Mini nevera", "area": 0.25, "ganancia": 40, "stock": 20},
    {"id": 2, "nombre": "Televisor 32\"", "area": 0.1125, "ganancia": 60, "stock": 6},
    {"id": 3, "nombre": "Lavadora", "area": 0.36, "ganancia": 90, "stock": 3},
    {"id": 4, "nombre": "Microondas", "area": 0.20, "ganancia": 25, "stock": 8},
    {"id": 5, "nombre": "Aire acondicionado", "area": 0.27, "ganancia": 110, "stock": 2},
    {"id": 6, "nombre": "Licuadora", "area": 0.04, "ganancia": 8, "stock": 10},
    {"id": 7, "nombre": "Nevera grande", "area": 0.6, "ganancia": 220, "stock": 2},
    {"id": 8, "nombre": "Horno eléctrico", "area": 0.36, "ganancia": 65, "stock": 3},
    {"id": 9, "nombre": "Aspiradora", "area": 0.0875, "ganancia": 28, "stock": 6},
    {"id": 10, "nombre": "Plancha", "area": 0.06, "ganancia": 10, "stock": 12},
    {"id": 11, "nombre": "Cocina a gas", "area": 0.48, "ganancia": 130, "stock": 2},
    {"id": 12, "nombre": "Extractor cocina", "area": 0.18, "ganancia": 45, "stock": 4},
]

AREA_MAXIMA = 50.0


# FUNCIONES DEL ALGORITMO GENÉTICO

def crear_individuo(catalogo):
    """Genera un individuo aleatorio (número de unidades por artículo)."""
    return [random.randint(0, item["stock"]) for item in catalogo]


def evaluar_individuo(individuo, catalogo, penalizacion=1000.0):
    """Calcula el área total y la ganancia (fitness) con penalización."""
    area = sum(q * item["area"] for q, item in zip(individuo, catalogo))
    ganancia = sum(q * item["ganancia"] for q, item in zip(individuo, catalogo))
    
    if area <= AREA_MAXIMA:
        return ganancia
    else:
        exceso = area - AREA_MAXIMA
        return ganancia - penalizacion * exceso


def seleccionar_torneo(poblacion, fitness, k=3):
    """Selección por torneo."""
    seleccionados = random.sample(range(len(poblacion)), k)
    mejor = max(seleccionados, key=lambda i: fitness[i])
    return deepcopy(poblacion[mejor])


def seleccionar_ruleta(poblacion, fitness):
    """Selección por ruleta."""
    # Ajustar fitness para que todos sean positivos
    min_fitness = min(fitness)
    fitness_ajustado = [f - min_fitness + 1 for f in fitness]
    total = sum(fitness_ajustado)
    
    if total == 0:
        return deepcopy(random.choice(poblacion))
    
    punto = random.uniform(0, total)
    acumulado = 0
    for i, f in enumerate(fitness_ajustado):
        acumulado += f
        if acumulado >= punto:
            return deepcopy(poblacion[i])
    
    return deepcopy(poblacion[-1])


def cruzar_uniforme(a, b, prob_cruce=0.5):
    """Cruce uniforme."""
    hijo1, hijo2 = a.copy(), b.copy()
    for i in range(len(a)):
        if random.random() < prob_cruce:
            hijo1[i], hijo2[i] = hijo2[i], hijo1[i]
    return hijo1, hijo2


def mutar(individuo, catalogo, prob_mut=0.1):
    """Mutación: sumar, restar o cambiar aleatoriamente."""
    for i in range(len(individuo)):
        if random.random() < prob_mut:
            if random.random() < 0.5:
                individuo[i] = max(0, individuo[i] - 1)
            else:
                individuo[i] = min(catalogo[i]["stock"], individuo[i] + 1)
    return individuo


def ejecutar_algoritmo_genetico(params):
    """Ejecuta el algoritmo genético con los parámetros dados."""
    # Extraer parámetros
    catalogo = params.get('catalogo', CATALOGO_DEFAULT)
    tam_poblacion = params.get('tamPoblacion', 100)
    num_generaciones = params.get('numGeneraciones', 50)
    prob_cruce = params.get('probCruce', 0.6)
    prob_mutacion = params.get('probMutacion', 0.15)
    tipo_seleccion = params.get('tipoSeleccion', 'torneo')
    torneo_k = params.get('torneoK', 3)
    elitismo = params.get('elitismo', 2)
    semilla = params.get('semilla', 42)
    
    # Establecer semilla
    random.seed(semilla)
    
    # Inicialización
    poblacion = [crear_individuo(catalogo) for _ in range(tam_poblacion)]
    fitness_vals = [evaluar_individuo(ind, catalogo) for ind in poblacion]
    
    mejor_global = None
    mejor_fitness = float('-inf')
    historial_fitness = []
    
    # Bucle evolutivo
    for gen in range(num_generaciones):
        # Ordenar la población según fitness
        pares = sorted(zip(poblacion, fitness_vals), key=lambda x: x[1], reverse=True)
        
        # Guardar mejor individuo global
        if pares[0][1] > mejor_fitness:
            mejor_fitness = pares[0][1]
            mejor_global = deepcopy(pares[0][0])
        
        historial_fitness.append(pares[0][1])
        
        # Nueva población con elitismo
        nueva_poblacion = [deepcopy(pares[i][0]) for i in range(min(elitismo, len(pares)))]
        
        # Reproducción
        while len(nueva_poblacion) < tam_poblacion:
            # Selección según tipo
            if tipo_seleccion == 'torneo':
                padre1 = seleccionar_torneo(poblacion, fitness_vals, torneo_k)
                padre2 = seleccionar_torneo(poblacion, fitness_vals, torneo_k)
            else:  # ruleta
                padre1 = seleccionar_ruleta(poblacion, fitness_vals)
                padre2 = seleccionar_ruleta(poblacion, fitness_vals)
            
            # Cruce
            if random.random() < prob_cruce:
                hijo1, hijo2 = cruzar_uniforme(padre1, padre2)
            else:
                hijo1, hijo2 = deepcopy(padre1), deepcopy(padre2)
            
            # Mutación
            hijo1 = mutar(hijo1, catalogo, prob_mutacion)
            hijo2 = mutar(hijo2, catalogo, prob_mutacion)
            
            nueva_poblacion.append(hijo1)
            if len(nueva_poblacion) < tam_poblacion:
                nueva_poblacion.append(hijo2)
        
        poblacion = nueva_poblacion
        fitness_vals = [evaluar_individuo(ind, catalogo) for ind in poblacion]
    
    # Calcular resultados finales
    mejor_area = sum(q * item["area"] for q, item in zip(mejor_global, catalogo))
    mejor_ganancia = sum(q * item["ganancia"] for q, item in zip(mejor_global, catalogo))
    
    # Crear distribución de artículos
    distribucion = []
    for q, item in zip(mejor_global, catalogo):
        if q > 0:
            distribucion.append({
                "id": item["id"],
                "nombre": item["nombre"],
                "cantidad": q,
                "area": item["area"],
                "ganancia": item["ganancia"],
                "areaTotal": q * item["area"],
                "gananciaTotal": q * item["ganancia"]
            })
    
    return {
        "mejorSolucion": mejor_global,
        "distribucion": distribucion,
        "areaTotal": mejor_area,
        "gananciaTotal": mejor_ganancia,
        "utilizacionArea": (mejor_area / AREA_MAXIMA) * 100,
        "historialFitness": historial_fitness,
        "parametros": {
            "tamPoblacion": tam_poblacion,
            "numGeneraciones": num_generaciones,
            "probCruce": prob_cruce,
            "probMutacion": prob_mutacion,
            "tipoSeleccion": tipo_seleccion,
            "torneoK": torneo_k,
            "elitismo": elitismo,
            "semilla": semilla
        }
    }


# RUTAS DE LA API

@app.route('/api/catalogo', methods=['GET'])
def obtener_catalogo():
    """Retorna el catálogo de artículos por defecto."""
    return jsonify(CATALOGO_DEFAULT)


@app.route('/api/ejecutar', methods=['POST'])
def ejecutar():
    """Ejecuta el algoritmo genético con los parámetros recibidos."""
    try:
        params = request.json
        resultado = ejecutar_algoritmo_genetico(params)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint de salud."""
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
