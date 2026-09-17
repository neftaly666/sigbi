import { HttpErrorResponse } from "@angular/common/http";

/**
 * Un fallo HTTP, contado en espanol.
 *
 * Lo usan el interceptor -para el aviso- y los banners de error de cada pantalla, que si
 * pintaran `error.message` a secas mostrarian "Http failure response for
 * http://localhost:8080/v1/books: 0 undefined": un texto en inglés, con la URL interna
 * del backend dentro, delante de un bibliotecario.
 *
 * El mensaje del backend, cuando lo hay, se muestra tal cual y sin reescribirlo
 * (AN050 sección 4.1, regla 4).
 */
export function mensajeDeErrorHttp(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
        return 'No se pudo completar la operación.';
    }

    //status 0 primero: no hubo respuesta, y el `message` que trae entonces es el de la
    //capa de red -"Failed to fetch"-, no un texto del backend.
    if (error.status === 0) {
        return 'No se pudo contactar con el servidor. Comprueba que está encendido.';
    }

    const delBackend = typeof error.error?.message === 'string' ? error.error.message : null;

    if (delBackend) return delBackend;

    if (error.status === 404) return 'No existe el recurso solicitado.';

    return 'El servidor no pudo completar la operación.';
}
