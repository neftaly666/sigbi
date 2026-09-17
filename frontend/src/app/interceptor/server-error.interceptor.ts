import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, EMPTY, retry, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ERROR_DE_FORMULARIO } from "../shared/http/form-error.context";
import { mensajeDeErrorHttp } from "../shared/utils/http-error-message";

/**
 * Traduce el fallo a un aviso en español y decide quien más se entera.
 *
 * La regla importante está al final: **una lectura devuelve el error a quien la pidió**.
 * Cortar con EMPTY deja al `httpResource` sin valor y sin error, así que `isLoading()` se
 * queda en true para siempre: la pantalla se queda "Cargando..." y el banner de error de
 * AN050 sección 6, con su botón "Reintentar", no llega a aparecer nunca.
 */
export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {

    const snackBar = inject(MatSnackBar);
    const router = inject(Router);

    const retryCount = req.method === 'GET' ? environment.RETRY : 0;

    return next(req).pipe(
        tap((event) => {
            const body =
                event instanceof HttpResponse
                ? (event.body as { error?: boolean; errorMessage?: string })
                : null;
            if (body?.error === true && body.errorMessage) {
                throw new Error(body.errorMessage);
            }
        }),
        retry({ count: retryCount, delay: 1000 }),
        catchError((err: HttpErrorResponse) => {
            //PX-04: un 400 marcado como error de formulario se devuelve al que lo pidio,
            //para que lo pinte bajo el campo que lo provocó en vez de en un aviso genérico
            if (err.status === 400 && req.context.get(ERROR_DE_FORMULARIO)) {
                return throwError(() => err);
            }

            /*
             * Los dos códigos de sesión llevan a pantalla, el resto a un aviso (AN060
             * sección 9). La diferencia importa: un 401 se arregla volviendo a entrar, un
             * 403 no -la sesión es válida, el permiso no-, así que mandarlo al login sería
             * un bucle. Ambas páginas van fuera del shell.
             */
            if (err.status === 401) {
                snackBar.open('Tu sesión no es válida. Vuelve a entrar.', 'Cerrar', { duration: 6000 });
                router.navigate(['/login']);
            } else if (err.status === 403) {
                router.navigate(['/403']);
            } else {
                snackBar.open(mensajeDeErrorHttp(err), 'Cerrar', { duration: 6000 });
            }

            //Una lectura necesita el error para poder pintar su banner y ofrecer reintentar.
            //Una escritura no: su aviso ya se ha mostrado y el diálogo que la lanzo, cuando
            //le interesa el detalle, lo pide con ERROR_DE_FORMULARIO.
            return req.method === 'GET' ? throwError(() => err) : EMPTY;
        })
    );
}

