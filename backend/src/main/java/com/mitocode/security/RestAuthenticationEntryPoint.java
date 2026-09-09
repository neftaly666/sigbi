package com.mitocode.security;

import com.mitocode.exception.CustomErrorTemplate;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;

//Sin esta clase Spring devolveria una pagina HTML de error que el frontend no sabe interpretar
@Component
@RequiredArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final String DEFAULT_MESSAGE = "Token not found or invalid";

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        //Si algun filtro dejo un motivo mas concreto en la peticion, ese es el que se devuelve
        Object msg = request.getAttribute("msg");

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                msg != null ? msg.toString() : DEFAULT_MESSAGE,
                request.getRequestURI()
        );

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
