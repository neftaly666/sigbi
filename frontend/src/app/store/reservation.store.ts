import { computed, inject, Service, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Reservation } from "../model/reservation";
import { ReservationService } from "../services/reservation.service";

/**
 * Lista de reservas, con un filtro por cliente que cambia el endpoint en vez de filtrar en
 * memoria: es RF-11, y el backend tiene GET /v1/reservations/client/{id} justo para eso.
 * La pantalla de Clientes navega aquí con ?cliente=<id> desde su acción "Ver reservas".
 */
@Service({autoProvided: false})
export class ReservationStore{

    private readonly reservationService = inject(ReservationService);

    readonly $idClient = signal<number | null>(null);

    readonly reservationsResource = httpResource<Reservation[]>(
        () => {
            const idClient = this.$idClient();

            return idClient
                ? `${this.reservationService.resourceUrl}/client/${idClient}`
                : this.reservationService.resourceUrl;
        },
        { defaultValue: [] },
    );

    //Orden por fecha descendente (AN050 sección 7.1): la última reserva arriba
    readonly $reservations = computed(() =>
        [...(this.reservationsResource.hasValue() ? this.reservationsResource.value() : [])].sort((a, b) =>
            (b.reservationDate ?? '').localeCompare(a.reservationDate ?? ''),
        ),
    );

    readonly $loading = this.reservationsResource.isLoading;
    readonly $error = this.reservationsResource.error;

    filtrarPorCliente(idClient: number | null){
        this.$idClient.set(idClient);
    }

    reload(){
        this.reservationsResource.reload();
    }
}
