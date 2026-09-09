package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultDetailDTO {

    private Integer idDetail;

    //@NotNull
    @JsonBackReference
    private ConsultDTO consult;

    //mismas longitudes que las columnas de ConsultDetail (70 / 150)
    @NotNull
    @Size(max = 70)
    private String diagnosis;

    @NotNull
    @Size(max = 150)
    private String treatment;
}
