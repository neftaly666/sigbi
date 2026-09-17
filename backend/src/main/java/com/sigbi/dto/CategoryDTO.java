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
public class CategoryDTO {

    private Integer idCategory;

    @NotBlank
    @Size(min = 3, max = 60, message = "{category.name.size}")
    private String name;

    @NotBlank
    @Size(min = 3, max = 150, message = "{category.description.size}")
    private String description;

    @NotNull(message = "{category.status.required}")
    private Boolean status;

    //Solo lectura: lo calcula el servicio. Alimenta la columna LIBROS de la
    //pantalla de categorías y el mensaje de RN-11. Si llega en un POST, se ignora.
    private Long bookCount;
}
