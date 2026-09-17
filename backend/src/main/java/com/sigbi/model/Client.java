package com.sigbi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idClient;

    @Column(nullable = false, length = 70)
    private String firstName;

    @Column(nullable = false, length = 70)
    private String lastName;

    //DM-06: el enunciado lo llama "cedula". El identificador se queda en `dni` por
    //coherencia con el código base, y el rótulo de pantalla dice "Documento", que no
    //presupone el tipo de documento ni el país.
    @Column(nullable = false, length = 8)
    private String dni;

    @Column(nullable = false, length = 55)
    private String email;
}
