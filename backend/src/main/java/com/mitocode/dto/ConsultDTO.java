package com.mitocode.dto;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultDTO {

    private Integer idConsult;

    @NotNull
    private PatientDTO patient;

    @NotNull
    private MedicDTO medic;

    @NotNull
    private Integer idUser;

    @NotNull
    private String numConsult;

    @NotNull
    //util para IA
    @Schema(
            description = "Fecha y hora de la consulta en formato ISO-8601 yyyy-MM-dd'T'HH:mm:ss. "
                    + "Si el usuario proporciona solamente una fecha, utilizar 00:00:00. "
                    + "Ejemplo: 2026-08-19T00:00:00"
    )
    private LocalDateTime consultDate;

    //@Valid para que el @Size de ConsultDetailDTO llegue a evaluarse (400, no 500)
    @NotNull
    @JsonManagedReference
    private List<@Valid ConsultDetailDTO> details;
}
