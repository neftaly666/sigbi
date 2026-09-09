package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamDTO {

    private Integer idExam;

    @NotNull
    @Size(min = 3, max = 20, message = "{name.size}")
    private String nameExam;

    @NotNull
    @Size(min = 3, max = 100, message = "{description.size}")
    private String descriptionExam;

    /*
    @NotEmpty
    @NotBlank

    @Max(value = 100)
    @Min(value = 0)
    private int age;

    @Email
    private String email;

    @Pattern(regexp = "^[a-zA-Z0-9]{5,10}$")
    private String xyz;*/
}
