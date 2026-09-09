package com.mitocode.tool;

import com.mitocode.dto.ExamDTO;
import com.mitocode.model.Exam;
import com.mitocode.service.IExamService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ExamTool {

    private final IExamService service;
    private final ModelMapper defaultMapper;

    @Tool(name = "findAllExams", description = "Buscar todos los examenes / Search for all exams")
    public List<ExamDTO> findAllExams() throws Exception {
        List<Exam> exams = service.findAll();
        return defaultMapper.map(exams, new TypeToken<List<ExamDTO>>() {}.getType());
    }

    @Tool(name = "findExamByName", description = "Buscar un examen por su nombre / Search for an exam by its name")
    public List<ExamDTO> findExamByName(String name){
        List<Exam> exams = service.findExamByName(name);
        return defaultMapper.map(exams, new TypeToken<List<ExamDTO>>() {}.getType());
    }

    @Tool(name = "findExamByDescription", description = "Buscar un examen por su descripcion / Search for an exam by its description")
    public List<ExamDTO> findExamByDescription(String description){
        List<Exam> exams = service.findExamByDescription(description);
        return defaultMapper.map(exams, new TypeToken<List<ExamDTO>>() {}.getType());
    }
}
