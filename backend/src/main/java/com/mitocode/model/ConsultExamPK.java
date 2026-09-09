package com.mitocode.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.EqualsAndHashCode;

@Embeddable
@EqualsAndHashCode
public class ConsultExamPK {

    @ManyToOne
    @JoinColumn(name = "id_consult", nullable = false, foreignKey = @ForeignKey(name = "fk_consult_exam_consult"))
    private Consult consult;

    @ManyToOne
    @JoinColumn(name = "id_exam", nullable = false, foreignKey = @ForeignKey(name = "fk_consult_exam_exam"))
    private Exam exam;

    //CPK1 | CPK2
    //(1,2) | (1,2)
}
