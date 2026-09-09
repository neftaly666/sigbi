package com.mitocode.service;

import com.mitocode.model.ConsultExam;
import com.mitocode.model.ConsultExamPK;
import com.mitocode.model.Exam;

import java.util.List;

public interface IConsultExamService extends ICRUD<ConsultExam, ConsultExamPK> {

    List<Exam> getExamsByConsultId(Integer idConsult);
}
