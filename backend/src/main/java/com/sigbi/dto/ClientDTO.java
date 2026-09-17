package com.sigbi.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sirve de contrato del recurso y, con NON_NULL, también de resumen anidado
 * dentro de una reserva: alli solo se rellenan id, nombres y apellidos, y el
 * resto de campos no aparece en el JSON (AN010 sección 6.3.1).
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClientDTO {

    private Integer idClient;

    @NotBlank
    @Size(min = 1, max = 70, message = "{client.firstName.size}")
    private String firstName;

    @NotBlank
    @Size(min = 1, max = 70, message = "{client.lastName.size}")
    private String lastName;

    @NotBlank
    @Pattern(regexp = "\\d{8}", message = "{client.dni.pattern}")
    private String dni;

    @NotBlank
    @Email(message = "{client.email.format}")
    @Size(max = 55, message = "{client.email.size}")
    private String email;
}
