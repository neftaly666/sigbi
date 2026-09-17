package com.sigbi.controller;

import com.sigbi.dto.MenuDTO;
import com.sigbi.model.Menu;
import com.sigbi.service.IMenuService;
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
@RequestMapping("/v1/menus")
public class MenuController {

    private final IMenuService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<MenuDTO>> findAll() throws Exception {
        List<MenuDTO> list = service.findAll().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> findById(@PathVariable Integer id) throws Exception {
        MenuDTO obj = convertToDto(service.findById(id));

        return ResponseEntity.ok(obj);
    }

    //POST sin cuerpo por convencion del proyecto. Sin token devuelve lista vacía, no un error
    @PostMapping("/user")
    public ResponseEntity<List<MenuDTO>> getMenusByUser() throws Exception {
        List<MenuDTO> list = service.getMenusByUsername().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody MenuDTO dto) throws Exception {
        Menu obj = service.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdMenu()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDTO> update(@PathVariable Integer id, @Valid @RequestBody MenuDTO dto) throws Exception {
        Menu obj = service.update(id, convertToEntity(dto));

        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    private Menu convertToEntity(MenuDTO dto) {
        return defaultMapper.map(dto, Menu.class);
    }

    private MenuDTO convertToDto(Menu obj) {
        return defaultMapper.map(obj, MenuDTO.class);
    }
}
