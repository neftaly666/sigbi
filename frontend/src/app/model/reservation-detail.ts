import { Book } from './book';

export class ReservationDetail {
    idReservationDetail?: number;
    //Entrada: el detalle viaja como identificador de libro
    idBook: number;
    //Salida: el título resuelto, para que RF-10 no obligue a una segunda petición
    book?: Book;
}
