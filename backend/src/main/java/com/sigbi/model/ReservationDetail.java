package com.sigbi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ReservationDetail {

    //DM-01: clave primaria propia, no compuesta. Y se llama idReservationDetail,
    //no idDetail: CRUDImpl.update() resuelve el setter por reflexión a partir del
    //nombre de la clase (D-03 de AN020 es justo el defecto que aquí no se repite).
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idReservationDetail;

    //@ToString.Exclude corta la recursión cabecera -> detalle -> cabecera que
    //genera @Data. Sin esto, cualquier toString() revienta con StackOverflowError.
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "id_reservation", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RESERVATION_DETAIL_RESERVATION"))
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "id_book", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RESERVATION_DETAIL_BOOK"))
    private Book book;
}
