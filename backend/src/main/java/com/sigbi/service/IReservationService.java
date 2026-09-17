package com.sigbi.service;

import com.sigbi.model.Reservation;

import java.util.List;

public interface IReservationService extends ICRUD<Reservation, Integer> {

    //RF-11: las reservas de un cliente concreto
    List<Reservation> findByClient(Integer idClient) throws Exception;
}
