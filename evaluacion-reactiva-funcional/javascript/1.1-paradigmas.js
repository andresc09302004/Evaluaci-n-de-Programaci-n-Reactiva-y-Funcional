// Ejercicio 1.1: Paradigmas de Programación - JavaScript
// Filtrar libros disponibles de una categoría específica y ordenarlos por año
const libros = [
  { id: 1, titulo: "Clean Code", categoria: "Programacion", anio: 2008, prestado: false },
  { id: 2, titulo: "Design Patterns", categoria: "Programacion", anio: 1994, prestado: true },
  { id: 3, titulo: "Refactoring", categoria: "Programacion", anio: 1999, prestado: false },
  { id: 4, titulo: "Calculus", categoria: "Matematicas", anio: 2010, prestado: false }
];

// Implementación 1: Paradigma IMPERATIVO
function filtrarLibrosImperativo(libros, categoria) {
  // Creamos un array temporal para almacenar los resultados
  let resultado = [];
  
  // Iteramos sobre cada libro usando un for loop
  for (let i = 0; i < libros.length; i++) {
    // Verificamos si el libro cumple las condiciones
    if (libros[i].categoria === categoria && !libros[i].prestado) {
      resultado.push(libros[i]);
    }
  }
  
  // Ordenamos mutando el array con bubble sort manual
  for (let i = 0; i < resultado.length - 1; i++) {
    for (let j = 0; j < resultado.length - i - 1; j++) {
      if (resultado[j].anio > resultado[j + 1].anio) {
        // Intercambiamos elementos mutando el array
        let temp = resultado[j];
        resultado[j] = resultado[j + 1];
        resultado[j + 1] = temp;
      }
    }
  }
  return resultado;
}

// Implementación 2: Paradigma DECLARATIVO
function filtrarLibrosDeclarativo(libros, categoria) {
  return libros
    .filter(libro => libro.categoria === categoria && !libro.prestado)
    .sort((a, b) => a.anio - b.anio);
}
// Pruebas
console.log("=== PARADIGMA IMPERATIVO ===");
console.log(filtrarLibrosImperativo(libros, "Programacion"));

console.log("\n=== PARADIGMA DECLARATIVO ===");
console.log(filtrarLibrosDeclarativo(libros, "Programacion"));

// Ambos deben retornar:
// [
//   { id: 2, titulo: "Design Patterns", anio: 1994 },
//   { id: 3, titulo: "Refactoring", anio: 1999 },
//   { id: 1, titulo: "Clean Code", anio: 2008 }
// ]