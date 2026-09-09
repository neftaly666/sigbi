package com.mitocode.service.impl;

import com.mitocode.model.ConsultExam;
import com.mitocode.model.ConsultExamPK;
import com.mitocode.model.Exam;
import com.mitocode.repo.IConsultExamRepo;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.service.IConsultExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultExamServiceImpl extends CRUDImpl<ConsultExam, ConsultExamPK> implements IConsultExamService {

    private final IConsultExamRepo repo;

    @Override
    protected IGenericRepo<ConsultExam, ConsultExamPK> getRepo() {
        return repo;
    }

    @Override
    public List<Exam> getExamsByConsultId(Integer idConsult) {
        return repo.getExamsByConsultId(idConsult);
    }
}
