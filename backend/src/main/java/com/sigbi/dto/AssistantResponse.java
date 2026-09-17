package com.sigbi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * `configured` en false significa que la respuesta no viene del modelo sino del propio
 * sistema, y la pantalla la presenta como aviso en vez de como respuesta del asistente.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssistantResponse {

    private String content;

    private boolean configured;
}
