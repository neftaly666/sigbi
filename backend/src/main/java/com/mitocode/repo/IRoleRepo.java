package com.mitocode.repo;

import com.mitocode.model.Role;

import java.util.List;

public interface IRoleRepo extends IGenericRepo<Role, Integer> {

    List<Role> findByNameIn(List<String> names);
}
