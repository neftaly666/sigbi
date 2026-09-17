package com.sigbi.service.impl;

import com.sigbi.exception.BusinessRuleException;
import com.sigbi.exception.ModelNotFoundException;
import com.sigbi.model.Book;
import com.sigbi.model.Category;
import com.sigbi.repo.IBookRepo;
import com.sigbi.repo.ICategoryRepo;
import com.sigbi.repo.IReservationDetailRepo;
import com.sigbi.repo.IGenericRepo;
import com.sigbi.service.IBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl extends CRUDImpl<Book, Integer> implements IBookService {

    private final IBookRepo repo;
    private final ICategoryRepo categoryRepo;
    private final IReservationDetailRepo reservationDetailRepo;
    private final MessageSource messageSource;

    @Override
    protected IGenericRepo<Book, Integer> getRepo() {
        return repo;
    }

    @Override
    public Book save(Book entity) throws Exception {
        validateCategory(entity);
        validateIsbn(entity.getIsbn(), null);

        return super.save(entity);
    }

    @Override
    public Book update(Integer id, Book entity) throws Exception {
        validateCategory(entity);
        validateIsbn(entity.getIsbn(), id);

        return super.update(id, entity);
    }

    /**
     * RN-12: un libro que aparece en alguna reserva no se borra. Para quitarlo
     * del catálogo hay que eliminar antes esa reserva, que es lo que devuelve el
     * libro al fondo (RN-13).
     */
    @Override
    public void delete(Integer id) throws Exception {
        findById(id);

        long reservations = reservationDetailRepo.countByBookIdBook(id);
        if (reservations > 0) {
            throw new BusinessRuleException(messageSource.getMessage(
                    "book.delete.hasReservations", new Object[]{reservations},
                    LocaleContextHolder.getLocale()));
        }

        super.delete(id);
    }

    /**
     * RN-02. La columna es UNIQUE, pero dejar que salte la base produce un 500;
     * CP-05 exige un 400 que senale el campo isbn.
     */
    private void validateIsbn(String isbn, Integer idToIgnore) {
        Optional<Book> existing = repo.findByIsbn(isbn);

        if (existing.isPresent() && !existing.get().getIdBook().equals(idToIgnore)) {
            throw new BusinessRuleException(messageSource.getMessage(
                    "book.isbn.duplicated", new Object[]{isbn}, LocaleContextHolder.getLocale()));
        }
    }

    //RN-01: la categoría es obligatoria y tiene que existir. Sin esto, un id
    //inventado revienta contra la clave foránea con un 500.
    private void validateCategory(Book entity) {
        Category category = entity.getCategory();

        if (category == null || category.getIdCategory() == null) {
            throw new BusinessRuleException(messageSource.getMessage(
                    "book.category.required", null, LocaleContextHolder.getLocale()));
        }

        categoryRepo.findById(category.getIdCategory())
                .orElseThrow(() -> new ModelNotFoundException(
                        "ID NOT FOUND: " + category.getIdCategory()));
    }
}
