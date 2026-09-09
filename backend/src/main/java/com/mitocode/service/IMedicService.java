package com.mitocode.service;

import com.mitocode.model.Medic;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IMedicService extends ICRUD<Medic, Integer> {

    //El archivo es opcional, si no llega se conserva la foto que viaja en el medico
    Medic save(Medic medic, MultipartFile file) throws Exception;

    Medic update(Integer id, Medic medic, MultipartFile file) throws Exception;

    List<Medic> findByFullName(String fullName);
}
