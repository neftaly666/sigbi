package com.sigbi.service.impl;

import com.sigbi.dto.AdminUserRequest;
import com.sigbi.model.Role;
import com.sigbi.model.User;
import com.sigbi.repo.IRoleRepo;
import com.sigbi.repo.IUserRepo;
import com.sigbi.security.ISupabaseService;
import com.sigbi.security.SupabaseUser;
import com.sigbi.service.IAdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements IAdminUserService {

    private final IUserRepo userRepo;
    private final IRoleRepo roleRepo;
    private final ISupabaseService supabaseService;

    @Transactional
    @Override
    public User create(AdminUserRequest request) {
        //Sin username explícito se usa el email, que es con lo que se inicia sesión
        String username = StringUtils.hasText(request.getUsername()) ? request.getUsername() : request.getEmail();

        if (userRepo.findOneByUsername(username).isPresent()) {
            throw new IllegalArgumentException("USERNAME ALREADY EXISTS: " + username);
        }

        //Los roles se validan antes de tocar Supabase: un rol inexistente no debe dejar un usuario huerfano alla
        List<Role> roles = roleRepo.findByNameIn(request.getRoles());

        if (roles.size() != request.getRoles().size()) {
            throw new IllegalArgumentException("ROLE NOT FOUND: " + request.getRoles());
        }

        SupabaseUser supabaseUser = supabaseService.createAuthUser(request.getEmail(), request.getPassword(), username);

        User user = new User();
        //idUser forzado: así se crea el usuario 1 al que apuntan las filas user_role de data.sql
        user.setIdUser(request.getIdUser() != null ? request.getIdUser() : userRepo.getNextId());
        user.setUsername(username);
        user.setSupabaseUserId(supabaseUser.id());
        user.setEnabled(true);
        user.setRoles(roles);

        return userRepo.save(user);
    }
}
