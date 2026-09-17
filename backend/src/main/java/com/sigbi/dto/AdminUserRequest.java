package com.sigbi.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminUserRequest {

    //Opcional: forzarlo es lo que permite crear el usuario 1 al que apunta data.sql
    private Integer idUser;

    @NotBlank
    @Email
    @Size(max = 60)
    private String email;

    @Size(min = 3, max = 60, message = "{name.size}")
    private String username;

    @NotBlank
    @Size(min = 6, max = 60)
    private String password;

    @NotEmpty
    private List<String> roles;
}
