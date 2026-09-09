package com.mitocode.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class ConsultDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idDetail;

    @ManyToOne
    @JoinColumn(name = "id_consult", nullable = false, foreignKey = @ForeignKey(name = "FK_DETAIL_CONSULT"))
    private Consult consult;

    @Column(nullable = false, length = 70)
    private String diagnosis;

    @Column(nullable = false, length = 150)
    private String treatment;

    //Consult
    //id_consult (PK) | id_patient | id_medic | id_user | num_consult | consult_date
    //1                  | 1          | 7        | 1       | C01         | 2026-07-20T10:00:00

    //Consult_Detail
    //id_detail | id_consult (FK) | diagnosis | treatment
    //1         | 1          | Gripe                 | Paracetamol
    //2         | 1          | Dolor de cabeza       | Ibuprofeno
    //3         | 1          | Fiebre                | Acetaminofén

}
