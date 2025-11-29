// Ejercicio 2.4: Tuplas y Análisis Funcional - Scala

case class Prestamo(
  id: Int,
  libroId: Int,
  usuarioId: Int,
  fechaPrestamo: String,
  activo: Boolean
)

object TuplasAnalisis {
  
  /**
   * Retorna estadísticas de un usuario usando tuplas
   * Tupla: (totalPrestamos, prestamosActivos, promedioLibrosPorMes)
   */
  def obtenerEstadisticasUsuario(
    prestamos: List[Prestamo],
    usuarioId: Int
  ): (Int, Int, Double) = {
    
    // Filtrar préstamos del usuario específico
    val prestamosUsuario = prestamos.filter(_.usuarioId == usuarioId)
    
    // Total de préstamos
    val totalPrestamos = prestamosUsuario.length
    
    // Préstamos activos
    val prestamosActivos = prestamosUsuario.count(_.activo)
    
    // Calcular promedio de libros por mes
    val promedioLibrosPorMes = if (prestamosUsuario.isEmpty) {
      0.0
    } else {
      // Obtener todas las fechas y calcular el rango de meses
      val fechas = prestamosUsuario.map(_.fechaPrestamo)
      
      // Parsear fechas para obtener año y mes
      val meses = fechas.map { fecha =>
        val partes = fecha.split("-")
        val anio = partes(0).toInt
        val mes = partes(1).toInt
        (anio, mes)
      }.distinct // Meses únicos
      
      val cantidadMeses = meses.length
      
      if (cantidadMeses == 0) 0.0
      else totalPrestamos.toDouble / cantidadMeses.toDouble
    }
    
    // Retornar la tupla con las tres estadísticas
    (totalPrestamos, prestamosActivos, promedioLibrosPorMes)
  }
  
  /**
   * Versión alternativa usando foldLeft para calcular todo en una pasada
   */
  def obtenerEstadisticasUsuarioOptimizado(
    prestamos: List[Prestamo],
    usuarioId: Int
  ): (Int, Int, Double) = {
    
    val prestamosUsuario = prestamos.filter(_.usuarioId == usuarioId)
    
    if (prestamosUsuario.isEmpty) {
      (0, 0, 0.0)
    } else {
      // Usar foldLeft para calcular total y activos en una sola pasada
      val (total, activos) = prestamosUsuario.foldLeft((0, 0)) {
        case ((totalAcc, activosAcc), prestamo) =>
          val nuevoTotal = totalAcc + 1
          val nuevosActivos = if (prestamo.activo) activosAcc + 1 else activosAcc
          (nuevoTotal, nuevosActivos)
      }
      
      // Calcular meses únicos
      val mesesUnicos = prestamosUsuario
        .map(p => p.fechaPrestamo.substring(0, 7)) // "YYYY-MM"
        .distinct
        .length
      
      val promedio = if (mesesUnicos > 0) total.toDouble / mesesUnicos.toDouble else 0.0
      
      (total, activos, promedio)
    }
  }
  
  /**
   * Función auxiliar para mostrar estadísticas de forma legible
   */
  def mostrarEstadisticas(usuarioId: Int, stats: (Int, Int, Double)): Unit = {
    val (total, activos, promedio) = stats // Desestructuración de tupla
    println(s"Usuario ID: $usuarioId")
    println(s"  Total de préstamos: $total")
    println(s"  Préstamos activos: $activos")
    println(s"  Préstamos completados: ${total - activos}")
    println(f"  Promedio de libros por mes: $promedio%.2f")
    println()
  }
  
  def main(args: Array[String]): Unit = {
    println("=== ANÁLISIS CON TUPLAS ===\n")
    
    val prestamos = List(
      Prestamo(1, 101, 1, "2024-01-15", false),
      Prestamo(2, 102, 1, "2024-02-10", true),
      Prestamo(3, 103, 1, "2024-03-05", true),
      Prestamo(4, 104, 1, "2024-03-20", false),
      Prestamo(5, 105, 1, "2024-04-02", true),
      
      Prestamo(6, 101, 2, "2024-01-20", false),
      Prestamo(7, 102, 2, "2024-01-25", false),
      Prestamo(8, 103, 2, "2024-02-15", true),
      
      Prestamo(9, 104, 3, "2024-03-10", true),
      Prestamo(10, 105, 3, "2024-03-15", true),
      Prestamo(11, 106, 3, "2024-03-18", true)
    )
    
    // Obtener estadísticas para usuario 1
    val stats1 = obtenerEstadisticasUsuario(prestamos, 1)
    mostrarEstadisticas(1, stats1)
    
    // También podemos desestructurar directamente
    val (total1, activos1, promedio1) = obtenerEstadisticasUsuario(prestamos, 1)
    println(s"Usuario 1 tiene $activos1 préstamos activos de un total de $total1")
    println()
    
    // Estadísticas para usuario 2
    val stats2 = obtenerEstadisticasUsuario(prestamos, 2)
    mostrarEstadisticas(2, stats2)
    
    // Estadísticas para usuario 3
    val stats3 = obtenerEstadisticasUsuario(prestamos, 3)
    mostrarEstadisticas(3, stats3)
    
    // Comparar con versión optimizada
    println("=== VERIFICACIÓN DE VERSIÓN OPTIMIZADA ===\n")
    val stats1Opt = obtenerEstadisticasUsuarioOptimizado(prestamos, 1)
    println(s"¿Son iguales? ${stats1 == stats1Opt}")
    
    // Análisis de múltiples usuarios usando map
    println("=== ANÁLISIS DE TODOS LOS USUARIOS ===\n")
    val todosUsuarios = prestamos.map(_.usuarioId).distinct.sorted
    
    val estadisticasTodos = todosUsuarios.map { uid =>
      (uid, obtenerEstadisticasUsuario(prestamos, uid))
    }
    
    estadisticasTodos.foreach { case (uid, stats) =>
      mostrarEstadisticas(uid, stats)
    }
    
    // Encontrar usuario más activo usando tuplas
    println("=== USUARIO MÁS ACTIVO ===")
    val usuarioMasActivo = estadisticasTodos
      .maxBy { case (_, (total, _, _)) => total } // maxBy usando tupla
    
    val (uidActivo, (totalActivo, _, promedioActivo)) = usuarioMasActivo
    println(s"El usuario más activo es: $uidActivo")
    println(f"  Con $totalActivo préstamos y promedio de $promedioActivo%.2f libros/mes")
  }
}

/**
 * EXPLICACIÓN DE TUPLAS EN SCALA:
 * 
 * ¿Qué son las tuplas?
 * - Colecciones inmutables de elementos de diferentes tipos
 * - Útiles para retornar múltiples valores desde una función
 * - Se declaran con paréntesis: (valor1, valor2, valor3)
 * - Los tipos pueden ser diferentes: (Int, String, Double, Boolean)
 * 
 * Ventajas de usar tuplas:
 * 
 * 1. RETORNAR MÚLTIPLES VALORES sin crear una clase:
 *    def stats(): (Int, Int, Double) = (10, 5, 2.5)
 *    // En lugar de crear: case class Stats(total: Int, activos: Int, promedio: Double)
 *    
 * 2. DESESTRUCTURACIÓN ELEGANTE:
 *    val (total, activos, promedio) = obtenerEstadisticas(...)
 *    // Accedes directamente a cada valor con nombres significativos
 *    
 * 3. INMUTABILIDAD GARANTIZADA:
 *    Las tuplas son inmutables por defecto
 *    
 * 4. PATTERN MATCHING:
 *    estadisticas match {
 *      case (0, _, _) => "Sin préstamos"
 *      case (_, 0, _) => "Sin préstamos activos"
 *      case (t, a, p) => s"$t préstamos, $a activos, promedio $p"
 *    }
 *    
 * 5. USO EN HIGHER-ORDER FUNCTIONS:
 *    lista.map { case (id, datos) => procesar(id, datos) }
 *    
 * Acceso a elementos de tuplas:
 * - Por índice (1-based): tupla._1, tupla._2, tupla._3
 * - Por desestructuración: val (a, b, c) = tupla
 * - En pattern matching: case (a, b, c) => ...
 * 
 * Limitaciones:
 * - Máximo 22 elementos (aunque rara vez necesitas más)
 * - Nombres de acceso poco descriptivos (_1, _2): mejor usar desestructuración
 * - Para estructuras complejas, mejor usar case classes
 * 
 * ¿Cuándo usar tuplas vs case classes?
 * 
 * USA TUPLAS cuando:
 * ✓ Retornas 2-4 valores relacionados temporalmente
 * ✓ Los valores son obvios por contexto
 * ✓ No necesitas nombres de campos
 * ✓ Es código interno, no API pública
 * 
 * USA CASE CLASSES cuando:
 * ✓ La estructura tiene muchos campos (5+)
 * ✓ Los campos necesitan nombres descriptivos
 * ✓ La estructura es parte de tu dominio
 * ✓ Es API pública
 * ✓ Necesitas métodos adicionales
 * 
 * Ejemplo de cuándo NO usar tuplas:
 * 
 * // MAL: Muchos campos, no es claro qué es cada uno
 * def getDatos(): (Int, String, Double, Boolean, String, Int) = ...
 * 
 * // BIEN: Case class con nombres descriptivos
 * case class DatosUsuario(
 *   id: Int,
 *   nombre: String,
 *   saldo: Double,
 *   activo: Boolean,
 *   email: String,
 *   edad: Int
 * )
 * def getDatos(): DatosUsuario = ...
 * 
 * Operaciones funcionales con tuplas:
 * 
 * // Filtrar por el primer elemento de la tupla
 * lista.filter { case (id, _) => id > 10 }
 * 
 * // Mapear transformando ambos elementos
 * lista.map { case (x, y) => (x * 2, y + 1) }
 * 
 * // Reducir con tuplas como acumulador
 * lista.foldLeft((0, 0.0)) { case ((count, sum), valor) =>
 *   (count + 1, sum + valor)
 * }
 * 
 * En resumen:
 * - Tuplas son perfectas para retornos simples de múltiples valores
 * - Facilitan código funcional limpio y expresivo
 * - Desestructuración las hace muy legibles
 * - Para estructuras complejas, usa case classes
 */