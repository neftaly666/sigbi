package com.sigbi.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Un solo mapeador. Los mapeadores con reglas explicitas que hubo aquí resolvian los
 * renombrados de MediApp (primaryName/surname/photo); el dominio de SIGBI no renombra
 * ningún campo entre entidad y DTO, así que el mapeo implícito basta.
 *
 * Las dos excepciones -Book y Reservation- no usan ModelMapper en absoluto: se mapean a
 * mano en su controlador, que es lo que EST020 sección 3.5 marca para las relaciones que
 * viajan como identificador o anidadas.
 */
@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper defaultMapper() {
        return new ModelMapper();
    }
}
