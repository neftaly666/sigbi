package com.sigbi.tool;

import com.sigbi.model.Client;
import com.sigbi.model.Reservation;
import com.sigbi.model.ReservationDetail;
import com.sigbi.service.IClientService;
import com.sigbi.service.IReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Herramientas del asistente sobre las reservas. Igual que CatalogTool: **solo lectura**.
 *
 * No hay ninguna herramienta que registre una reserva, y es deliberado. El paso 5.1.3 de
 * AN120 pide "registra una reserva para Maria" y espera que el asistente se niegue e
 * indique donde hacerlo. Un modelo con una herramienta de escritura delante acaba
 * usandola por muy claro que sea el prompt; sin ella, la negativa no depende del prompt.
 */
@Component
@RequiredArgsConstructor
public class ReservationTool {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final IReservationService reservationService;
    private final IClientService clientService;

    public record ReservaInfo(String fecha, String cliente, List<String> libros) {}

    @Tool(name = "listarReservas",
          description = "Lista las reservas registradas, de la mas reciente a la mas antigua, con su cliente y los titulos que incluyen")
    public List<ReservaInfo> listarReservas() throws Exception {
        return reservationService.findAll().stream().map(this::aInfo).toList();
    }

    @Tool(name = "buscarReservasDeCliente",
          description = "Lista las reservas de un cliente, buscandolo por su nombre o apellidos")
    public List<ReservaInfo> buscarReservasDeCliente(String nombre) throws Exception {
        String aguja = nombre == null ? "" : nombre.toLowerCase().trim();

        //El servicio filtra por identificador, así que el nombre se resuelve antes
        List<Integer> ids = clientService.findAll().stream()
                .filter(cliente -> nombreCompleto(cliente).toLowerCase().contains(aguja))
                .map(Client::getIdClient)
                .toList();

        if (ids.isEmpty()) return List.of();

        List<ReservaInfo> reservas = new java.util.ArrayList<>();
        for (Integer id : ids) {
            reservationService.findByClient(id).stream().map(this::aInfo).forEach(reservas::add);
        }

        return reservas;
    }

    private ReservaInfo aInfo(Reservation reserva) {
        List<String> titulos = reserva.getDetails() == null ? List.of() : reserva.getDetails().stream()
                .map(ReservationDetail::getBook)
                .filter(libro -> libro != null)
                .map(libro -> libro.getTitle())
                .toList();

        return new ReservaInfo(
                reserva.getReservationDate() != null ? reserva.getReservationDate().format(FECHA) : "sin fecha",
                reserva.getClient() != null ? nombreCompleto(reserva.getClient()) : "Cliente desconocido",
                titulos);
    }

    private String nombreCompleto(Client cliente) {
        return cliente.getFirstName() + " " + cliente.getLastName();
    }
}
