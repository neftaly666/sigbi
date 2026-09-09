package com.mitocode.service.impl;

import com.mitocode.dto.ConsultProcDTO;
import com.mitocode.dto.IConsultProcDTO;
import com.mitocode.model.Consult;
import com.mitocode.model.Exam;
import com.mitocode.repo.IConsultExamRepo;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.IConsultRepo;
import com.mitocode.service.IConsultService;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConsultServiceImpl extends CRUDImpl<Consult, Integer> implements IConsultService {

    private final IConsultRepo repo;
    private final IConsultExamRepo consultExamRepo;

    @Override
    protected IGenericRepo<Consult, Integer> getRepo() {
        return repo;
    }

    @Transactional
    @Override
    public Consult saveTransactional(Consult consult, List<Exam> list) {
        consult.getDetails().forEach(det -> det.setConsult(consult));

        repo.save(consult);//GUARDA EN TABLA CABECERA DETALLE
        list.forEach(ex -> consultExamRepo.saveExam(consult.getIdConsult(), ex.getIdExam()));

        return consult;
    }

    @Override
    public List<Consult> search(String dni, String fullname) {
        return repo.search(dni, fullname);
    }

    @Override
    public List<Consult> searchByDates(LocalDateTime date1, LocalDateTime date2) {
        return repo.searchByDates(date1, date2);
    }

    @Override
    public List<ConsultProcDTO> callProcedureOrFunctionManual() {
        List<ConsultProcDTO> list = new ArrayList<>();

        repo.callProcedureOrFunctionManual().forEach(e -> {
            ConsultProcDTO dto = new ConsultProcDTO(
                    (Integer)(e[0]),
                    (String)(e[1])
            );
            list.add(dto);
        });
        return list;
    }

    @Override
    public List<ConsultProcDTO> callProcedureOrFunctionNative() {
        return repo.callProcedureOrFunctionNative();
    }

    @Override
    public List<IConsultProcDTO> callProcedureOrFunctionProjection() {
        return repo.callProcedureOrFunctionProjection();
    }

    @Override
    public byte[] generateReport() throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("txt_title", "MEDIAPP CONSULT REPORT");

        File file = new ClassPathResource("reports/consultas.jasper").getFile();
        JasperPrint print = JasperFillManager.fillReport(file.getPath(), params, new JRBeanCollectionDataSource(callProcedureOrFunctionNative()));
        return JasperExportManager.exportReportToPdf(print);
    }

    @Override
    public List<Consult> findByIdConsult(Integer consultId) {
        return repo.findByIdConsult(consultId);
    }

    @Override
    public List<Consult> findByConsultDateBetween(LocalDateTime date1, LocalDateTime date2) {
        return repo.findByConsultDateBetween(date1, date2);
    }
}
