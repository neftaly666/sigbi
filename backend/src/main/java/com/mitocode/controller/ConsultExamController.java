package com.mitocode.controller;

import com.mitocode.dto.ExamDTO;
import com.mitocode.model.Exam;
import com.mitocode.service.IConsultExamService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/consultexams")
public class ConsultExamController {

    private final IConsultExamService service;
    //Exam y ExamDTO no renombran campos, el mapper por defecto alcanza
    private final ModelMapper defaultMapper;

    //Una consulta sin examenes devuelve lista vacia, no 404
    @GetMapping("/{idConsult}")
    public ResponseEntity<List<ExamDTO>> getExamsByConsultId(@PathVariable Integer idConsult) throws Exception {
        List<ExamDTO> list = service.getExamsByConsultId(idConsult).stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    private ExamDTO convertToDto(Exam obj) {
        return defaultMapper.map(obj, ExamDTO.class);
    }
}
