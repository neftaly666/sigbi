package com.sigbi.exception;

/**
 * Regla de negocio incumplida. Se lanza desde la capa de servicio y el manejador
 * global la traduce a 400, no a 500: un rechazo por regla es una respuesta
 * prevista del sistema, no un fallo (CP-03, CP-10, CP-15 de AN010 sección 8.1).
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
