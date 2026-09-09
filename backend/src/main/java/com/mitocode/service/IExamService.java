package com.mitocode.service;

import com.mitocode.model.Exam;

import java.util.List;

public interface IExamService extends ICRUD<Exam, Integer> {

    /*Exam save(Exam exam) throws Exception;
    Exam update(Integer id, Exam exam) throws Exception;
    List<Exam> findAll() throws Exception;
    Exam findById(Integer id) throws Exception;
    void delete(Integer id) throws Exception;*/
    //public E xam validateExam(Integer idExam);

    List<Exam> findExamByName(String name);
    List<Exam> findExamByDescription(String description);
}
