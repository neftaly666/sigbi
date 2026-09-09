package com.mitocode.controller;

import com.mitocode.dto.ConsultDTO;
import com.mitocode.dto.ConsultProcDTO;
import com.mitocode.dto.IConsultProcDTO;
import com.mitocode.model.Consult;
import com.mitocode.dto.ConsultListExamDTO;
import com.mitocode.model.Exam;
import com.mitocode.service.IConsultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.print.attribute.standard.Media;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/consults")
public class ConsultController {

    private final IConsultService service;
    private final ModelMapper defaultMapper;
    //El nested medic renombra campos, sin este mapper la columna MEDIC del listado sale vacia
    @Qualifier("consultMapper")
    private final ModelMapper consultMapper;

    //Solo lo usa este endpoint, no llega a ser un dto de dominio
    public record FilterConsultDTO(String dni, String fullname) {
    }

    @GetMapping    
    public ResponseEntity<List<ConsultDTO>> findAll() throws Exception {
        List<ConsultDTO> list = service.findAll().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultDTO> findById(@PathVariable Integer id) throws Exception {
        ConsultDTO obj = convertToDto(service.findById(id));

        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody ConsultListExamDTO dto) throws Exception {
        Consult obj = convertToEntity(dto.getConsult());
        List<Exam> list = dto.getLstExam().stream().map(examDTO -> defaultMapper.map(examDTO, Exam.class)).toList();

        Consult _ = service.saveTransactional(obj, list);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdConsult()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultDTO> update(@PathVariable Integer id, @Valid @RequestBody ConsultDTO dto) throws Exception {
        Consult obj = service.update(id, convertToEntity(dto));

        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    //POST con body: el filtro viaja como comando, sin @Valid
    @PostMapping("/search/others")
    public ResponseEntity<List<ConsultDTO>> searchByOthers(@RequestBody FilterConsultDTO filterDTO) throws Exception {
        List<ConsultDTO> consults = service.search(filterDTO.dni(), filterDTO.fullname()).stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(consults);
    }

    //GET con query params: lectura parametrizada, la url queda compartible
    @GetMapping("/search/dates")
    public ResponseEntity<List<ConsultDTO>> searchByDates(@RequestParam("date1") String date1,
                                                          @RequestParam("date2") String date2) throws Exception {
        //yyyy-MM-dd + T + HH:mm:ss, una fecha sin hora no parsea y termina en 400
        List<ConsultDTO> consults = service.searchByDates(LocalDateTime.parse(date1), LocalDateTime.parse(date2))
                .stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(consults);
    }

    @GetMapping("/callProcedureManual")
    public ResponseEntity<List<ConsultProcDTO>> callProcedureManual(){
        return ResponseEntity.ok(service.callProcedureOrFunctionManual());
    }

    @GetMapping("/callProcedureNative")
    public ResponseEntity<List<ConsultProcDTO>> callProcedureNative(){
        return ResponseEntity.ok(service.callProcedureOrFunctionNative());
    }

    @GetMapping("/callProcedureProjection")
    public ResponseEntity<List<IConsultProcDTO>> callProcedureProjection(){
        return ResponseEntity.ok(service.callProcedureOrFunctionProjection());
    }

    @GetMapping(value = "/generateReport", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE) //APPLICATION_PDF_VALUE
    public ResponseEntity<byte[]> generateReport() throws Exception {
        return ResponseEntity.ok(service.generateReport());
    }

    private Consult convertToEntity(ConsultDTO dto) {
        return defaultMapper.map(dto, Consult.class);
    }

    private ConsultDTO convertToDto(Consult obj) {
        return consultMapper.map(obj, ConsultDTO.class);
    }
}
