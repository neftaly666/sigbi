package com.sigbi.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entrada:  { "idClient": 3, "details": [ { "idBook": 12 } ] }
 * Salida:   { "idReservation": 5, "reservationDate": "...",
 *             "client": { ... }, "details": [ { "idReservationDetail": 9,
 *             "book": { "idBook": 12, "title": "..." } } ] }
 *
 * Un solo DTO para los dos sentidos: NON_NULL deja fuera lo que no se rellena.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationDTO {

    private Integer idReservation;

    //RN-10: solo lectura. Si llega en la petición se ignora.
    private LocalDateTime reservationDate;

    @NotNull(message = "{reservation.client.required}")
    private Integer idClient;

    private ClientDTO client;

    //RN-04: una reserva sin libros no es valida. @NotEmpty da 400 tanto desde la
    //interfaz como desde una llamada directa a la API (CP-13 y CP-25).
    @Valid
    @NotEmpty(message = "{reservation.details.required}")
    private List<ReservationDetailDTO> details;
}
