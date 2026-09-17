package com.sigbi.controller;

import com.sigbi.dto.AssistantRequest;
import com.sigbi.dto.AssistantResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * RF-14. Un solo endpoint: el asistente informa y no registra, así que no hay más verbos
 * que este POST (AN010 sección 6.3).
 */
@RestController
@RequestMapping("/v1/agents")
@RequiredArgsConstructor
public class AgentController {

    private static final String SIN_CLAVE =
            "El asistente no está configurado en este despliegue: falta la clave de OpenAI. "
            + "El resto del sistema funciona con normalidad; puedes consultar el catálogo en "
            + "**Libros** y las reservas en **Reservas**.";

    private final ChatClient libraryChatClient;

    //AN080 R-08: sin clave, el asistente lo dice en vez de reventar con un 500
    @Value("${spring.ai.openai.api-key:}")
    private String openAiKey;

    @PostMapping
    public ResponseEntity<AssistantResponse> ask(@Valid @RequestBody AssistantRequest request) {
        if (openAiKey == null || openAiKey.isBlank()) {
            return ResponseEntity.ok(new AssistantResponse(SIN_CLAVE, false));
        }

        String contenido = libraryChatClient.prompt()
                .user(request.getMessage())
                //El identificador lo pone el frontend y dura lo que dura la pestaña
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, request.getConversationId()))
                .call()
                .content();

        return ResponseEntity.ok(new AssistantResponse(contenido, true));
    }
}
