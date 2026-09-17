import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { BearerLoginResponse } from '../model/bearer-login-response';
import { ILoginRequest } from '../model/login-request';

//sessionStorage y no localStorage: el token muere con la pestaña
export const TOKEN_NAME = 'access_token';

//No extiende GenericService: detrás de /login no hay un recurso CRUD
@Service()
export class LoginService {

    private readonly http = inject(HttpClient);

    private readonly loginUrl = `${environment.HOST}/login`;
    private readonly bearerLoginUrl = `${environment.HOST}/login/bearer`;
    private readonly logoutUrl = `${environment.HOST}/auth/logout`;
    //Publico porque DashboardStore lo consume con httpResource, que necesita la url y no un Observable
    readonly userInfoUrl = `${environment.HOST}/auth/user`;

    //La única clase que conoce las dos formas de autenticarse
    login(username: string, password: string): Observable<boolean> {
        const body: ILoginRequest = { username, password };

        if (environment.AUTH_MODE === 'bearer') {
            return this.http.post<BearerLoginResponse>(this.bearerLoginUrl, body).pipe(
                tap(response => sessionStorage.setItem(TOKEN_NAME, response.access_token)),
                map(() => true),
            );
        }

        //Modo cookie: el backend devuelve true y el token viaja en una cookie HttpOnly
        return this.http.post<boolean>(this.loginUrl, body);
    }

    //Limpia sessionStorage siempre, también en modo cookie: no cuesta nada y evita tokens viejos
    logout(){
        return this.http.get<void>(this.logoutUrl).pipe(
            tap(() => sessionStorage.removeItem(TOKEN_NAME)),
        );
    }
}
