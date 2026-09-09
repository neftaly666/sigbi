//Cuerpo de /login/bearer. En modo cookie esta respuesta no existe: el token no llega a JavaScript
export interface BearerLoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
