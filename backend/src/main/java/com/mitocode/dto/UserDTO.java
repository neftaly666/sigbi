package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private Integer idUser;

    @NotBlank
    @Size(min = 3, max = 60, message = "{name.size}")
    private String username;

    @NotBlank
    @Size(max = 36)
    private String supabaseUserId;

    private boolean enabled;

    private List<RoleDTO> roles;
}
