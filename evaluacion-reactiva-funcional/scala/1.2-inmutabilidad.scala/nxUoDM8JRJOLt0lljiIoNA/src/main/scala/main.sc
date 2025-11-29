// Ejercicio 1.2: Inmutabilidad - Scala
// Autor: [Tu Nombre]
// Fecha: Noviembre 2024

case class Prestamo(
  id: Int,
  usuarioId: Int,
  libroId: Int,
  activo: Boolean,
  fechaPrestamo: String
)

/**
 * Devuelve un libro (marca el préstamo como inactivo)
 * SIN mutar la lista original de préstamos
 */
def devolverLibro(prestamos: List[Prestamo], prestamoId: Int): List[Prestamo] = {
  // Usamos map para transformar cada elemento
  // Si el id coincide, creamos un NUEVO préstamo con activo = false
  // Si no coincide, retornamos el préstamo sin cambios
  prestamos.map { prestamo =>
    if (prestamo.id == prestamoId) {
      // copy() crea una nueva instancia inmutable con los cambios especificados
      prestamo.copy(activo = false)
    } else {
      prestamo
    }
  }
}

// Ejemplo de uso
object InmutabilidadDemo {
  def main(args: Array[String]): Unit = {
    val prestamos = List(
      Prestamo(1, 101, 201, true, "2024-01-15"),
      Prestamo(2, 102, 202, true, "2024-01-20"),
      Prestamo(3, 103, 203, true, "2024-01-25")
    )
    
    println("=== LISTA ORIGINAL ===")
    prestamos.foreach(println)
    
    // Devolvemos el libro del préstamo 1
    val prestamosActualizados = devolverLibro(prestamos, 1)
    
    println("\n=== LISTA ACTUALIZADA ===")
    prestamosActualizados.foreach(println)
    
    println("\n=== VERIFICACIÓN DE INMUTABILIDAD ===")
    println("La lista original NO cambió:")
    prestamos.foreach(println)
    
    // Verificación: el préstamo 1 en la lista original sigue activo
    println(s"\nPréstamo 1 en lista original está activo: ${prestamos.find(_.id == 1).get.activo}")
    println(s"Préstamo 1 en lista actualizada está activo: ${prestamosActualizados.find(_.id == 1).get.activo}")
  }
}

/**
 * EXPLICACIÓN DE INMUTABILIDAD:
 * 
 * 1. NO mutamos la lista original: usamos map() que retorna una NUEVA lista
 * 2. NO mutamos los objetos Prestamo: usamos copy() que crea NUEVAS instancias
 * 3. Los datos originales permanecen intactos, útil para:
 *    - Debugging: podemos comparar estado anterior y posterior
 *    - Threading: múltiples threads pueden leer sin locks
 *    - Testing: comportamiento predecible y reproducible
 */