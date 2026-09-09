package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SpecialtyDTO {

    private Integer idSpecialty;

    @NotBlank
    @Size(min = 3, max = 50, message = "{name.size}")
    private String nameSpecialty;

    @NotBlank
    @Size(min = 3, max = 150, message = "{description.size}")
    private String descriptionSpecialty;
}
