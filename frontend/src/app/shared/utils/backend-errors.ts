import { HttpErrorResponse } from "@angular/common/http";

/**
 * Traduce el cuerpo de un 400 del backend a errores por campo.
 *
 * El backend responde siempre con CustomErrorTemplate { datetime, message, details }.
 * El `message` tiene dos formas:
 *
 *   - Validación de Bean Validation: "isbn: El ISBN debe tener..., title: El titulo..."
 *   - Regla de negocio (BusinessRuleException): un texto suelto, sin nombre de campo.
 *
 * Los mensajes no se reescriben ni se reinterpretan: se colocan bajo el campo correcto
 * (AN050 sección 4.1, regla 4).
 */
export interface ErroresDelServidor {
    //Por nombre de campo del DTO: isbn, title, dni...
    porCampo: Record<string, string>;
    //Lo que no se pudo atribuir a un campo concreto
    general?: string;
}

export function parsearErroresDelServidor(
    error: HttpErrorResponse,
    camposConocidos: readonly string[],
): ErroresDelServidor {
    const mensaje: string = error.error?.message ?? error.message ?? 'La operación fue rechazada.';

    const porCampo: Record<string, string> = {};
    const sueltos: string[] = [];

    for (const trozo of mensaje.split(',')) {
        const separador = trozo.indexOf(':');
        const campo = separador > 0 ? trozo.slice(0, separador).trim() : '';

        if (camposConocidos.includes(campo)) {
            porCampo[campo] = trozo.slice(separador + 1).trim();
        } else {
            sueltos.push(trozo.trim());
        }
    }

    const general = sueltos.join(', ');

    return general ? { porCampo, general } : { porCampo };
}
