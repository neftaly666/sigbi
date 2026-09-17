package com.sigbi.repo;

import com.sigbi.model.ReservationDetail;

public interface IReservationDetailRepo extends IGenericRepo<ReservationDetail, Integer> {

    //RN-12: cuántas reservas impiden borrar un libro
    long countByBookIdBook(Integer idBook);
}
