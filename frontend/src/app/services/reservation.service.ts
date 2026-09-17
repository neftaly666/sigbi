import { Service } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Reservation } from '../model/reservation';
import { GenericService } from './generic.service';

@Service()
export class ReservationService extends GenericService<Reservation> {

    protected override url = `${environment.HOST}/v1/reservations`;

    //RF-11: las reservas de un cliente. No hay PUT: una reserva se crea o se elimina.
    findByClient(idClient: number) {
        return this.http.get<Reservation[]>(`${this.url}/client/${idClient}`);
    }

    /**
     * Alta que devuelve el identificador creado. El POST responde 201 con cuerpo vacío y
     * la ubicacion en la cabecera `Location`, así que hay que observar la respuesta
     * entera. Sirve para que el listado destaque la reserva que se acaba de registrar.
     */
    saveAndGetId(reservation: Reservation) {
        return this.http.post(this.url, reservation, { observe: 'response' }).pipe(
            map((respuesta) => {
                const location = respuesta.headers.get('Location');

                return location ? Number(location.split('/').pop()) : null;
            }),
        );
    }
}
