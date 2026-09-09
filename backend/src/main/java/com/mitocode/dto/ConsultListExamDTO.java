package com.mitocode.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultListExamDTO {

    //@Valid del controller no cascadea solo, se anota cada campo anidado
    @NotNull
    @Valid
    private ConsultDTO consult;

    @NotNull
    private List<@Valid ExamDTO> lstExam;
}
