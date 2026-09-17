package com.sigbi.service.impl;

import com.sigbi.exception.BusinessRuleException;
import com.sigbi.model.Client;
import com.sigbi.repo.IClientRepo;
import com.sigbi.repo.IGenericRepo;
import com.sigbi.repo.IReservationRepo;
import com.sigbi.service.IClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl extends CRUDImpl<Client, Integer> implements IClientService {

    private final IClientRepo repo;
    private final IReservationRepo reservationRepo;
    private final MessageSource messageSource;

    @Override
    protected IGenericRepo<Client, Integer> getRepo() {
        return repo;
    }

    /**
     * RN-12: un cliente con reservas no se borra. Igual que en categorías, la
     * clave foránea ya lo impediría, pero dejarselo a la base da un 500 con la
     * traza del driver y CP-10 exige un rechazo controlado.
     */
    @Override
    public void delete(Integer id) throws Exception {
        findById(id);

        long reservations = reservationRepo.countByClientIdClient(id);
        if (reservations > 0) {
            throw new BusinessRuleException(messageSource.getMessage(
                    "client.delete.hasReservations", new Object[]{reservations},
                    LocaleContextHolder.getLocale()));
        }

        super.delete(id);
    }
}
