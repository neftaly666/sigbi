package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientDTO {

    private Integer idPatient;

    @NotBlank
    @Size(min = 3, max = 70, message = "{name.size}")
    private String firstName;

    @NotBlank
    @Size(min = 3, max = 70, message = "{name.size}")
    private String lastName;

    @NotBlank
    @Size(min = 8, max = 8)
    private String dni;

    @Size(max = 150)
    private String address;

    @NotBlank
    @Size(max = 9)
    private String phone;

    @NotBlank
    @Email
    @Size(max = 55)
    private String email;
}
