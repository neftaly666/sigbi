package com.mitocode.service;

import com.mitocode.dto.AdminUserRequest;
import com.mitocode.model.User;

public interface IAdminUserService {

    //Crea el usuario en Supabase y la fila local en una sola operacion
    User create(AdminUserRequest request);
}
