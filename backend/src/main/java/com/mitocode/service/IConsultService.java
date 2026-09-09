package com.mitocode.service;

import com.mitocode.dto.ConsultProcDTO;
import com.mitocode.dto.IConsultProcDTO;
import com.mitocode.model.Consult;
import com.mitocode.model.Exam;

import java.time.LocalDateTime;
import java.util.List;

public interface IConsultService extends ICRUD<Consult, Integer> {

    Consult saveTransactional(Consult consult, List<Exam> list);

    List<Consult> search(String dni, String fullname);

    List<Consult> searchByDates(LocalDateTime date1, LocalDateTime date2);

    List<ConsultProcDTO> callProcedureOrFunctionManual();

    List<ConsultProcDTO> callProcedureOrFunctionNative();

    List<IConsultProcDTO> callProcedureOrFunctionProjection();

    byte[] generateReport() throws Exception;

    List<Consult> findByIdConsult(Integer consultId);
    List<Consult> findByConsultDateBetween(LocalDateTime date1, LocalDateTime date2);

}
