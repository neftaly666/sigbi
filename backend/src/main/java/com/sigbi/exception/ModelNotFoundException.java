package com.sigbi.exception;

/**
 * Recurso inexistente. El 404 lo pone ResponseExceptionHandler, no una anotación
 * @ResponseStatus: así la respuesta viaja con el mismo CustomErrorTemplate que el
 * resto de errores y el frontend no tiene que distinguir dos formatos.
 */
public class ModelNotFoundException extends RuntimeException {

    public ModelNotFoundException(String message) {
        super(message);
    }
}
