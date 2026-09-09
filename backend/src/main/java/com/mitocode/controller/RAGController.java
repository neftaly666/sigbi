package com.mitocode.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.reader.ExtractedTextFormatter;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.reader.pdf.config.PdfDocumentReaderConfig;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//RAG: Retrieval Augmented Generation
@RestController
@RequestMapping("/v1/rag")
@RequiredArgsConstructor
public class RAGController {

    private final OpenAiEmbeddingModel openAiEmbeddingModel;
    private final VectorStore vectorStore;
    private final OpenAiChatModel openAiChatModel;

    @GetMapping("/embedding")
    public Map<String, EmbeddingResponse> generate(@RequestParam String message){
         EmbeddingResponse response = openAiEmbeddingModel.embedForResponse(List.of(message));
         return Map.of("embedding", response);
    }

    @GetMapping("/ingest")
    public ResponseEntity<Void> ingest() {
        PagePdfDocumentReader pdfReader = new PagePdfDocumentReader("classpath:/pdfs/farmacologia.pdf",
                PdfDocumentReaderConfig.builder()
                        .withPageTopMargin(0)
                        .withPageExtractedTextFormatter(ExtractedTextFormatter.builder()
                                .withNumberOfTopTextLinesToDelete(0)
                                .build())
                        .withPagesPerDocument(1) //chunked fragments
                        .build());

        List<Document> documents = pdfReader.read();
        vectorStore.add(documents); //aqui se generan los embeddings y se insertan en pgvector

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<String> ragPDF(@RequestParam String message){
        List<Document> results = vectorStore.similaritySearch(SearchRequest.builder().query(message).topK(2).build());

        String information = results.stream().map(Document::getText).collect(Collectors.joining("\n "));

        PromptTemplate promptTemplate = new PromptTemplate(
                "Responde esta pregunta {message} con la siguiente informacion: {information}"
        );

        Prompt prompt = promptTemplate.create(Map.of(
                "message", message,
                "information", information
        ));

        ChatResponse chatResponse = openAiChatModel.call(prompt);

        return ResponseEntity.ok(chatResponse.getResult().getOutput().getText());
    }
}
