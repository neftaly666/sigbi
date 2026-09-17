package com.sigbi.repo;

import com.sigbi.model.Book;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IBookRepo extends IGenericRepo<Book, Integer> {

    //RN-02
    Optional<Book> findByIsbn(String isbn);

    //RN-11: cuántos libros impiden borrar una categoría
    long countByCategoryIdCategory(Integer idCategory);

    //Conteo por categoría en una sola consulta, para no lanzar una por fila del
    //listado. El nombre derivado no expresa un GROUP BY, así que aquí si toca @Query.
    @Query("SELECT b.category.idCategory, COUNT(b) FROM Book b GROUP BY b.category.idCategory")
    List<Object[]> countGroupedByCategory();
}
