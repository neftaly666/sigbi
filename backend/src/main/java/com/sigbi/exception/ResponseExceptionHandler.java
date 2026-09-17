package com.sigbi.exception;

import org.jspecify.annotations.Nullable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomErrorTemplate> handleDefaultException(Exception ex, WebRequest request) {
        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ModelNotFoundException.class)
    public ResponseEntity<CustomErrorTemplate> handleModelNotFoundException(ModelNotFoundException ex, WebRequest request) {
        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    //date1/date2 sin componente de hora: LocalDateTime.parse falla y debe salir 400, no 500
    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<CustomErrorTemplate> handleDateTimeParseException(DateTimeParseException ex, WebRequest request) {
        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<CustomErrorTemplate> handleArithmeticException(ArithmeticException ex, WebRequest request) {
        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(error);
    }

    /**
     * Los fallos de @Valid llegan aqui. Se sobrescribe el método de
     * ResponseEntityExceptionHandler en vez de declarar un @ExceptionHandler propio:
     * el de la clase padre tiene prioridad y ganaría, dejando el nuestro muerto.
     *
     * El mensaje sale como "campo: motivo" para que el frontend pueda repartir cada
     * error al campo que lo provoco (PX-04) en vez de mostrar un aviso generico.
     */
    @Override
    protected @Nullable ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(","));

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                msg,
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Regla de negocio incumplida: 400, no 500. Es una respuesta prevista del
     * sistema (RN-02, RN-11, RN-12), no un fallo.
     */
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<CustomErrorTemplate> handleBusinessRuleException(BusinessRuleException ex, WebRequest request) {
        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Red de seguridad para las restricciones que valida la base: UNIQUE de isbn
     * y claves foraneas. El servicio ya las comprueba antes, pero dos altas
     * simultáneas pueden colarse entre la comprobación y el insert. Sin esto,
     * ese caso saldría como 500 con la traza del driver.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<CustomErrorTemplate> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                "La operacion viola una restriccion de integridad de los datos",
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
