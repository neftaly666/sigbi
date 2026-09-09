package com.mitocode.controller;

import com.mitocode.dto.ExamDetailOutput;
import com.mitocode.dto.ExamOutput;
import com.mitocode.model.Exam;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/chats")
@RequiredArgsConstructor
public class ChatController {

    private final OpenAiChatModel openAiChatModel;
    private final ChatMemory chatMemory;
    private final JdbcChatMemoryRepository jdbcChatMemoryRepository;

    @GetMapping
    public ResponseEntity<String> chat(String message){
        String response = openAiChatModel.call(message);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/converter")
    public ResponseEntity<ExamOutput> generateOutput(@RequestParam String exam){
        BeanOutputConverter<ExamOutput> converter = new BeanOutputConverter<>(ExamOutput.class);

        String template = """
                Tell me a brief summary of this {exam}, what are the prerequisites, who can take it. Only i need a explication of the exam. {format}
                """;

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Prompt prompt = promptTemplate.create(Map.of("exam", exam, "format", converter.getFormat()));

        ChatResponse chatResponse = openAiChatModel.call(prompt);
        String result = chatResponse.getResult().getOutput().getText();
        //System.out.println(result);
        ExamOutput examOutput = converter.convert(result);

        return ResponseEntity.ok(examOutput);
    }

    @GetMapping("/converter/detail")
    public ResponseEntity<ExamDetailOutput> generateDetailOutput(@RequestParam String exam){
        BeanOutputConverter<ExamDetailOutput> converter = new BeanOutputConverter<>(ExamDetailOutput.class);

        String template = """
                Tell me a brief summary of this {exam}, what are the prerequisites, who can take it. Only i need a explication of the exam. {format}
                """;

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Prompt prompt = promptTemplate.create(Map.of("exam", exam, "format", converter.getFormat()));

        ChatResponse chatResponse = openAiChatModel.call(prompt);
        String result = chatResponse.getResult().getOutput().getText();
        //System.out.println(result);
        ExamDetailOutput examDetailOutput = converter.convert(result);

        return ResponseEntity.ok(examDetailOutput);
    }

    @GetMapping("/generateConversation")
    public ResponseEntity<String> generateConversation(@RequestParam String message){
        List<Message> listMessage = new ArrayList<>();
        UserMessage chatMessage1 = new UserMessage("Hablemos del medicamento paracetamol");
        UserMessage chatMessage2 = new UserMessage(message);

        listMessage.add(chatMessage1);
        listMessage.add(chatMessage2);

        ChatResponse chatResponse = openAiChatModel.call(new Prompt(listMessage));
        String result = chatResponse.getResult().getOutput().getText();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/memory")
    public ResponseEntity<String> memory(@RequestParam String message){
        chatMemory.add("1", List.of(new UserMessage(message)));

        ChatResponse chatResponse = openAiChatModel.call(new Prompt(chatMemory.get("1")));
        String result = chatResponse.getResult().getOutput().getText();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/jdbcRepo")
    public ResponseEntity<String> jdbcRepo(@RequestParam String username, @RequestParam String message){
        ChatMemory chatMemoryRepo = MessageWindowChatMemory.builder()
                .chatMemoryRepository(jdbcChatMemoryRepository)
                .maxMessages(3)
                .build();

        chatMemoryRepo.add(username, List.of(new UserMessage(message)));
        ChatResponse chatResponse = openAiChatModel.call(new Prompt(chatMemoryRepo.get(username)));
        String result = chatResponse.getResult().getOutput().getText();

        return ResponseEntity.ok(result);
    }
}
