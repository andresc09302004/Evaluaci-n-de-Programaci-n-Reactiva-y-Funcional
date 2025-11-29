// Ejercicio 2.1: Funciones de Orden Superior - JavaScript

// Datos de ejemplo
const libros = [
  { id: 1, titulo: "Clean Code", categoria: "Programacion", anio: 2008, autor: "Robert Martin" },
  { id: 2, titulo: "Design Patterns", categoria: "Programacion", anio: 1994, autor: "Gang of Four" },
  { id: 3, titulo: "Calculus", categoria: "Matematicas", anio: 2020, autor: "James Stewart" },
  { id: 4, titulo: "Linear Algebra", categoria: "Matematicas", anio: 2018, autor: "Gilbert Strang" },
  { id: 5, titulo: "Database Systems", categoria: "Bases de Datos", anio: 2022, autor: "Silberschatz" }
];

// ========================================
// Requisito A: CLOSURE - Función que retorna función
// ========================================

/**
 * Crea un filtrador personalizado usando closures
 * Retorna una función que puede usarse con Array.filter()
 */
function crearFiltrador(criterio) {
  // La función retornada "recuerda" el criterio (closure)
  return function(libro) {
    // Verificamos cada propiedad del criterio
    for (let propiedad in criterio) {
      if (criterio[propiedad] === undefined) continue;
      
      // Si el criterio tiene un operador especial
      if (propiedad === 'operador' && criterio.anio) {
        const operador = criterio.operador;
        const valorComparar = criterio.anio;
        
        if (operador === 'mayor' && libro.anio <= valorComparar) return false;
        if (operador === 'menor' && libro.anio >= valorComparar) return false;
        if (operador === 'igual' && libro.anio !== valorComparar) return false;
      } 
      // Comparación directa para otras propiedades
      else if (propiedad !== 'operador' && libro[propiedad] !== criterio[propiedad]) {
        return false;
      }
    }
    return true;
  };
}

// Ejemplos de uso con closures
console.log("=== REQUISITO A: CLOSURES ===\n");

const filtrarProgramacion = crearFiltrador({ categoria: "Programacion" });
const librosProgramacion = libros.filter(filtrarProgramacion);
console.log("Libros de Programación:");
librosProgramacion.forEach(l => console.log(`  - ${l.titulo} (${l.anio})`));

const filtrarRecientes = crearFiltrador({ anio: 2020, operador: "mayor" });
const librosRecientes = libros.filter(filtrarRecientes);
console.log("\nLibros posteriores a 2020:");
librosRecientes.forEach(l => console.log(`  - ${l.titulo} (${l.anio})`));

const filtrarMatematicasRecientes = crearFiltrador({ 
  categoria: "Matematicas", 
  anio: 2018, 
  operador: "mayor" 
});
const matematicasRecientes = libros.filter(filtrarMatematicasRecientes);
console.log("\nLibros de Matemáticas posteriores a 2018:");
matematicasRecientes.forEach(l => console.log(`  - ${l.titulo} (${l.anio})`));

// ========================================
// Requisito B: FUNCIÓN COMO PARÁMETRO
// ========================================

// Datos de préstamos para el ejemplo
const prestamos = [
  { id: 1, libroId: 1, usuarioId: 101, fechaPrestamo: "2024-01-15", diasRetraso: 0, activo: true },
  { id: 2, libroId: 2, usuarioId: 102, fechaPrestamo: "2024-01-10", diasRetraso: 5, activo: true },
  { id: 3, libroId: 3, usuarioId: 103, fechaPrestamo: "2024-02-01", diasRetraso: 10, activo: true },
  { id: 4, libroId: 4, usuarioId: 104, fechaPrestamo: "2024-02-15", diasRetraso: 0, activo: false }
];

/**
 * Procesa préstamos aplicando una estrategia (función) a cada uno
 * Esta función de orden superior recibe una función como parámetro
 */
function procesarPrestamos(prestamos, estrategia) {
  // Aplicamos la estrategia a cada préstamo y retornamos los resultados
  return prestamos.map(prestamo => estrategia(prestamo));
}

// Estrategia 1: Calcular multas
const calcularMultas = (prestamo) => {
  const multaPorDia = 0.50;
  const multa = prestamo.diasRetraso * multaPorDia;
  return {
    prestamoId: prestamo.id,
    usuarioId: prestamo.usuarioId,
    diasRetraso: prestamo.diasRetraso,
    multa: multa,
    mensaje: multa > 0 
      ? `Multa de $${multa.toFixed(2)} por ${prestamo.diasRetraso} días de retraso` 
      : "Sin multa"
  };
};

// Estrategia 2: Enviar recordatorios
const enviarRecordatorios = (prestamo) => {
  let mensaje = "";
  
  if (!prestamo.activo) {
    mensaje = "Préstamo cerrado - No requiere recordatorio";
  } else if (prestamo.diasRetraso === 0) {
    mensaje = "Recordatorio: Su préstamo está al día";
  } else if (prestamo.diasRetraso <= 5) {
    mensaje = `AVISO: Tiene ${prestamo.diasRetraso} días de retraso. Por favor devuelva el libro pronto.`;
  } else {
    mensaje = `URGENTE: Tiene ${prestamo.diasRetraso} días de retraso. Devuelva el libro inmediatamente.`;
  }
  
  return {
    prestamoId: prestamo.id,
    usuarioId: prestamo.usuarioId,
    tipo: prestamo.diasRetraso > 5 ? "URGENTE" : "NORMAL",
    mensaje: mensaje
  };
};

// Estrategia 3: Generar estadísticas
const generarEstadisticas = (prestamo) => {
  return {
    prestamoId: prestamo.id,
    estado: prestamo.activo ? "Activo" : "Cerrado",
    cumplimiento: prestamo.diasRetraso === 0 ? "Cumple" : "Retraso",
    nivelRetraso: prestamo.diasRetraso === 0 ? "Ninguno" : 
                  prestamo.diasRetraso <= 5 ? "Leve" : "Grave"
  };
};

// Ejemplos de uso
console.log("\n=== REQUISITO B: FUNCIÓN COMO PARÁMETRO ===\n");

console.log("1. CÁLCULO DE MULTAS:");
const multas = procesarPrestamos(prestamos, calcularMultas);
multas.forEach(m => console.log(`  Usuario ${m.usuarioId}: ${m.mensaje}`));

console.log("\n2. ENVÍO DE RECORDATORIOS:");
const recordatorios = procesarPrestamos(prestamos, enviarRecordatorios);
recordatorios.forEach(r => console.log(`  [${r.tipo}] Usuario ${r.usuarioId}: ${r.mensaje}`));

console.log("\n3. GENERACIÓN DE ESTADÍSTICAS:");
const estadisticas = procesarPrestamos(prestamos, generarEstadisticas);
estadisticas.forEach(e => {
  console.log(`  Préstamo ${e.prestamoId}: ${e.estado} - ${e.cumplimiento} (${e.nivelRetraso})`);
});

/**
 * EXPLICACIÓN DE FUNCIONES DE ORDEN SUPERIOR:
 * 
 * CLOSURES (crearFiltrador):
 * - Una función que retorna otra función
 * - La función interna "recuerda" las variables del contexto externo (criterio)
 * - Ventajas:
 *   * Crear funciones personalizadas dinámicamente
 *   * Encapsular lógica con configuración
 *   * Factory pattern para crear filtros, validadores, etc.
 * 
 * FUNCIÓN COMO PARÁMETRO (procesarPrestamos):
 * - Recibe una función (estrategia) como argumento
 * - Permite cambiar el comportamiento sin modificar procesarPrestamos
 * - Ventajas:
 *   * Código más flexible y reutilizable
 *   * Separa el "qué hacer" (procesarPrestamos) del "cómo hacerlo" (estrategia)
 *   * Strategy Pattern: diferentes algoritmos intercambiables
 * 
 * ¿Por qué son útiles?
 * 1. Abstracción: Separamos la lógica genérica de la específica
 * 2. Reutilización: Una función sirve para múltiples propósitos
 * 3. Testing: Podemos inyectar funciones mock para testing
 * 4. Composición: Podemos combinar funciones de orden superior
 * 5. Mantenibilidad: Cambios en estrategias no afectan la función principal
 * 
 * Ejemplos del mundo real:
 * - Array.map, filter, reduce son funciones de orden superior
 * - Event listeners: addEventListener(evento, funcionManejadora)
 * - Middleware en Express.js
 * - Hooks en React (useEffect recibe una función)
 */