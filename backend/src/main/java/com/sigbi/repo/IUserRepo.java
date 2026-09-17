package com.sigbi.repo;

import com.sigbi.model.User;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IUserRepo extends IGenericRepo<User, Integer> {

    Optional<User> findOneByUsername(String username);

    //El sub del token es el identificador que une Supabase con user_data: los emails cambian, el sub no
    Optional<User> findOneBySupabaseUserId(String supabaseUserId);

    //user_data no usa secuencia, el id se calcula al insertar
    @Query("SELECT COALESCE(MAX(u.idUser), 0) + 1 FROM User u")
    Integer getNextId();
}
