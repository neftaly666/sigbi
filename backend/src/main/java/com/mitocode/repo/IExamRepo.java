package com.mitocode.repo;

import com.mitocode.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IExamRepo extends IGenericRepo<Exam, Integer> {

    //public Exam getExamById(Integer idExam);
    List<Exam> findByNameContainsIgnoreCase(String name);
    List<Exam> findByDescriptionContainsIgnoreCase(String description);
}
