import { AuthMode } from '../app/model/auth-mode';

export const environment = {
    HOST: 'http://localhost:8080',
    RETRY: 2,
    //Tiene que decir lo mismo que app.auth.mode del backend, si no todo responde 401
    AUTH_MODE: 'bearer' as AuthMode,
    //false abre la aplicación sin pedir acceso, como AUTH_ENABLED del backend
    AUTH_ENABLED: false
};
