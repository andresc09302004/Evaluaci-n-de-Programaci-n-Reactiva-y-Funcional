// Ejercicio 1.4: Funciones vs Métodos - Scala
// Autor: [Tu Nombre]
// Fecha: Noviembre 2024

case class Libro(id: Int, titulo: String, autor: String, categoria: String)

// FORMA 1: Como método de una clase
class Biblioteca(libros: List[Libro]) {
  def buscarPorAutor(autor: String): List[Libro] = {
    // El método tiene acceso implícito al estado de la instancia (libros)
    libros.filter(libro => libro.autor == autor)
  }
}

// FORMA 2: Como función pura
object FuncionesBiblioteca {
  def buscarPorAutor(libros: List[Libro], autor: String): List[Libro] = {
    // La función recibe TODOS los datos que necesita como parámetros
    libros.filter(libro => libro.autor == autor)
  }
}

// Demostración de uso
object FuncionesVsMetodos {
  def main(args: Array[String]): Unit = {
    val libros = List(
      Libro(1, "Clean Code", "Robert Martin", "Programacion"),
      Libro(2, "Refactoring", "Martin Fowler", "Programacion"),
      Libro(3, "The Pragmatic Programmer", "Andrew Hunt", "Programacion"),
      Libro(4, "Design Patterns", "Gang of Four", "Programacion"),
      Libro(5, "Domain-Driven Design", "Eric Evans", "Arquitectura")
    )
    
    println("=== USO CON MÉTODO (Clase) ===")
    val biblioteca = new Biblioteca(libros)
    val resultado1 = biblioteca.buscarPorAutor("Robert Martin")
    println(s"Libros encontrados: ${resultado1.length}")
    resultado1.foreach(libro => println(s"  - ${libro.titulo}"))
    
    println("\n=== USO CON FUNCIÓN PURA (Object) ===")
    val resultado2 = FuncionesBiblioteca.buscarPorAutor(libros, "Martin Fowler")
    println(s"Libros encontrados: ${resultado2.length}")
    resultado2.foreach(libro => println(s"  - ${libro.titulo}"))
    
    println("\n=== COMPARACIÓN DE AMBOS ENFOQUES ===")
    val autor = "Robert Martin"
    
    // Con método: necesitas crear una instancia
    val bibliotecaInstancia = new Biblioteca(libros)
    val conMetodo = bibliotecaInstancia.buscarPorAutor(autor)
    
    // Con función: llamas directamente sin instancia
    val conFuncion = FuncionesBiblioteca.buscarPorAutor(libros, autor)
    
    println(s"¿Ambos dan el mismo resultado? ${conMetodo == conFuncion}")
  }
}

/**
 * ANÁLISIS COMPARATIVO:
 * 
 * ¿Cuál es la diferencia conceptual?
 * 
 * MÉTODO (Clase):
 * - Está asociado a una instancia de objeto
 * - Tiene acceso implícito al estado del objeto (campo libros)
 * - Encapsula datos y comportamiento juntos (OOP)
 * - Requiere crear una instancia: new Biblioteca(libros)
 * - Sintaxis: biblioteca.buscarPorAutor("autor")
 * - El estado (libros) está "oculto" dentro del objeto
 * 
 * FUNCIÓN PURA (Object):
 * - Es independiente, no pertenece a ninguna instancia
 * - Recibe TODOS los datos que necesita como parámetros explícitos
 * - Separa datos de comportamiento (FP)
 * - No requiere instancias, se llama directamente
 * - Sintaxis: FuncionesBiblioteca.buscarPorAutor(libros, "autor")
 * - Todas las dependencias son explícitas y visibles
 * 
 * ¿Cuándo usar métodos vs funciones puras?
 * 
 * USA MÉTODOS (Clases) cuando:
 * ✓ Necesitas mantener estado mutable (aunque no es recomendado en FP)
 * ✓ Tienes comportamiento fuertemente acoplado a datos específicos
 * ✓ Quieres encapsulación y ocultamiento de información
 * ✓ Trabajas en un contexto orientado a objetos
 * ✓ Necesitas herencia y polimorfismo
 * ✓ El estado del objeto cambia con el tiempo (ej: carrito de compras)
 * 
 * Ejemplo apropiado para métodos:
 * class CarritoCompras(var items: List[Item]) {
 *   def agregarItem(item: Item): Unit = {
 *     items = items :+ item  // Muta el estado
 *   }
 *   def total(): Double = items.map(_.precio).sum
 * }
 * 
 * USA FUNCIONES PURAS cuando:
 * ✓ Quieres máxima testabilidad y composición
 * ✓ No necesitas mantener estado
 * ✓ Quieres funciones que se puedan pasar como valores (higher-order functions)
 * ✓ Buscas paralelización y concurrencia sin problemas
 * ✓ La lógica es independiente del contexto
 * ✓ Quieres reutilización máxima
 * 
 * Ejemplo apropiado para funciones:
 * object CalculadoraPrecios {
 *   def calcularTotal(items: List[Item]): Double = items.map(_.precio).sum
 *   def aplicarDescuento(total: Double, porcentaje: Double): Double = 
 *     total * (1 - porcentaje)
 * }
 * 
 * ¿Cuál facilita más el testing y por qué?
 * 
 * LAS FUNCIONES PURAS facilitan más el testing porque:
 * 
 * 1. NO REQUIEREN SETUP:
 *    
 *    Test con MÉTODO (más complejo):
 *    test("buscar por autor con método") {
 *      val libros = List(
 *        Libro(1, "Clean Code", "Robert Martin", "Prog")
 *      )
 *      val biblioteca = new Biblioteca(libros)  // ← Setup necesario
 *      val resultado = biblioteca.buscarPorAutor("Robert Martin")
 *      assert(resultado.length == 1)
 *    }
 *    
 *    Test con FUNCIÓN (más simple):
 *    test("buscar por autor con función") {
 *      val libros = List(
 *        Libro(1, "Clean Code", "Robert Martin", "Prog")
 *      )
 *      val resultado = FuncionesBiblioteca.buscarPorAutor(libros, "Robert Martin")
 *      assert(resultado.length == 1)
 *    }
 * 
 * 2. SON MÁS EXPLÍCITAS:
 *    - En el método, 'libros' está oculto en el objeto
 *    - En la función, 'libros' es un parámetro explícito
 *    - Puedes ver TODAS las dependencias en la firma de la función
 *    - No hay "sorpresas" de estado oculto
 * 
 * 3. SIN ESTADO COMPARTIDO:
 *    - Los métodos pueden mutar el estado del objeto
 *    - Esto puede causar efectos secundarios entre tests
 *    - Las funciones puras garantizan que no hay mutación
 *    - Cada test es completamente independiente
 * 
 * 4. COMPOSICIÓN MÁS FÁCIL:
 *    
 *    Con funciones puras:
 *    val librosRecientes = filtrarPorAnio(libros, 2020)
 *    val librosProgramacion = filtrarPorCategoria(librosRecientes, "Programacion")
 *    val ordenados = ordenarPorTitulo(librosProgramacion)
 *    
 *    O encadenado:
 *    val resultado = 
 *      ordenarPorTitulo(
 *        filtrarPorCategoria(
 *          filtrarPorAnio(libros, 2020),
 *          "Programacion"
 *        )
 *      )
 *    
 *    Con métodos:
 *    val biblioteca = new Biblioteca(libros)
 *    val recientes = biblioteca.filtrarPorAnio(2020)
 *    // ¿Cómo continúas? ¿Creas otra instancia?
 * 
 * 5. MOCKING INNECESARIO:
 *    
 *    Con métodos:
 *    - Necesitas mockear el objeto Biblioteca
 *    - Necesitas configurar el estado interno
 *    - Más código de setup
 *    
 *    Con funciones:
 *    - Solo pasas los datos que necesitas testear
 *    - No necesitas mocks
 *    - Código de test más simple
 * 
 * 6. TESTS PARALELOS:
 *    - Funciones puras no tienen estado compartido
 *    - Puedes ejecutar todos los tests en paralelo sin problemas
 *    - Con métodos y estado mutable, pueden haber race conditions
 * 
 * EJEMPLO COMPARATIVO COMPLETO:
 * 
 * // Test suite con MÉTODOS (más complejo)
 * class BibliotecaTest extends AnyFlatSpec {
 *   val libros = List(
 *     Libro(1, "Clean Code", "Robert Martin", "Prog"),
 *     Libro(2, "Refactoring", "Martin Fowler", "Prog")
 *   )
 *   
 *   "Biblioteca" should "buscar por autor" in {
 *     val biblioteca = new Biblioteca(libros)  // Setup
 *     val resultado = biblioteca.buscarPorAutor("Robert Martin")
 *     assert(resultado.length == 1)
 *     assert(resultado.head.titulo == "Clean Code")
 *   }
 *   
 *   it should "retornar lista vacía si no encuentra" in {
 *     val biblioteca = new Biblioteca(libros)  // Setup duplicado
 *     val resultado = biblioteca.buscarPorAutor("Desconocido")
 *     assert(resultado.isEmpty)
 *   }
 * }
 * 
 * // Test suite con FUNCIONES (más simple)
 * class FuncionesBibliotecaTest extends AnyFlatSpec {
 *   val libros = List(
 *     Libro(1, "Clean Code", "Robert Martin", "Prog"),
 *     Libro(2, "Refactoring", "Martin Fowler", "Prog")
 *   )
 *   
 *   "buscarPorAutor" should "buscar por autor" in {
 *     val resultado = FuncionesBiblioteca.buscarPorAutor(libros, "Robert Martin")
 *     assert(resultado.length == 1)
 *     assert(resultado.head.titulo == "Clean Code")
 *   }
 *   
 *   it should "retornar lista vacía si no encuentra" in {
 *     val resultado = FuncionesBiblioteca.buscarPorAutor(libros, "Desconocido")
 *     assert(resultado.isEmpty)
 *   }
 * }
 * 
 * VENTAJAS ADICIONALES DE FUNCIONES PURAS:
 * 
 * 1. RAZONAMIENTO LOCAL:
 *    - Para entender qué hace la función, solo miras su código
 *    - No necesitas conocer el estado del objeto
 *    
 * 2. REFACTORING SEGURO:
 *    - Puedes cambiar la implementación libremente
 *    - Mientras la firma sea igual, todo sigue funcionando
 *    
 * 3. DOCUMENTACIÓN CLARA:
 *    - La firma de la función ES la documentación
 *    - buscarPorAutor(libros: List[Libro], autor: String): List[Libro]
 *    - Sabes exactamente qué entra y qué sale
 *    
 * 4. INMUTABILIDAD:
 *    - Las funciones puras típicamente trabajan con datos inmutables
 *    - Esto previene bugs sutiles de mutación
 * 
 * CONCLUSIÓN:
 * 
 * Para programación funcional y testing:
 * → Funciones puras son SUPERIORES
 * 
 * Para modelado de objetos con estado:
 * → Métodos pueden ser más apropiados
 * 
 * En este caso de uso (biblioteca):
 * → Funciones puras son la mejor opción porque:
 *    - No necesitamos estado mutable
 *    - Queremos máxima testabilidad
 *    - Queremos composición fácil
 *    - Queremos paralelización sin problemas
 */