package com.mitocode.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/agents")
@RequiredArgsConstructor
public class AgentController {

    private final ChatClient chatClient;
    private final ChatClient travelChatClient;
    //private final ChatClient medicalChatClient;

    private record BotResponse(String content){}
    public record ChatRequest(String message){}

    @GetMapping("/ask-medical-bot")
    public ResponseEntity<BotResponse> askBot(@RequestParam String message, @RequestParam String conversationId){
        String result = chatClient.prompt()
                .user(message)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();

        return ResponseEntity.ok(new BotResponse(result));
    }

    @PostMapping("/search")
    public String chat(@RequestBody ChatRequest request){
        return travelChatClient.prompt()
                .user(request.message())
                .call()
                .content();
    }

    /*@GetMapping("/ask-medical-mcp")
    public ResponseEntity<BotResponse> askMCP(@RequestParam String message){
        String result = medicalChatClient.prompt()
                .user(message)
                .call()
                .content();

        return ResponseEntity.ok(new BotResponse(result));
    }*/
}
