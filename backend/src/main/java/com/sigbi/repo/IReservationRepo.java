package com.sigbi.repo;

import com.sigbi.model.Reservation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IReservationRepo extends IGenericRepo<Reservation, Integer> {

    //RN-12: cuántas reservas impiden borrar un cliente
    long countByClientIdClient(Integer idClient);

    /*
     * RF-10 exige que el listado traiga cliente y títulos ya resueltos. Con carga
     * perezosa el mapeo a DTO ocurre fuera de la sesión y revienta con
     * LazyInitializationException, así que se traen en la misma consulta.
     * El orden es fecha descendente (AN010 sección 6.2.5).
     */
    @Query("SELECT DISTINCT r FROM Reservation r "
            + "JOIN FETCH r.client "
            + "LEFT JOIN FETCH r.details d "
            + "LEFT JOIN FETCH d.book "
            + "ORDER BY r.reservationDate DESC")
    List<Reservation> findAllWithDetails();

    @Query("SELECT DISTINCT r FROM Reservation r "
            + "JOIN FETCH r.client c "
            + "LEFT JOIN FETCH r.details d "
            + "LEFT JOIN FETCH d.book "
            + "WHERE c.idClient = :idClient "
            + "ORDER BY r.reservationDate DESC")
    List<Reservation> findByClientWithDetails(@Param("idClient") Integer idClient);

    @Query("SELECT r FROM Reservation r "
            + "JOIN FETCH r.client "
            + "LEFT JOIN FETCH r.details d "
            + "LEFT JOIN FETCH d.book "
            + "WHERE r.idReservation = :id")
    Optional<Reservation> findByIdWithDetails(@Param("id") Integer id);
}
