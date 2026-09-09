package com.mitocode.controller;

import com.mitocode.dto.ExamDTO;
import com.mitocode.model.Exam;
import com.mitocode.service.IExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/exams")
//@CrossOrigin(origins = "*")
public class ExamController {

    //@Autowired
    private final IExamService service;
    //@Qualifier("defaultMapper")
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<ExamDTO>> findAll() throws Exception {
        List<ExamDTO> list = service.findAll().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDTO> findById(@PathVariable Integer id) throws Exception {
        ExamDTO obj = convertToDto(service.findById(id));

        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody ExamDTO dto) throws Exception{
        Exam obj = service.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdExam()).toUri();

        return ResponseEntity.created(location).build();
        //return ResponseEntity.status(HttpStatus.CREATED).body(obj);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamDTO> update(@PathVariable Integer id, @Valid @RequestBody ExamDTO dto) throws Exception{
        //dto.setIdExam(id);
        Exam obj = service.update(id, convertToEntity(dto));

        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception{
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<ExamDTO> findByIdHateoas(@PathVariable Integer id) throws Exception {
        Exam obj = service.findById(id);

        EntityModel<ExamDTO> entityModel = EntityModel.of(convertToDto(obj));

        WebMvcLinkBuilder link1 = linkTo(methodOn(ExamController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(LanguageController.class).changeLanguage("es"));

        entityModel.add(link1.withRel("exam-self-info"));
        entityModel.add(link2.withRel("change-language-es"));

        return entityModel;
    }

    private Exam convertToEntity(ExamDTO dto) {
        return defaultMapper.map(dto, Exam.class);
    }

    private ExamDTO convertToDto(Exam obj) {
        return defaultMapper.map(obj, ExamDTO.class);
    }

    /*public ExamController(IExamService service) {
        this.service = service;
    }*/

    /*@GetMapping
    public Exam getExam(){
        //service = new ExamService();
        return service.validateExam(1);
    }*/
}
