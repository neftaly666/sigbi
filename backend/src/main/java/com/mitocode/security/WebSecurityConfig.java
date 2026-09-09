package com.mitocode.security;

import com.mitocode.model.Role;
import com.mitocode.model.User;
import com.mitocode.repo.IUserRepo;
import lombok.RequiredArgsConstructor;
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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //API stateless consumida por una SPA: no hay formulario ni token CSRF que enviar
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        //El preflight viaja sin cookie ni cabecera, cerrarlo romperia el CORS
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

    //El corazon de la autorizacion: mezcla lo que trae el token con lo que dice la base
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

    //Los roles de la aplicacion son locales: cambiarlos es un UPDATE, no reemitir el token.
    //Se leen en cada peticion, asi que hay una consulta a user_data por llamada
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
