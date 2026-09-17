package com.sigbi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssistantRequest {

    @NotBlank(message = "{assistant.message.required}")
    @Size(max = 500, message = "{assistant.message.size}")
    private String message;

    //Hilo al que pertenece el mensaje. Lo genera el frontend al abrir la pantalla.
    @NotBlank
    @Size(max = 64)
    private String conversationId;
}
