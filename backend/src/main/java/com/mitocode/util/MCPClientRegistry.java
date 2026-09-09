package com.mitocode.util;

import io.modelcontextprotocol.client.McpSyncClient;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class MCPClientRegistry {

    private final Map<String, McpSyncClient> clientsByName;

    public MCPClientRegistry(List<McpSyncClient> mcpSyncClients) {
        this.clientsByName = mcpSyncClients.stream()
                .collect(Collectors.toMap(
                        c -> c.getServerInfo().name(),
                        c -> c
                ));
    }

    public McpSyncClient getRequired(String name) {
        return Optional.ofNullable(clientsByName.get(name))
                .orElseThrow(() -> new IllegalStateException("MCP NOT FOUND: " + name));
    }
}
