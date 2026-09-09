package com.mitocode.service.impl;

import com.mitocode.exception.ModelNotFoundException;
import com.mitocode.model.Exam;
import com.mitocode.repo.IExamRepo;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.service.IExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl extends CRUDImpl<Exam, Integer> implements IExamService {

    //@Autowired
    private final IExamRepo repo;

    @Override
    protected IGenericRepo<Exam, Integer> getRepo() {
        return repo;
    }

    @Override
    public List<Exam> findExamByName(String name) {
        return repo.findByNameContainsIgnoreCase(name);
    }

    @Override
    public List<Exam> findExamByDescription(String description) {
        return repo.findByDescriptionContainsIgnoreCase(description);
    }

    /*public Exam save(Exam exam) throws Exception {
        return repo.save(exam);
    }

    @Override
    public Exam update(Integer id, Exam exam) throws Exception {
        //VALIDAR EL ID
        return repo.save(exam);
    }

    @Override
    public List<Exam> findAll() throws Exception {
        return repo.findAll();
    }

    @Override
    public Exam findById(Integer id) throws Exception {
        return repo.findById(id).orElseThrow(() -> new ModelNotFoundException("ID NOT FOUND: " + id));
    }

    @Override
    public void delete(Integer id) throws Exception {
        repo.deleteById(id);
    }*/

    //private String text;

    /*public ExamServiceImpl(IExamRepo repo) {
        this.repo = repo;
    }*/

    /*@Override
    public Exam validateExam(Integer idExam){
        if(idExam > 0 ){
            //repo = new ExamRepo();
            return repo.getExamById(idExam);
        }
        return new Exam(0, "No existe el examen", "");
    }*/
}
