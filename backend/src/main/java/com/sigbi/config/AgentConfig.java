package com.sigbi.config;

import com.sigbi.tool.CatalogTool;
import com.sigbi.tool.ReservationTool;
import com.sigbi.util.PromptLoader;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgentConfig {

    //Diez mensajes: suficiente para que "y de esa categoría?" se entienda, y poco para que
    //la ventana de contexto no crezca sin control
    private static final int MENSAJES_RECORDADOS = 10;

    /**
     * El asistente de RF-14. Solo se le entregan herramientas de lectura: la negativa a
     * registrar una reserva (AN120 paso 5.1.3) no descansa en el prompt, sino en que no
     * existe ninguna herramienta que escriba.
     *
     * La memoria es en memoria del proceso y no la tabla JDBC de Spring AI: una
     * conversación que muere con el servidor no obliga a documentar una tabla más en
     * AN070 ni a crearla en Supabase.
     */
    @Bean
    public ChatClient libraryChatClient(OpenAiChatModel chatModel,
                                        PromptLoader promptLoader,
                                        CatalogTool catalogTool,
                                        ReservationTool reservationTool) {
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(MENSAJES_RECORDADOS)
                .build();

        return ChatClient.builder(chatModel)
                .defaultSystem(promptLoader.load("library-agent.md"))
                .defaultTools(catalogTool, reservationTool)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }
}
