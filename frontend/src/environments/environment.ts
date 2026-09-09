import { AuthMode } from '../app/model/auth-mode';

export const environment = {
    HOST: 'URL_FRONTEND_AZURE',
    RETRY: 2,
    //Tiene que decir lo mismo que app.auth.mode del backend, si no todo responde 401
    AUTH_MODE: 'bearer' as AuthMode
};
