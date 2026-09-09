package com.mitocode.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.stereotype.Component;

//Modo didactico: el token llega en la cabecera Authorization, comodo para Postman
@Component
@ConditionalOnProperty(name = "app.auth.mode", havingValue = "bearer")
public class HeaderBearerTokenResolver implements BearerTokenResolver {

    private final DefaultBearerTokenResolver delegate = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        return delegate.resolve(request);
    }
}
