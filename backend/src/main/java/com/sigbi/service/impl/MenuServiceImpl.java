package com.sigbi.service.impl;

import com.sigbi.model.Menu;
import com.sigbi.repo.IGenericRepo;
import com.sigbi.repo.IMenuRepo;
import com.sigbi.service.IMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl extends CRUDImpl<Menu, Integer> implements IMenuService {

    private final IMenuRepo repo;

    @Override
    protected IGenericRepo<Menu, Integer> getRepo() {
        return repo;
    }

    @Override
    public List<Menu> getMenusByUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return List.of();
        }

        //Con token se resuelve por el sub, que es lo que no cambia
        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            return repo.getMenusBySupabaseUserId(jwtAuthentication.getToken().getSubject());
        }

        //Sin token la autenticación es anónima y la consulta devuelve lista vacía, no un error
        return repo.getMenusByUsername(authentication.getName());
    }
}
