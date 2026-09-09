package com.mitocode.tool;

import com.mitocode.dto.MedicDTO;
import com.mitocode.model.Medic;
import com.mitocode.service.IMedicService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MedicTool {

    private final IMedicService service;
    private final ModelMapper defaultMapper;

    @Tool(name = "findAllMedics", description = "Buscar todos los medicos / Search for all medics")
    public List<MedicDTO> findAllMedics() throws Exception {
        List<Medic> medics = service.findAll();
        return defaultMapper.map(medics, new TypeToken<List<MedicDTO>>() {}.getType());
    }

    @Tool(name = "findMedicByFullName", description = "Buscar un medico por su nombre o apellido / Search for a doctor by their first or last name")
    public List<MedicDTO> findMedicByFullName(String fullName){
        List<Medic> medics = service.findByFullName(fullName);
        return defaultMapper.map(medics, new TypeToken<List<MedicDTO>>() {}.getType());
    }
}
