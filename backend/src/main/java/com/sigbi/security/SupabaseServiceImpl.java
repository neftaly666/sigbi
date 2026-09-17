package com.sigbi.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

//Unico punto del backend que habla con Supabase Auth. Aquí viven las contraseñas, no en user_data
@Slf4j
@Service
public class SupabaseServiceImpl implements ISupabaseService {

    private static final String API_KEY_HEADER = "apikey";

    private final RestClient restClient = RestClient.create();

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    //Clave pública: solo sirve para pedir el token con email y password
    @Value("${app.supabase.anon-key}")
    private String supabaseAnonKey;

    //Salta cualquier regla de seguridad de Supabase: solo se usa para crear usuarios y nunca sale del servidor
    @Value("${app.supabase.service-role-key}")
    private String supabaseServiceRoleKey;

    @Override
    public SupabaseSession login(String username, String password) {
        try {
            return restClient.post()
                    .uri(supabaseUrl + "/auth/v1/token?grant_type=password")
                    .header(API_KEY_HEADER, supabaseAnonKey)
                    .body(Map.of("email", username, "password", password))
                    .retrieve()
                    .body(SupabaseSession.class);
        } catch (RestClientResponseException e) {
            //El motivo exacto se queda en el log, al cliente le llega un 401 sin cuerpo
            log.warn("SUPABASE LOGIN FAILED: {}", e.getResponseBodyAsString());
            throw new BadCredentialsException("INVALID CREDENTIALS");
        } catch (RestClientException e) {
            throw new BadCredentialsException("SUPABASE AUTH NOT AVAILABLE", e);
        }
    }

    @Override
    public SupabaseUser createAuthUser(String email, String password, String username) {
        try {
            //email_confirm deja al usuario activo sin pasar por el correo de confirmación
            return restClient.post()
                    .uri(supabaseUrl + "/auth/v1/admin/users")
                    .header(API_KEY_HEADER, supabaseServiceRoleKey)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseServiceRoleKey)
                    .body(Map.of(
                            "email", email,
                            "password", password,
                            "email_confirm", true,
                            "user_metadata", Map.of("username", username)
                    ))
                    .retrieve()
                    .body(SupabaseUser.class);
        } catch (RestClientResponseException e) {
            throw new IllegalArgumentException("SUPABASE USER NOT CREATED: " + e.getResponseBodyAsString(), e);
        } catch (RestClientException e) {
            throw new IllegalArgumentException("SUPABASE ADMIN API NOT AVAILABLE: " + e.getMessage(), e);
        }
    }

    @Override
    public void logout(String accessToken) {
        try {
            restClient.post()
                    .uri(supabaseUrl + "/auth/v1/logout")
                    .header(API_KEY_HEADER, supabaseAnonKey)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            throw new IllegalStateException("SUPABASE LOGOUT FAILED: " + e.getMessage(), e);
        }
    }
}
