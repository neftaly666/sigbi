package com.sigbi.service;

import com.sigbi.model.Menu;

import java.util.List;

public interface IMenuService extends ICRUD<Menu, Integer> {

    List<Menu> getMenusByUsername();
}
