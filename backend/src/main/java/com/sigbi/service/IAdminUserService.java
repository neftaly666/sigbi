package com.sigbi.service;

import com.sigbi.dto.AdminUserRequest;
import com.sigbi.model.User;

public interface IAdminUserService {

    //Crea el usuario en Supabase y la fila local en una sola operación
    User create(AdminUserRequest request);
}
