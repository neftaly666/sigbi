package com.sigbi.service;

import com.sigbi.model.Category;

import java.util.Map;

public interface ICategoryService extends ICRUD<Category, Integer> {

    //Numero de libros clasificados en cada categoría, indexado por id.
    Map<Integer, Long> bookCountByCategory() throws Exception;

    long countBooks(Integer idCategory) throws Exception;
}
