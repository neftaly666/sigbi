package com.sigbi.service.impl;

import com.sigbi.model.Role;
import com.sigbi.repo.IGenericRepo;
import com.sigbi.repo.IRoleRepo;
import com.sigbi.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl extends CRUDImpl<Role, Integer> implements IRoleService {

    private final IRoleRepo repo;

    @Override
    protected IGenericRepo<Role, Integer> getRepo() {
        return repo;
    }
}
