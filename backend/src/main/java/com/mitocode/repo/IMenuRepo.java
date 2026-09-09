package com.mitocode.repo;

import com.mitocode.model.Menu;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IMenuRepo extends IGenericRepo<Menu, Integer> {

    @Query(value = """
            SELECT m.id_menu, m.icon, m.name, m.url
            FROM menu m
            INNER JOIN menu_role mr ON m.id_menu = mr.id_menu
            INNER JOIN user_role ur ON mr.id_role = ur.id_role
            INNER JOIN user_data u ON ur.id_user = u.id_user
            WHERE u.username = :username AND u.enabled = true
            """, nativeQuery = true)
    List<Menu> getMenusByUsername(@Param("username") String username);

    //distinct: un usuario con dos roles que comparten menu veria la opcion repetida
    @Query(value = """
            SELECT DISTINCT m.id_menu, m.icon, m.name, m.url
            FROM menu m
            INNER JOIN menu_role mr ON m.id_menu = mr.id_menu
            INNER JOIN user_role ur ON mr.id_role = ur.id_role
            INNER JOIN user_data u ON ur.id_user = u.id_user
            WHERE u.supabase_user_id = :supabaseUserId AND u.enabled = true
            """, nativeQuery = true)
    List<Menu> getMenusBySupabaseUserId(@Param("supabaseUserId") String supabaseUserId);
}
