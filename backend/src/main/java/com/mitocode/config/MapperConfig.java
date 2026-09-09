package com.mitocode.config;

import com.mitocode.dto.ConsultDTO;
import com.mitocode.dto.MedicDTO;
import com.mitocode.model.Consult;
import com.mitocode.model.Medic;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper defaultMapper() {
        return new ModelMapper();
    }

    @Bean
    public ModelMapper medicMapper() {
        ModelMapper mapper = new ModelMapper();

        //ESCRITURA POST PUT
        mapper.createTypeMap(MedicDTO.class, Medic.class)
                .addMapping(MedicDTO::getPrimaryName, Medic::setFirstName)
                .addMapping(MedicDTO::getSurname, Medic::setLastName)
                .addMapping(MedicDTO::getPhoto, Medic::setPhotoUrl);

        //LECTURA GET
        mapper.createTypeMap(Medic.class, MedicDTO.class)
                .addMapping(Medic::getFirstName, MedicDTO::setPrimaryName)
                .addMapping(Medic::getLastName, MedicDTO::setSurname)
                .addMapping(Medic::getPhotoUrl, MedicDTO::setPhoto);

        return mapper;
    }

    @Bean
    public ModelMapper consultMapper() {
        ModelMapper mapper = new ModelMapper();

        //LECTURA GET
        //MedicDTO renombra firstName -> primaryName y lastName -> surname.
        //El mapeo implicito no encuentra esos nombres dentro del nested medic y los deja en null,
        //por eso el nested se declara explicitamente con rutas profundas origen/destino.
        mapper.createTypeMap(Consult.class, ConsultDTO.class)
                .addMapping(src -> src.getMedic().getFirstName(), (dest, v) -> dest.getMedic().setPrimaryName((String) v))
                .addMapping(src -> src.getMedic().getLastName(), (dest, v) -> dest.getMedic().setSurname((String) v))
                .addMapping(src -> src.getMedic().getPhotoUrl(), (dest, v) -> dest.getMedic().setPhoto((String) v));

        return mapper;
    }
}
