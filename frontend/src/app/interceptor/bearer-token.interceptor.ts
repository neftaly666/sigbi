import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { TOKEN_NAME } from "../services/login.service";

export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {

    //En modo cookie no hay nada que agregar: el token viaja solo y JavaScript no puede leerlo
    if(environment.AUTH_MODE !== 'bearer') return next(req);

    const token = sessionStorage.getItem(TOKEN_NAME);

    if(!token) return next(req);

    const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next(cloned);
}
