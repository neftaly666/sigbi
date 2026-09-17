package com.sigbi.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookDTO {

    private Integer idBook;

    @NotBlank
    @Size(min = 1, max = 150, message = "{book.title.size}")
    private String title;

    @NotBlank
    @Size(min = 1, max = 100, message = "{book.author.size}")
    private String author;

    @NotBlank
    @Size(min = 10, max = 13, message = "{book.isbn.size}")
    private String isbn;

    @NotNull(message = "{book.available.required}")
    private Boolean available;

    //La relación viaja como identificador, no como objeto anidado.
    @NotNull(message = "{book.category.required}")
    private Integer idCategory;

    //Solo lectura: evita que la tabla de libros pida la categoría aparte.
    private String categoryName;
}
