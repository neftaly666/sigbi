import { inject, Service, signal } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { LoginService } from "../services/login.service";

@Service({ autoProvided: false })
export class LoginStore {

    private readonly loginService = inject(LoginService);
    private readonly router = inject(Router);

    private readonly _loggingIn = signal(false);
    readonly $loggingIn = this._loggingIn.asReadonly();

    login(username: string, password: string){
        if(this._loggingIn()) return;

        this._loggingIn.set(true);

        this.loginService.login(username, password).pipe(
            //serverErrorInterceptor devuelve EMPTY: el suscriptor recibe complete y nunca error.
            //Apagarlo en el callback error dejaria el boton bloqueado tras el primer fallo
            finalize(() => this._loggingIn.set(false)),
        ).subscribe(() => {
            //Solo se navega si llego una respuesta: un 401 levanta el snackbar y la pantalla se queda
            this.router.navigate(['/pages/dashboard']);
        });
    }
}
