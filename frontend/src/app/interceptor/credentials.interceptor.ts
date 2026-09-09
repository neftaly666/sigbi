import { HttpInterceptorFn } from "@angular/common/http";

//Cuatro lineas, y sin ellas el modo cookie no funciona: withCredentials es lo que permite
//al navegador guardar y enviar la cookie jwt entre :4200 y :8080.
//Se aplica a todas las peticiones; en modo bearer simplemente no hay cookie que mandar
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {

    const cloned = req.clone({ withCredentials: true });

    return next(cloned);
}
