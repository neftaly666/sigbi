package com.mitocode.tool;

import com.mitocode.dto.ConsultDTO;
import com.mitocode.dto.ConsultListExamDTO;
import com.mitocode.model.Consult;
import com.mitocode.model.Exam;
import com.mitocode.model.User;
import com.mitocode.service.IConsultService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ConsultTool {

    private final IConsultService service;
    private final ModelMapper consultMapper;

    @Tool(name = "findConsultByIdConsult", description = "Buscar un consulta por su idConsult / Search consult by idConsult")
    public List<ConsultDTO> findConsultByIdConsult(Integer idConsult) {
        List<Consult> consult = service.findByIdConsult(idConsult);
        return consultMapper.map(consult, new TypeToken<List<ConsultDTO>>() {}.getType());
    }

    @Tool(description = "Buscar consultas registradas entre dos fechas / Search consults registered between two dates")
    public List<ConsultDTO> findByConsultDateBetween(
            @ToolParam(description = "Fecha inicial en formato yyyy-MM-dd. Ejemplo: 2026-08-15")
            String date1,

            @ToolParam(description = "Fecha final en formato yyyy-MM-dd. Ejemplo: 2026-08-18")
            String date2
    ) {

        LocalDateTime from = LocalDate.parse(date1).atStartOfDay();
        LocalDateTime to = LocalDate.parse(date2).plusDays(1).atStartOfDay();

        System.out.println(from);
        System.out.println(to);

        List<Consult> consult = service.findByConsultDateBetween(from, to);
        return consultMapper.map(consult, new TypeToken<List<ConsultDTO>>() {}.getType());
    }

    @Tool(description = """
                    Crear una nueva consulta médica.
                    La fecha consultDate debe estar en formato ISO-8601:
                    yyyy-MM-dd'T'HH:mm:ss.
                    Si el usuario indica solamente una fecha, usar 00:00:00.
                    Si la consulta no tiene exámenes, lstExam debe ser [].
            """)
    public ConsultDTO createNewConsult(ConsultListExamDTO dto) {
        // Una creación nunca debe tener ID
        dto.getConsult().setIdConsult(null);

        Consult consult = consultMapper.map(dto.getConsult(), Consult.class);
        // Protección adicional
        consult.setIdConsult(null);

        //Reemplazar con Contexto de Spring Security
        User user = new User();
        user.setIdUser(1);
        consult.setUser(user);

        List<Exam> exams = consultMapper.map(dto.getLstExam(), new TypeToken<List<Exam>>() {}.getType());

        Consult result = service.saveTransactional(consult, exams);

        return consultMapper.map(result, ConsultDTO.class);
    }
}
