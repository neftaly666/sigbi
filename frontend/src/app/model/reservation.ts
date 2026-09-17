import { Client } from './client';
import { ReservationDetail } from './reservation-detail';

export class Reservation {
    idReservation?: number;
    //RN-10: solo lectura, la pone el servidor. Si se envía, se ignora.
    reservationDate?: string;
    idClient: number;
    //Solo salida: resumen del cliente con id, nombres y apellidos
    client?: Client;
    details: ReservationDetail[];
}
