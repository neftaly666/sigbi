import { inject, Service } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs";

/**
 * AN050 sección 3.5: dos disposiciones, no hay tercera. El corte está en 1024 px y es el
 * mismo que usan las hojas de estilo, así que vive aquí una sola vez.
 *
 * Hace falta en TypeScript y no solo en CSS porque a partir de este ancho la tabla no se
 * encoge: se sustituye por tarjetas. Son dos arboles distintos, y renderizar los dos para
 * esconder uno con `display: none` dejaría en el DOM una tabla que el lector de pantalla
 * sigue anunciando.
 */
export const ANCHO_ESTRECHO = '(max-width: 1023px)';

@Service()
export class LayoutBreakpointService {

    private readonly breakpointObserver = inject(BreakpointObserver);

    readonly $esEstrecha = toSignal(
        this.breakpointObserver.observe(ANCHO_ESTRECHO).pipe(map((estado) => estado.matches)),
        { initialValue: this.breakpointObserver.isMatched(ANCHO_ESTRECHO) },
    );
}
