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
public class MenuDTO {

    private Integer idMenu;

    @NotBlank
    @Size(max = 20)
    private String icon;

    @NotBlank
    @Size(min = 3, max = 20, message = "{name.size}")
    private String name;

    @NotBlank
    @Size(max = 50)
    private String url;

    private List<RoleDTO> roles;
}
