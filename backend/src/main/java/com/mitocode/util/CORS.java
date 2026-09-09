package com.mitocode.util;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.io.IOException;

//Se ejecuta antes que la cadena de seguridad, si no el 401 saldria sin cabeceras CORS
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CORS implements Filter {

    //Origen concreto, nunca *: con Allow-Credentials el navegador descarta la respuesta comodin
    @Value("${app.front.url}")
    private String frontURL; //= "http://localhost:4200";

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        response.setHeader("Access-Control-Allow-Origin", frontURL);
        //Sin esta cabecera la cookie jwt no viaja ni se guarda
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        response.setHeader("Access-Control-Expose-Headers", HttpHeaders.SET_COOKIE);
        response.setHeader("Access-Control-Max-Age", "3600");

        //El preflight se responde aqui mismo, no baja a la cadena de seguridad
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }
}

