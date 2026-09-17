package com.sigbi.service.impl;

import com.sigbi.model.User;
import com.sigbi.repo.IGenericRepo;
import com.sigbi.repo.IUserRepo;
import com.sigbi.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends CRUDImpl<User, Integer> implements IUserService {

    private final IUserRepo repo;

    @Override
    protected IGenericRepo<User, Integer> getRepo() {
        return repo;
    }
}
