package com.mitocode.controller;

import com.mitocode.dto.MedicDTO;
import com.mitocode.model.Medic;
import com.mitocode.service.IMedicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/medics")
public class MedicController {

    //@Autowired
    private final IMedicService service;
    private final ModelMapper medicMapper;

    @GetMapping
    public ResponseEntity<List<MedicDTO>> findAll() throws Exception {
        List<MedicDTO> list = service.findAll().stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicDTO> findById(@PathVariable Integer id) throws Exception {
        MedicDTO obj = convertToDto(service.findById(id));

        return ResponseEntity.ok(obj);
    }

    //La parte medic debe viajar como application/json, un string plano se rechaza con 415
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> save(@Valid @RequestPart("medic") MedicDTO dto,
                                     @RequestPart(name = "file", required = false) MultipartFile file) throws Exception{
        Medic obj = service.save(convertToEntity(dto), file);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdMedic()).toUri();

        return ResponseEntity.created(location).build();
        //return ResponseEntity.status(HttpStatus.CREATED).body(obj);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicDTO> update(@PathVariable Integer id,
                                           @Valid @RequestPart("medic") MedicDTO dto,
                                           @RequestPart(name = "file", required = false) MultipartFile file) throws Exception{
        //dto.setIdMedic(id);
        Medic obj = service.update(id, convertToEntity(dto), file);

        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception{
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<MedicDTO> findByIdHateoas(@PathVariable Integer id) throws Exception {
        Medic obj = service.findById(id);

        EntityModel<MedicDTO> entityModel = EntityModel.of(convertToDto(obj));

        WebMvcLinkBuilder link1 = linkTo(methodOn(MedicController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(LanguageController.class).changeLanguage("es"));

        entityModel.add(link1.withRel("medic-self-info"));
        entityModel.add(link2.withRel("change-language-es"));

        return entityModel;
    }

    private Medic convertToEntity(MedicDTO dto) {
        return medicMapper.map(dto, Medic.class);
    }

    private MedicDTO convertToDto(Medic obj) {
        return medicMapper.map(obj, MedicDTO.class);
    }

    /*public MedicController(IMedicService service) {
        this.service = service;
    }*/

    /*@GetMapping
    public Medic getMedic(){
        //service = new MedicService();
        return service.validateMedic(1);
    }*/
}
