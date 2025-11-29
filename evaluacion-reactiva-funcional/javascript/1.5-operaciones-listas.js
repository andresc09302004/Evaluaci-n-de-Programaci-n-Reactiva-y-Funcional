// Ejercicio 1.5: Operaciones con Listas - JavaScript

// Datos de ejemplo
const libros = [
  { id: 1, titulo: "Clean Code", categoria: "Programacion", prestado: false },
  { id: 2, titulo: "Design Patterns", categoria: "Programacion", prestado: true },
  { id: 3, titulo: "Refactoring", categoria: "Programacion", prestado: false },
  { id: 4, titulo: "Calculus I", categoria: "Matematicas", prestado: false },
  { id: 5, titulo: "Linear Algebra", categoria: "Matematicas", prestado: true },
  { id: 6, titulo: "Database Systems", categoria: "Bases de Datos", prestado: false }
];

const prestamos = [
  { id: 1, usuarioId: 1, libroId: 1, activo: false },
  { id: 2, usuarioId: 1, libroId: 2, activo: true },
  { id: 3, usuarioId: 1, libroId: 3, activo: false },
  { id: 4, usuarioId: 2, libroId: 1, activo: false },
  { id: 5, usuarioId: 2, libroId: 2, activo: true },
  { id: 6, usuarioId: 3, libroId: 1, activo: false },
  { id: 7, usuarioId: 3, libroId: 4, activo: true },
  { id: 8, usuarioId: 4, libroId: 5, activo: false }
];

const usuarios = [
  { id: 1, nombre: "Israel Asanza", email: "iasanza@utpl.edu.ec" },
  { id: 2, nombre: "Jorge Beltran", email: "jbeltran@utpl.edu.ec" },
  { id: 3, nombre: "Andres Cuenca", email: "acuenca@utpl.edu.ec" },
  { id: 4, nombre: "Matthew Flores", email: "mflores@utpl.edu.ec" }
];

/**
 * Genera un reporte completo de la biblioteca
 * Usa SOLO: map, filter, reduce, sort, etc.
 */
function generarReporteCompleto(libros, prestamos, usuarios) {
  return {
    // Total de libros por categoria (usando reduce)
    librosPorCategoria: libros.reduce((acumulador, libro) => {
      // Si la categoría ya existe, incrementamos el contador
      // Si no existe, la inicializamos en 1
      acumulador[libro.categoria] = (acumulador[libro.categoria] || 0) + 1;
      return acumulador;
    }, {}),

    // Top 5 usuarios más activos (usando reduce, map y sort)
    usuariosMasActivos: (() => {
      // Contamos préstamos por usuario
      const prestamosPorUsuario = prestamos.reduce((acc, prestamo) => {
        acc[prestamo.usuarioId] = (acc[prestamo.usuarioId] || 0) + 1;
        return acc;
      }, {});
      
      // Convertimos a array y agregamos información del usuario
      return Object.entries(prestamosPorUsuario)
        .map(([usuarioId, cantidadPrestamos]) => {
          const usuario = usuarios.find(u => u.id === parseInt(usuarioId));
          return {
            usuario: usuario.nombre,
            prestamos: cantidadPrestamos
          };
        })
        .sort((a, b) => b.prestamos - a.prestamos) // Ordenamos de mayor a menor
        .slice(0, 5); // Top 5
    })(),

    // Libros más prestados (usando reduce y sort)
    librosMasPrestados: (() => {
      // Contamos cuántas veces se prestó cada libro
      const prestamosPorLibro = prestamos.reduce((acc, prestamo) => {
        acc[prestamo.libroId] = (acc[prestamo.libroId] || 0) + 1;
        return acc;
      }, {});
      
      // Convertimos a array y agregamos información del libro
      return Object.entries(prestamosPorLibro)
        .map(([libroId, cantidad]) => {
          const libro = libros.find(l => l.id === parseInt(libroId));
          return {
            titulo: libro.titulo,
            categoria: libro.categoria,
            vecesPrestado: cantidad
          };
        })
        .sort((a, b) => b.vecesPrestado - a.vecesPrestado) // Ordenamos de mayor a menor
        .slice(0, 10); // Top 10
    })(),

    // Tasa de préstamos activos (calculando porcentaje)
    tasaPrestamosActivos: (() => {
      const prestamosActivos = prestamos.filter(p => p.activo).length;
      const totalPrestamos = prestamos.length;
      const porcentaje = (prestamosActivos / totalPrestamos) * 100;
      return `${porcentaje.toFixed(2)}%`;
    })()
  };
}

// Ejecutar y mostrar el reporte
const reporte = generarReporteCompleto(libros, prestamos, usuarios);

console.log("=== REPORTE COMPLETO DE LA BIBLIOTECA ===\n");

console.log("1. LIBROS POR CATEGORÍA:");
Object.entries(reporte.librosPorCategoria).forEach(([categoria, cantidad]) => {
  console.log(`   ${categoria}: ${cantidad} libros`);
});

console.log("\n2. TOP 5 USUARIOS MÁS ACTIVOS:");
reporte.usuariosMasActivos.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.usuario} - ${item.prestamos} préstamos`);
});

console.log("\n3. LIBROS MÁS PRESTADOS:");
reporte.librosMasPrestados.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.titulo} (${item.categoria}) - ${item.vecesPrestado} veces`);
});

console.log(`\n4. TASA DE PRÉSTAMOS ACTIVOS: ${reporte.tasaPrestamosActivos}`);

/**
 * EXPLICACIÓN DE LAS OPERACIONES FUNCIONALES:
 * 
 * REDUCE:
 * - Usada para agregar datos en un solo valor (objeto o número)
 * - Ejemplo: Contar libros por categoría, sumar totales
 * - Ventaja: Muy flexible, puede hacer lo que map y filter hacen
 * 
 * MAP:
 * - Transforma cada elemento del array en algo nuevo
 * - Ejemplo: Convertir IDs en objetos con más información
 * - Siempre retorna un array del mismo tamaño
 * 
 * FILTER:
 * - Selecciona elementos que cumplen una condición
 * - Ejemplo: Solo préstamos activos
 * - Retorna un array igual o más pequeño
 * 
 * SORT:
 * - Ordena elementos según un criterio
 * - Ejemplo: Ordenar de mayor a menor cantidad de préstamos
 * - IMPORTANTE: sort() muta el array, por eso a veces necesitamos [...array].sort()
 * 
 * VENTAJAS sobre loops:
 * 1. Más legible: El nombre del método indica la intención
 * 2. Menos errores: No hay índices que puedan salirse de rango
 * 3. Componible: Se pueden encadenar operaciones
 * 4. Inmutable: No modificamos el array original (excepto sort)
 * 5. Paralelizable: Pueden optimizarse para ejecución paralela
 */