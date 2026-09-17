package com.sigbi.repo;

import com.sigbi.model.Role;

import java.util.List;

public interface IRoleRepo extends IGenericRepo<Role, Integer> {

    List<Role> findByNameIn(List<String> names);
}
