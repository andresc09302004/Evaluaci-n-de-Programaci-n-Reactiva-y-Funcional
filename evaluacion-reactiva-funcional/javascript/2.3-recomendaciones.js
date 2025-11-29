// Ejercicio 2.3: Map, Filter, Reduce Avanzado - JavaScript
// Sistema de recomendación de libros

// Datos de ejemplo
const libros = [
  { id: 1, titulo: "Clean Code", categoria: "Programacion", anio: 2008, rating: 4.7 },
  { id: 2, titulo: "Design Patterns", categoria: "Programacion", anio: 1994, rating: 4.5 },
  { id: 3, titulo: "Refactoring", categoria: "Programacion", anio: 1999, rating: 4.6 },
  { id: 4, titulo: "JavaScript: The Good Parts", categoria: "Programacion", anio: 2008, rating: 4.2 },
  { id: 5, titulo: "Functional Programming in JS", categoria: "Programacion", anio: 2021, rating: 4.8 },
  { id: 6, titulo: "Calculus I", categoria: "Matematicas", anio: 2010, rating: 4.3 },
  { id: 7, titulo: "Linear Algebra", categoria: "Matematicas", anio: 2022, rating: 4.6 },
  { id: 8, titulo: "Discrete Mathematics", categoria: "Matematicas", anio: 2019, rating: 4.4 },
  { id: 9, titulo: "Statistics Essentials", categoria: "Matematicas", anio: 2023, rating: 4.7 },
  { id: 10, titulo: "Database Systems", categoria: "Bases de Datos", anio: 2020, rating: 4.5 },
  { id: 11, titulo: "SQL Fundamentals", categoria: "Bases de Datos", anio: 2021, rating: 4.4 },
  { id: 12, titulo: "NoSQL Databases", categoria: "Bases de Datos", anio: 2022, rating: 4.3 },
  { id: 13, titulo: "Algorithms", categoria: "Algoritmos", anio: 2009, rating: 4.8 },
  { id: 14, titulo: "Data Structures", categoria: "Algoritmos", anio: 2020, rating: 4.6 }
];

const historialPrestamos = [
  { libroId: 1, cantidad: 45 },
  { libroId: 2, cantidad: 23 },
  { libroId: 3, cantidad: 38 },
  { libroId: 4, cantidad: 15 },
  { libroId: 5, cantidad: 52 },
  { libroId: 6, cantidad: 28 },
  { libroId: 7, cantidad: 41 },
  { libroId: 8, cantidad: 19 },
  { libroId: 9, cantidad: 33 },
  { libroId: 10, cantidad: 31 },
  { libroId: 11, cantidad: 27 },
  { libroId: 12, cantidad: 22 },
  { libroId: 13, cantidad: 48 },
  { libroId: 14, cantidad: 36 }
];

/**
 * Sistema de recomendación de libros
 * 
 * Algoritmo:
 * 1. Filtrar libros de categorías que el usuario ha leído
 * 2. Calcular score de recomendación para cada libro:
 *    - Popularidad: +1 punto por cada 10 préstamos
 *    - Recencia: libros 2020+ tienen +2 puntos
 *    - Rating: rating * 10 puntos
 * 3. Reducir a top 10 libros con mayor score
 */
function recomendarLibros(libros, usuario, historialPrestamos) {
  
  // PASO 1: Filtrar por categorías favoritas del usuario
  const librosRelevantes = libros.filter(libro => 
    usuario.categoriasFavoritas.includes(libro.categoria)
  );
  
  // PASO 2: Agregar score a cada libro
  const librosConScore = librosRelevantes.map(libro => {
    // Buscar historial de préstamos para este libro
    const historial = historialPrestamos.find(h => h.libroId === libro.id);
    const cantidadPrestamos = historial ? historial.cantidad : 0;
    
    // Calcular componentes del score
    const puntosPopularidad = Math.floor(cantidadPrestamos / 10); // +1 punto por cada 10 préstamos
    const puntosRecencia = libro.anio >= 2020 ? 2 : 0; // +2 puntos si es de 2020 o posterior
    const puntosRating = libro.rating * 10; // rating * 10
    
    // Score total
    const scoreTotal = puntosPopularidad + puntosRecencia + puntosRating;
    
    return {
      ...libro, // Spread operator para copiar todas las propiedades del libro
      cantidadPrestamos,
      score: scoreTotal,
      detalleScore: {
        popularidad: puntosPopularidad,
        recencia: puntosRecencia,
        rating: puntosRating
      }
    };
  });
  
  // PASO 3: Obtener top 10 ordenados por score (mayor a menor)
  const top10 = librosConScore
    .sort((a, b) => b.score - a.score) // Ordenar descendente por score
    .slice(0, 10); // Tomar los primeros 10
  
  return top10;
}

// Alternativa usando reduce para PASO 3 (más funcional pero menos común)
function recomendarLibrosConReduce(libros, usuario, historialPrestamos) {
  const librosRelevantes = libros.filter(libro => 
    usuario.categoriasFavoritas.includes(libro.categoria)
  );
  
  const librosConScore = librosRelevantes.map(libro => {
    const historial = historialPrestamos.find(h => h.libroId === libro.id);
    const cantidadPrestamos = historial ? historial.cantidad : 0;
    
    const puntosPopularidad = Math.floor(cantidadPrestamos / 10);
    const puntosRecencia = libro.anio >= 2020 ? 2 : 0;
    const puntosRating = libro.rating * 10;
    const scoreTotal = puntosPopularidad + puntosRecencia + puntosRating;
    
    return { ...libro, cantidadPrestamos, score: scoreTotal };
  });
  
  // Usar reduce para obtener top 10
  const top10 = librosConScore.reduce((acumulador, libro) => {
    // Si el acumulador tiene menos de 10 elementos, agregamos directamente
    if (acumulador.length < 10) {
      acumulador.push(libro);
      // Mantenemos ordenado
      acumulador.sort((a, b) => b.score - a.score);
    } 
    // Si ya tenemos 10, solo agregamos si el score es mayor que el último
    else if (libro.score > acumulador[acumulador.length - 1].score) {
      acumulador[acumulador.length - 1] = libro;
      acumulador.sort((a, b) => b.score - a.score);
    }
    return acumulador;
  }, []);
  
  return top10;
}

// Ejemplos de uso
const usuario1 = {
  id: 1,
  nombre: "Israel Asanza",
  categoriasFavoritas: ["Programacion", "Matematicas"]
};

const usuario2 = {
  id: 2,
  nombre: "Jorge Beltran",
  categoriasFavoritas: ["Programacion", "Bases de Datos", "Algoritmos"]
};

console.log("=== SISTEMA DE RECOMENDACIÓN DE LIBROS ===\n");

console.log(`Recomendaciones para: ${usuario1.nombre}`);
console.log(`Categorías favoritas: ${usuario1.categoriasFavoritas.join(", ")}\n`);

const recomendaciones1 = recomendarLibros(libros, usuario1, historialPrestamos);

recomendaciones1.forEach((libro, index) => {
  console.log(`${index + 1}. ${libro.titulo} (${libro.anio})`);
  console.log(`   Categoría: ${libro.categoria}`);
  console.log(`   Rating: ${libro.rating} | Préstamos: ${libro.cantidadPrestamos}`);
  console.log(`   Score: ${libro.score.toFixed(1)} puntos`);
  console.log(`   (Popularidad: ${libro.detalleScore.popularidad} + Recencia: ${libro.detalleScore.recencia} + Rating: ${libro.detalleScore.rating})`);
  console.log();
});

console.log("=".repeat(60));
console.log(`\nRecomendaciones para: ${usuario2.nombre}`);
console.log(`Categorías favoritas: ${usuario2.categoriasFavoritas.join(", ")}\n`);

const recomendaciones2 = recomendarLibros(libros, usuario2, historialPrestamos);

recomendaciones2.forEach((libro, index) => {
  console.log(`${index + 1}. ${libro.titulo} (${libro.anio}) - Score: ${libro.score.toFixed(1)}`);
});

/**
 * EXPLICACIÓN DETALLADA:
 * 
 * ¿Por qué usar FILTER, MAP y SORT en lugar de loops?
 * 
 * 1. FILTER (Paso 1):
 *    - Propósito: Seleccionar solo libros relevantes
 *    - Alternativa imperativa requeriría: crear array, loop, if, push
 *    - Ventaja: Declarativo, claro, una línea
 *    
 * 2. MAP (Paso 2):
 *    - Propósito: Transformar cada libro agregando score
 *    - Alternativa imperativa requeriría: loop, cálculos, crear objeto nuevo, push
 *    - Ventaja: Transforma elementos sin mutar el original
 *    
 * 3. SORT + SLICE (Paso 3):
 *    - Propósito: Ordenar y tomar top 10
 *    - Alternativa imperativa requeriría: algoritmo de ordenamiento manual, loop para slice
 *    - Ventaja: Más legible, menos propenso a errores
 *    
 * ¿Por qué NO usar loops?
 * ✗ Más líneas de código
 * ✗ Mayor probabilidad de bugs (off-by-one errors)
 * ✗ Variables mutables
 * ✗ Menos composable
 * ✗ Más difícil de testear
 * 
 * ¿Cuándo usar REDUCE?
 * - Cuando necesitas agregar datos en un solo valor
 * - Cuando necesitas acumular estado complejo
 * - En este caso: sort + slice es más legible que reduce
 * - Reduce es más útil para: sumar, contar, agrupar, transformar a objeto
 * 
 * Ejemplo imperativo (antipatrón):
 * 
 * function recomendarLibrosImperativo(libros, usuario, historial) {
 *   let resultado = [];
 *   
 *   // Filtrar manualmente
 *   for (let i = 0; i < libros.length; i++) {
 *     for (let j = 0; j < usuario.categoriasFavoritas.length; j++) {
 *       if (libros[i].categoria === usuario.categoriasFavoritas[j]) {
 *         resultado.push(libros[i]);
 *         break;
 *       }
 *     }
 *   }
 *   
 *   // Calcular scores manualmente
 *   for (let i = 0; i < resultado.length; i++) {
 *     let cantidadPrestamos = 0;
 *     for (let j = 0; j < historial.length; j++) {
 *       if (historial[j].libroId === resultado[i].id) {
 *         cantidadPrestamos = historial[j].cantidad;
 *         break;
 *       }
 *     }
 *     resultado[i].score = ...cálculos...
 *   }
 *   
 *   // Ordenar manualmente (bubble sort)
 *   for (let i = 0; i < resultado.length - 1; i++) {
 *     for (let j = 0; j < resultado.length - i - 1; j++) {
 *       if (resultado[j].score < resultado[j + 1].score) {
 *         let temp = resultado[j];
 *         resultado[j] = resultado[j + 1];
 *         resultado[j + 1] = temp;
 *       }
 *     }
 *   }
 *   
 *   // Tomar top 10 manualmente
 *   let top10 = [];
 *   for (let i = 0; i < 10 && i < resultado.length; i++) {
 *     top10.push(resultado[i]);
 *   }
 *   
 *   return top10;
 * }
 * 
 * ¡Compare esto con nuestra solución funcional de 20 líneas!
 */