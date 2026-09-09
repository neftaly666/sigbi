package com.mitocode.controller;

import com.mitocode.dto.SpecialtyDTO;
import com.mitocode.model.Specialty;
import com.mitocode.service.ISpecialtyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/specialties")
public class SpecialtyController {

    private final ISpecialtyService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<SpecialtyDTO>> findAll() throws Exception {
        List<SpecialtyDTO> list = service.findAll().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialtyDTO> findById(@PathVariable Integer id) throws Exception {
        SpecialtyDTO obj = convertToDto(service.findById(id));

        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody SpecialtyDTO dto) throws Exception {
        Specialty obj = service.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdSpecialty()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecialtyDTO> update(@PathVariable Integer id, @Valid @RequestBody SpecialtyDTO dto) throws Exception {
        Specialty obj = service.update(id, convertToEntity(dto));

        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    private Specialty convertToEntity(SpecialtyDTO dto) {
        return defaultMapper.map(dto, Specialty.class);
    }

    private SpecialtyDTO convertToDto(Specialty obj) {
        return defaultMapper.map(obj, SpecialtyDTO.class);
    }
}
