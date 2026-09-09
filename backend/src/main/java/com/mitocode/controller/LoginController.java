package com.mitocode.controller;

import com.mitocode.dto.LoginRequest;
import com.mitocode.security.BearerLoginResponse;
import com.mitocode.security.CookieBearerTokenResolver;
import com.mitocode.security.ISupabaseService;
import com.mitocode.security.SupabaseSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

//Sin @RequestMapping de clase: las rutas son absolutas y publicas
@Slf4j
@RestController
@RequiredArgsConstructor
public class LoginController {

    private final ISupabaseService supabaseService;
    //El mismo resolver que usa la cadena de seguridad, asi el logout funciona en los dos modos
    private final BearerTokenResolver bearerTokenResolver;

    @Value("${app.auth.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${app.auth.cookie.same-site:Lax}")
    private String sameSite;

    //Modo cookie: devuelve true, el token nunca llega al navegador como dato legible
    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@Valid @RequestBody LoginRequest request) {
        try {
            SupabaseSession session = supabaseService.login(request.getUsername(), request.getPassword());

            ResponseCookie cookie = ResponseCookie.from(CookieBearerTokenResolver.COOKIE_NAME, session.accessToken())
                    .httpOnly(true)
                    .secure(secureCookie)
                    .path("/")
                    .sameSite(sameSite)
                    .maxAge(Duration.ofSeconds(session.expiresIn() != null ? session.expiresIn() : 0))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(true);
        } catch (Exception e) {
            //401 sin cuerpo: al atacante no se le dice si el email existe
            log.warn("LOGIN FAILED: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    //Modo bearer: el mismo login devolviendo el token en el cuerpo, es el que se usa desde Postman
    @PostMapping("/login/bearer")
    public ResponseEntity<BearerLoginResponse> loginBearer(@Valid @RequestBody LoginRequest request) {
        try {
            SupabaseSession session = supabaseService.login(request.getUsername(), request.getPassword());

            return ResponseEntity.ok(BearerLoginResponse.from(session));
        } catch (Exception e) {
            log.warn("LOGIN FAILED: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/auth/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String token = bearerTokenResolver.resolve(request);

        if (token != null) {
            try {
                supabaseService.logout(token);
            } catch (Exception e) {
                //Deliberado: la sesion local no puede quedar viva porque un servicio externo no contesto
                log.warn("SUPABASE LOGOUT FAILED: {}", e.getMessage());
            }
        }

        //La cookie se limpia siempre, haya respondido Supabase o no
        ResponseCookie cookie = ResponseCookie.from(CookieBearerTokenResolver.COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(sameSite)
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    //No esta en la lista de rutas publicas: requiere token. Es lo que consume el dashboard
    @GetMapping("/auth/user")
    public ResponseEntity<Map<String, String>> user() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //getName() es el email gracias a setPrincipalClaimName("email")
        return ResponseEntity.ok(Map.of("username", authentication.getName()));
    }
}
