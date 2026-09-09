package com.mitocode.controller;

import io.modelcontextprotocol.client.McpSyncClient;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.McpToolUtils;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/mcp")
@RequiredArgsConstructor
public class MCPController {

    /*private final ToolCallbackProvider toolCallbackProvider;
    private final List<McpSyncClient> mcpSyncClients;

    @GetMapping("/tools")
    public List<String> tools(){
        ToolCallback[] callbacks = toolCallbackProvider.getToolCallbacks();

        return Arrays.stream(callbacks)
                .map(tool -> tool.getToolDefinition().name())
                .sorted()
                .toList();
    }

    @GetMapping("/tools/bymcp")
    public Map<String, List<String>> toolsByMCP() {

        return mcpSyncClients.stream()
                .collect(Collectors.toMap(
                        c -> c.getServerInfo().name(),
                        c -> McpToolUtils.getToolCallbacksFromSyncClients(c).stream()
                                .map(t -> t.getToolDefinition().name())
                                .toList()
                ));
    }*/
}
