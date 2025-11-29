// Ejercicio 2.2: Composición de Funciones - Scala

case class Libro(
  id: Int,
  titulo: String,
  precio: Double,
  descuento: Double = 0,
  impuesto: Double = 0
)

object ComposicionFunciones {
  
  // Define funciones de transformación
  
  /**
   * Aplica 15% de descuento al precio del libro
   */
  val aplicarDescuento: Libro => Libro = libro => {
    val precioConDescuento = libro.precio * 0.85 // 15% de descuento
    libro.copy(
      precio = precioConDescuento,
      descuento = libro.precio - precioConDescuento
    )
  }
  
  /**
   * Aplica 12% de IVA sobre el precio actual (con descuento)
   */
  val aplicarImpuesto: Libro => Libro = libro => {
    val iva = libro.precio * 0.12 // 12% de IVA
    libro.copy(
      precio = libro.precio + iva,
      impuesto = iva
    )
  }
  
  /**
   * Redondea el precio final a 2 decimales
   */
  val redondearPrecio: Libro => Libro = libro => {
    libro.copy(
      precio = BigDecimal(libro.precio).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble,
      descuento = BigDecimal(libro.descuento).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble,
      impuesto = BigDecimal(libro.impuesto).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble
    )
  }
  
  // Usa composición de funciones con andThen
  // andThen aplica las funciones de izquierda a derecha: f andThen g = g(f(x))
  val procesarPrecioFinal: Libro => Libro = 
    aplicarDescuento andThen aplicarImpuesto andThen redondearPrecio
  
  // También podríamos usar compose (aplica de derecha a izquierda)
  // val procesarPrecioFinal2 = redondearPrecio compose aplicarImpuesto compose aplicarDescuento
  
  def main(args: Array[String]): Unit = {
    println("=== COMPOSICIÓN DE FUNCIONES ===\n")
    
    val libros = List(
      Libro(1, "Clean Code", 45.99),
      Libro(2, "Refactoring", 39.99),
      Libro(3, "Design Patterns", 52.50),
      Libro(4, "The Pragmatic Programmer", 48.00)
    )
    
    println("LIBROS ORIGINALES:")
    libros.foreach { libro =>
      println(f"  ${libro.titulo}%-30s: $$${libro.precio}%.2f")
    }
    
    // Aplicamos la composición a cada libro
    val librosConPrecioFinal = libros.map(procesarPrecioFinal)
    
    println("\nLIBROS CON PRECIO FINAL (Descuento 15% + IVA 12%):")
    librosConPrecioFinal.foreach { libro =>
      println(f"  ${libro.titulo}%-30s")
      println(f"    Precio original: $$${libro.precio + libro.descuento - libro.impuesto}%.2f")
      println(f"    Descuento (15%%): -$$${libro.descuento}%.2f")
      println(f"    Subtotal: $$${libro.precio - libro.impuesto}%.2f")
      println(f"    IVA (12%%): +$$${libro.impuesto}%.2f")
      println(f"    PRECIO FINAL: $$${libro.precio}%.2f")
      println()
    }
    
    // Demostración de que cada función es independiente y reutilizable
    println("=== APLICACIÓN INDIVIDUAL DE FUNCIONES ===\n")
    val libroEjemplo = Libro(1, "Test Book", 100.00)
    
    println(s"Libro original: ${libroEjemplo.precio}")
    
    val conDescuento = aplicarDescuento(libroEjemplo)
    println(f"Después de descuento: $$${conDescuento.precio}%.2f (ahorras $$${conDescuento.descuento}%.2f)")
    
    val conImpuesto = aplicarImpuesto(conDescuento)
    println(f"Después de IVA: $$${conImpuesto.precio}%.2f (IVA: $$${conImpuesto.impuesto}%.2f)")
    
    val redondeado = redondearPrecio(conImpuesto)
    println(f"Después de redondeo: $$${redondeado.precio}%.2f")
    
    // Comparamos con la composición
    val conComposicion = procesarPrecioFinal(libroEjemplo)
    println(f"Con composición (todo junto): $$${conComposicion.precio}%.2f")
    
    println("\n=== VENTAJA DE LA COMPOSICIÓN ===")
    println("Podemos cambiar fácilmente el orden o agregar nuevas transformaciones:")
    
    // Nueva función: aplicar envío gratis si el precio supera $80
    val aplicarEnvioGratis: Libro => Libro = libro => {
      if (libro.precio > 80.0) {
        println(f"  ¡Envío gratis! (precio: $$${libro.precio}%.2f > $$80.00)")
        libro
      } else {
        val costoEnvio = 5.00
        println(f"  Costo de envío: $$${costoEnvio}%.2f")
        libro.copy(precio = libro.precio + costoEnvio)
      }
    }
    
    // Creamos una nueva composición que incluye el envío
    val procesarConEnvio = aplicarDescuento andThen 
                          aplicarImpuesto andThen 
                          redondearPrecio andThen 
                          aplicarEnvioGratis
    
    println("\nProcesando libro con envío:")
    val libroConEnvio = procesarConEnvio(Libro(5, "Algorithm Design", 75.00))
    println(f"Precio final con envío: $$${libroConEnvio.precio}%.2f")
  }
}

/**
 * ANÁLISIS DE COMPOSICIÓN DE FUNCIONES:
 * 
 * ¿Qué ventaja tiene la composición vs un solo método grande?
 * 
 * COMPOSICIÓN (funciones pequeñas combinadas):
 * ✓ Cada función tiene una sola responsabilidad (Single Responsibility Principle)
 * ✓ Puedes reutilizar cada función individualmente
 * ✓ Puedes cambiar el orden fácilmente
 * ✓ Puedes agregar o quitar transformaciones sin tocar otras
 * ✓ Más fácil de entender: cada función es simple
 * ✓ Puedes crear diferentes combinaciones para diferentes casos
 * 
 * MÉTODO GRANDE (todo en uno):
 * ✗ Difícil de modificar sin romper otras cosas
 * ✗ No puedes reutilizar partes individuales
 * ✗ Difícil de testear cada parte por separado
 * ✗ Viola el principio de responsabilidad única
 * ✗ Código duplicado si necesitas variantes
 * 
 * Ejemplo de método grande (antipatrón):
 * 
 * def procesarPrecioFinal(libro: Libro): Libro = {
 *   val precioConDescuento = libro.precio * 0.85
 *   val descuento = libro.precio - precioConDescuento
 *   val iva = precioConDescuento * 0.12
 *   val precioConIva = precioConDescuento + iva
 *   val precioRedondeado = BigDecimal(precioConIva).setScale(2, ...).toDouble
 *   libro.copy(precio = precioRedondeado, descuento = descuento, impuesto = iva)
 * }
 * 
 * Problemas:
 * - ¿Qué pasa si solo quieres aplicar descuento? Tienes que copiar código
 * - ¿Qué pasa si quieres cambiar el orden? Tienes que reescribir todo
 * - ¿Cómo testeas solo la parte del IVA? No puedes sin ejecutar todo
 * 
 * ¿Cómo facilita el testing?
 * 
 * 1. TESTS UNITARIOS INDEPENDIENTES:
 *    test("aplicar descuento reduce el precio en 15%") {
 *      val libro = Libro(1, "Test", 100.0)
 *      val resultado = aplicarDescuento(libro)
 *      assert(resultado.precio == 85.0)
 *      assert(resultado.descuento == 15.0)
 *    }
 *    
 *    test("aplicar IVA incrementa el precio en 12%") {
 *      val libro = Libro(1, "Test", 100.0)
 *      val resultado = aplicarImpuesto(libro)
 *      assert(resultado.precio == 112.0)
 *    }
 *    
 * 2. TESTS DE COMPOSICIÓN:
 *    test("composición aplica transformaciones en orden correcto") {
 *      val libro = Libro(1, "Test", 100.0)
 *      val resultado = procesarPrecioFinal(libro)
 *      // 100 * 0.85 = 85 (descuento)
 *      // 85 * 1.12 = 95.2 (IVA)
 *      assert(resultado.precio == 95.20)
 *    }
 *    
 * 3. TESTS DE AISLAMIENTO:
 *    Cada función se testea independientemente
 *    Si falla un test, sabes exactamente qué función tiene el bug
 *    
 * 4. MOCKING MÁS FÁCIL:
 *    Puedes reemplazar funciones individuales en la composición para testing
 *    
 * En resumen:
 * - Composición = Testing fácil, mantenible, reutilizable, flexible
 * - Método grande = Testing difícil, frágil, no reutilizable, rígido
 */