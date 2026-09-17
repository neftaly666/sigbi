import { AuthMode } from '../app/model/auth-mode';

export const environment = {
    //URL del BACKEND ya desplegado, sin barra final. El nombre HOST viene del proyecto
    //base; no es la URL del frontend, es contra quien este habla.
    HOST: 'https://sigbi-backend.onrender.com',
    RETRY: 2,
    //Tiene que decir lo mismo que app.auth.mode del backend, si no todo responde 401
    AUTH_MODE: 'bearer' as AuthMode,
    //true en produccion: espejo de app.auth.enabled del backend
    AUTH_ENABLED: true
};
