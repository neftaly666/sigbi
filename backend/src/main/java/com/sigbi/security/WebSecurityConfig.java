package com.sigbi.security;

import com.sigbi.model.Role;
import com.sigbi.model.User;
import com.sigbi.repo.IUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    //Solo existe uno de los dos resolvers, el que habilite app.auth.mode
    private final BearerTokenResolver bearerTokenResolver;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final IUserRepo userRepo;

    /**
     * PA-02. Spring Security es opcional según el enunciado (sección 4 y sección 7). Con la
     * cadena cerrada, cualquier petición a /v1/** responde 401 y no se pueden
     * ejecutar ni la carga de datos ni la prueba de aceptación sin emitir un
     * token de Supabase. Esta variable permite decidirlo en el despliegue en vez
     * de en el codigo. Por defecto va ACTIVA: abrir requiere un acto explicito.
     */
    @Value("${app.auth.enabled:true}")
    private boolean authEnabled;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //API stateless consumida por una SPA: no hay formulario ni token CSRF que enviar
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable);

        if (!authEnabled) {
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }

        http
                .authorizeHttpRequests(auth -> auth
                        //El preflight viaja sin cookie ni cabecera, cerrarlo rompería el CORS
                        .requestMatchers("/login/**", "/auth/logout").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception.authenticationEntryPoint(restAuthenticationEntryPoint))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(bearerTokenResolver)
                        .authenticationEntryPoint(restAuthenticationEntryPoint)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }

    //El corazón de la autorización: mezcla lo que trae el token con lo que dice la base
    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter scopesConverter = new JwtGrantedAuthoritiesConverter();

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        //authentication.getName() pasa a ser el email en vez del uuid: de ahi sale GET /auth/user
        converter.setPrincipalClaimName("email");
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            Collection<GrantedAuthority> scopes = scopesConverter.convert(jwt);
            if (scopes != null) {
                authorities.addAll(scopes);
            }

            authorities.addAll(getRoleAuthorities(jwt));
            authorities.addAll(getLocalRoleAuthorities(jwt));

            return authorities;
        });

        return converter;
    }

    //El claim role de Supabase vale authenticated para todos, no distingue un ADMIN de un USER
    private Collection<GrantedAuthority> getRoleAuthorities(Jwt jwt) {
        String role = jwt.getClaimAsString("role");

        if (role == null || role.isBlank()) {
            return List.of();
        }

        return List.of(new SimpleGrantedAuthority(role));
    }

    //Los roles de la aplicación son locales: cambiarlos es un UPDATE, no reemitir el token.
    //Se leen en cada petición, así que hay una consulta a user_data por llamada
    private Collection<GrantedAuthority> getLocalRoleAuthorities(Jwt jwt) {
        return userRepo.findOneBySupabaseUserId(jwt.getSubject())
                //enabled = false deja el token valido pero sin ninguna autoridad local
                .filter(User::isEnabled)
                .map(User::getRoles)
                .orElseGet(List::of)
                .stream()
                .map(Role::getName)
                .map(name -> (GrantedAuthority) new SimpleGrantedAuthority(name))
                .toList();
    }
}
