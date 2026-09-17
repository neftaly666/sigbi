import { computed, inject, Service } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.development";
import { LoginService } from "../services/login.service";

interface UsuarioAutenticado {
    username: string;
}

/**
 * Quién ha entrado. Lo dice `GET /auth/user`, que devuelve el `email` del token de
 * Supabase gracias a `setPrincipalClaimName("email")` del backend.
 *
 * Antes no lo consumía nadie: el pie del menú llevaba "Bibliotecario" escrito a mano en la
 * plantilla, y `userInfoUrl` existía con un comentario que decía que lo usaba
 * `DashboardStore` cuando no era cierto (DV-38 de AN090).
 *
 * Vive aquí y no en el layout porque lo necesitan dos sitios: el pie del menú lateral y el
 * avatar de la cabecera, que es la única salida que hay en un teléfono.
 */
@Service()
export class SessionStore {

    private readonly loginService = inject(LoginService);
    private readonly router = inject(Router);

    /*
     * Con AUTH_ENABLED en false NO se llama al endpoint. No es una optimización: sin
     * seguridad la cadena del backend está en `permitAll`, así que la ruta responde 200
     * con el nombre del usuario anónimo de Spring -"anonymousUser"-, que no es un dato
     * sino un artefacto. Devolver `undefined` deja el recurso en reposo, sin petición.
     */
    private readonly usuarioResource = httpResource<UsuarioAutenticado>(
        () => environment.AUTH_ENABLED ? this.loginService.userInfoUrl : undefined,
    );

    //`value()` lanza cuando el recurso está en error; `hasValue()` es el guardia que toca
    readonly $correo = computed(() =>
        this.usuarioResource.hasValue() ? this.usuarioResource.value().username : '',
    );

    /**
     * La cuenta: lo que va antes de la arroba. El correo entero no cabe en los 248 px del
     * menú y recortado por la mitad no identifica a nadie; la parte local sí.
     *
     * Vacía mientras carga o si falla, y la plantilla oculta entonces esa línea en vez de
     * inventar un nombre: el perfil de debajo sigue en pie y la fila no se descuadra.
     */
    readonly $cuenta = computed(() => {
        if (!environment.AUTH_ENABLED) return 'Sin sesión';

        return this.$correo().split('@')[0];
    });

    //La navegación no espera la respuesta: la sesión ya se está invalidando en el servidor
    salir() {
        this.loginService.logout().subscribe();

        this.router.navigate(['/login']);
    }
}
