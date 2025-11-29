// Ejercicio 1.3: Funciones Puras - JavaScript
// Autor: Andres Cuenca
// Fecha: Noviembre 2024

/**
 * Calcula días de retraso de un préstamo
 * Función PURA: mismo input = mismo output, sin efectos secundarios
 */
function calcularDiasRetraso(fechaPrestamo, fechaDevolucion, diasPermitidos) {
  // Convertimos las fechas a milisegundos
  const fecha1 = new Date(fechaPrestamo).getTime();
  const fecha2 = new Date(fechaDevolucion).getTime();
  
  // Calculamos la diferencia en días
  const diferenciaMilisegundos = fecha2 - fecha1;
  const diasTranscurridos = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  
  // Calculamos días de retraso (si es negativo, no hay retraso)
  const diasRetraso = diasTranscurridos - diasPermitidos;
  
  return diasRetraso > 0 ? diasRetraso : 0;
}

/**
 * Calcula multa por días de retraso
 * Regla: $0.50 por día de retraso
 */
function calcularMulta(diasRetraso) {
  const multaPorDia = 0.50;
  return diasRetraso * multaPorDia;
}

// Ejemplos de prueba
console.log("=== PRUEBAS DE FUNCIONES PURAS ===\n");

console.log("Caso 1: Préstamo con retraso");
const dias1 = calcularDiasRetraso("2024-01-01", "2024-01-20", 14);
console.log(`Días de retraso: ${dias1}`); // 5 días (19 días transcurridos - 14 permitidos)
console.log(`Multa: $${calcularMulta(dias1).toFixed(2)}`); // $2.50

console.log("\nCaso 2: Préstamo sin retraso");
const dias2 = calcularDiasRetraso("2024-01-01", "2024-01-10", 14);
console.log(`Días de retraso: ${dias2}`); // 0 días
console.log(`Multa: $${calcularMulta(dias2).toFixed(2)}`); // $0.00

console.log("\nCaso 3: Préstamo con mucho retraso");
const dias3 = calcularDiasRetraso("2024-01-01", "2024-02-01", 14);
console.log(`Días de retraso: ${dias3}`); // 17 días (31 días - 14 permitidos)
console.log(`Multa: $${calcularMulta(dias3).toFixed(2)}`); // $8.50

console.log("\nCaso 4: Verificación de pureza - mismos inputs dan mismos outputs");
const resultado1 = calcularDiasRetraso("2024-01-01", "2024-01-20", 14);
const resultado2 = calcularDiasRetraso("2024-01-01", "2024-01-20", 14);
const resultado3 = calcularDiasRetraso("2024-01-01", "2024-01-20", 14);
console.log(`Primera llamada: ${resultado1}`);
console.log(`Segunda llamada: ${resultado2}`);
console.log(`Tercera llamada: ${resultado3}`);
console.log(`¿Son todas iguales? ${resultado1 === resultado2 && resultado2 === resultado3}`); // true

/**
 * ANÁLISIS DE PUREZA:
 * 
 * ¿Por qué estas funciones son puras?
 * 
 * 1. DETERMINÍSTICAS: 
 *    - Los mismos inputs SIEMPRE producen los mismos outputs
 *    - calcularDiasRetraso("2024-01-01", "2024-01-20", 14) SIEMPRE retorna 5
 *    - calcularMulta(6) SIEMPRE retorna 3.00
 * 
 * 2. SIN EFECTOS SECUNDARIOS:
 *    - No modifican variables externas
 *    - No hacen console.log dentro de la función
 *    - No modifican los parámetros recibidos
 *    - No hacen llamadas a APIs o bases de datos
 *    - No leen ni escriben archivos
 * 
 * 3. NO DEPENDEN DE ESTADO EXTERNO:
 *    - Solo usan los parámetros recibidos
 *    - No acceden a variables globales
 *    - No usan Date.now() ni Math.random()
 * 
 * ¿Qué pasaría si usaras Date.now() dentro?
 * 
 * // FUNCIÓN IMPURA (MALA PRÁCTICA):
 * function calcularDiasRetrasoImpuro(fechaPrestamo, diasPermitidos) {
 *   const ahora = Date.now(); // ¡ESTO LA HACE IMPURA!
 *   const fecha1 = new Date(fechaPrestamo).getTime();
 *   const diasTranscurridos = Math.floor((ahora - fecha1) / (1000 * 60 * 60 * 24));
 *   return Math.max(0, diasTranscurridos - diasPermitidos);
 * }
 * 
 * PROBLEMAS:
 * - La función retorna valores diferentes cada día que la ejecutes
 * - calcularDiasRetrasoImpuro("2024-01-01", 14) hoy retorna X, mañana retorna X+1
 * - Es imposible hacer tests predecibles
 * - No puedes reproducir bugs porque el resultado cambia con el tiempo
 * 
 * Ventajas de funciones puras para testing:
 * 
 * 1. PREDECIBILIDAD:
 *    test('calcular días de retraso', () => {
 *      expect(calcularDiasRetraso("2024-01-01", "2024-01-20", 14)).toBe(5);
 *    });
 *    // Este test SIEMPRE pasará, sin importar cuándo se ejecute
 * 
 * 2. NO REQUIEREN MOCKS:
 *    - No necesitas mockear Date.now()
 *    - No necesitas mockear APIs externas
 *    - Solo pasas los datos que quieres testear
 * 
 * 3. FÁCIL DE DEBUGGEAR:
 *    - Si hay un bug, solo examinas inputs y outputs
 *    - No necesitas revisar estado global o efectos secundarios
 * 
 * 4. PARALELIZACIÓN:
 *    - Puedes ejecutar tests en paralelo sin problemas
 *    - No hay race conditions ni estado compartido
 * 
 * 5. CACHING (MEMOIZATION):
 *    - Puedes cachear resultados ya que son determinísticos
 *    const memoized = {};
 *    function calcularMultaMemoizada(dias) {
 *      if (!memoized[dias]) {
 *        memoized[dias] = calcularMulta(dias);
 *      }
 *      return memoized[dias];
 *    }
 * 
 * 6. REFACTORING SEGURO:
 *    - Puedes refactorizar la implementación
 *    - Mientras retorne lo mismo para los mismos inputs, está bien
 *    - Los tests te avisan si rompes algo
 * 
 * EJEMPLO DE TESTS UNITARIOS:
 * 
 * describe('Funciones Puras de Préstamos', () => {
 *   test('calcular días de retraso - con retraso', () => {
 *     expect(calcularDiasRetraso("2024-01-01", "2024-01-20", 14)).toBe(5);
 *   });
 *   
 *   test('calcular días de retraso - sin retraso', () => {
 *     expect(calcularDiasRetraso("2024-01-01", "2024-01-10", 14)).toBe(0);
 *   });
 *   
 *   test('calcular multa', () => {
 *     expect(calcularMulta(0)).toBe(0);
 *     expect(calcularMulta(5)).toBe(2.50);
 *     expect(calcularMulta(10)).toBe(5.00);
 *   });
 *   
 *   test('pureza - mismos inputs dan mismos outputs', () => {
 *     const input = ["2024-01-01", "2024-01-20", 14];
 *     const resultado1 = calcularDiasRetraso(...input);
 *     const resultado2 = calcularDiasRetraso(...input);
 *     expect(resultado1).toBe(resultado2);
 *   });
 * });
 * 
 * COMPARACIÓN: FUNCIÓN PURA vs IMPURA
 * 
 * PURA:
 * ✓ Testeable sin mocks
 * ✓ Predecible
 * ✓ Cacheable
 * ✓ Paralelizable
 * ✓ Fácil de debuggear
 * ✓ Componible
 * 
 * IMPURA:
 * ✗ Requiere mocks complejos
 * ✗ Resultados varían según estado/tiempo
 * ✗ No cacheable
 * ✗ Problemas de concurrencia
 * ✗ Difícil de debuggear
 * ✗ Difícil de componer
 */