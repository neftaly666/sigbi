package com.mitocode.config;

import com.mitocode.tool.ConsultTool;
import com.mitocode.tool.ExamTool;
import com.mitocode.tool.MedicTool;
import com.mitocode.util.MCPClientRegistry;
import com.mitocode.util.PromptLoader;
import io.modelcontextprotocol.client.McpSyncClient;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.mcp.McpToolUtils;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class AgentConfig {

    @Bean
    public ChatClient chatClient(OpenAiChatModel chatModel,
                                 PromptLoader promptLoader,
                                 ExamTool examTool,
                                 MedicTool medicTool,
                                 ConsultTool consultTool
                                 ){
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(10)
                .build();

        return ChatClient.builder(chatModel)
                /*.defaultSystem("""
                        Eres un asistente virtual que trabaja en un hospital.
                        SOLO puedes hablar sobre temas medicos, examenes y reservaciones de consultas.
                        Si el usuario pregunta algo fuera del dominio, responde:
                        "Solo puedo ayudarte con información de médicos, examenes y consultas."
                        """)*/
                .defaultSystem(promptLoader.load("main-agent.md"))
                .defaultTools(examTool, medicTool, consultTool)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }

    /*@Bean("travelChatClient")
    public ChatClient travelChatClient(OpenAiChatModel chatModel,
                                       PromptLoader promptLoader,
                                       ToolCallbackProvider toolCallbackProvider
                                       ){
        return ChatClient.builder(chatModel)
                .defaultSystem(promptLoader.load("travel-agent.md"))
                .defaultTools(toolCallbackProvider.getToolCallbacks())
                .build();
    }*/

    /*@Bean
    public ChatClient medicalChatClient(OpenAiChatModel chatModel,
                                        PromptLoader promptLoader,
                                        MCPClientRegistry mcpClientRegistry
                                        ){
        McpSyncClient medicalClient = mcpClientRegistry.getRequired("medical-mcp");
        List<ToolCallback> medicalToolsMCP = McpToolUtils.getToolCallbacksFromSyncClients(medicalClient);

        return ChatClient.builder(chatModel)
                .defaultSystem(promptLoader.load("medical-agent.md"))
                .defaultTools(medicalToolsMCP)
                .build();
    }*/
}
