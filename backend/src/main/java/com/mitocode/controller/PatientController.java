package com.mitocode.controller;

import com.mitocode.dto.PatientDTO;
import com.mitocode.model.Patient;
import com.mitocode.service.IPatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/patients")
public class PatientController {

    private final IPatientService service;
    private final ModelMapper defaultMapper;

    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PreAuthorize("@authorizeLogic.hasAccess('findAll')")
    @GetMapping
    public ResponseEntity<List<PatientDTO>> findAll() throws Exception {
        List<PatientDTO> list = service.findAll().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> findById(@PathVariable Integer id) throws Exception {
        PatientDTO obj = convertToDto(service.findById(id));

        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody PatientDTO dto) throws Exception {
        Patient obj = service.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdPatient()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> update(@PathVariable Integer id, @Valid @RequestBody PatientDTO dto) throws Exception {
        Patient obj = service.update(id, convertToEntity(dto));

        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<PatientDTO>> listPageable(Pageable pageable){
        Page<PatientDTO> page = service.listPage(pageable).map(this::convertToDto);

        return ResponseEntity.ok(page);
    }

    private Patient convertToEntity(PatientDTO dto) {
        return defaultMapper.map(dto, Patient.class);
    }

    private PatientDTO convertToDto(Patient obj) {
        return defaultMapper.map(obj, PatientDTO.class);
    }
}
