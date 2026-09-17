package com.sigbi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idReservation;

    //RN-10: la fija el servidor al registrar, nunca el cliente.
    @Column(nullable = false)
    private LocalDateTime reservationDate;

    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RESERVATION_CLIENT"))
    private Client client;

    //RN-09: cascade ALL para que cabecera y detalles se graben en un solo save.
    //orphanRemoval completa RN-13: al borrar la reserva se van sus detalles.
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationDetail> details;
}
