package com.sigbi.tool;

import com.sigbi.model.Book;
import com.sigbi.service.IBookService;
import com.sigbi.service.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Herramientas del asistente sobre el catalogo. RF-14: acceso de **solo lectura**.
 * Aquí no hay ningún método que escriba, y esa ausencia es la garantia: el modelo no
 * puede registrar nada porque no se le ofrece con que.
 *
 * Los filtros se resuelven en memoria sobre findAll(). Con un catálogo de dos cifras es
 * una consulta y un stream; añadir métodos de búsqueda al repositorio solo para esto
 * sería mover complejidad al dominio sin ganar nada.
 */
@Component
@RequiredArgsConstructor
public class CatalogTool {

    //Tope de filas que se le devuelven al modelo: más que esto no cabe en una respuesta útil
    private static final int MAXIMO = 25;

    private final IBookService bookService;
    private final ICategoryService categoryService;

    //Vista plana de un libro. El modelo no necesita identificadores y con ellos tiende a
    //citarlos en la respuesta.
    public record LibroInfo(String titulo, String autor, String isbn, String categoria, String disponibilidad) {}

    public record CategoriaInfo(String nombre, String descripcion, String estado, long libros) {}

    @Tool(name = "listarLibros",
          description = "Lista los libros del catalogo, con su autor, categoria y si estan disponibles o reservados")
    public List<LibroInfo> listarLibros() throws Exception {
        return bookService.findAll().stream().map(this::aInfo).limit(MAXIMO).toList();
    }

    @Tool(name = "buscarLibros",
          description = "Busca libros cuyo titulo o autor contenga el texto indicado")
    public List<LibroInfo> buscarLibros(String texto) throws Exception {
        String aguja = texto == null ? "" : texto.toLowerCase().trim();

        return bookService.findAll().stream()
                .filter(libro -> libro.getTitle().toLowerCase().contains(aguja)
                        || libro.getAuthor().toLowerCase().contains(aguja))
                .map(this::aInfo)
                .limit(MAXIMO)
                .toList();
    }

    @Tool(name = "buscarLibrosPorCategoria",
          description = "Lista los libros de una categoria, buscandola por su nombre. Si se indica soloDisponibles, omite los que estan reservados")
    public List<LibroInfo> buscarLibrosPorCategoria(String categoria, boolean soloDisponibles) throws Exception {
        String aguja = categoria == null ? "" : categoria.toLowerCase().trim();

        return bookService.findAll().stream()
                .filter(libro -> libro.getCategory() != null
                        && libro.getCategory().getName().toLowerCase().contains(aguja))
                .filter(libro -> !soloDisponibles || Boolean.TRUE.equals(libro.getAvailable()))
                .map(this::aInfo)
                .limit(MAXIMO)
                .toList();
    }

    @Tool(name = "listarLibrosDisponibles",
          description = "Lista solo los libros que ahora mismo se pueden reservar, es decir los que no estan prestados")
    public List<LibroInfo> listarLibrosDisponibles() throws Exception {
        return bookService.findAll().stream()
                .filter(libro -> Boolean.TRUE.equals(libro.getAvailable()))
                .map(this::aInfo)
                .limit(MAXIMO)
                .toList();
    }

    @Tool(name = "listarCategorias",
          description = "Lista las categorias del catalogo con cuantos libros tiene cada una y si estan activas")
    public List<CategoriaInfo> listarCategorias() throws Exception {
        Map<Integer, Long> conteos = categoryService.bookCountByCategory();

        return categoryService.findAll().stream()
                .map(categoria -> new CategoriaInfo(
                        categoria.getName(),
                        categoria.getDescription(),
                        Boolean.TRUE.equals(categoria.getStatus()) ? "Activa" : "Inactiva",
                        conteos.getOrDefault(categoria.getIdCategory(), 0L)))
                .sorted(Comparator.comparing(CategoriaInfo::nombre))
                .toList();
    }

    private LibroInfo aInfo(Book libro) {
        return new LibroInfo(
                libro.getTitle(),
                libro.getAuthor(),
                libro.getIsbn(),
                libro.getCategory() != null ? libro.getCategory().getName() : "Sin categoria",
                //Los dos únicos estados, con los rótulos que usa la interfaz (AN050 sección 4.1)
                Boolean.TRUE.equals(libro.getAvailable()) ? "Disponible" : "Reservado");
    }
}
