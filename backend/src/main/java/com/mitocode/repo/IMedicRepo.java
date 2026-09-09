package com.mitocode.repo;

import com.mitocode.model.Medic;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IMedicRepo extends IGenericRepo<Medic, Integer> {

    @Query("FROM Medic m WHERE m.firstName LIKE %?1% OR m.lastName LIKE %?2%")
    List<Medic> findByFirstNameOrLastNameContainsIgnoreCase(String firstName, String lastName);

}
