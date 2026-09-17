package com.sigbi.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//Alternativa a hasAuthority(...) cuando la regla se complica: @PreAuthorize("@authorizeLogic.hasAccess('findAll')")
@Component("authorizeLogic")
public class AuthorizeLogic {

    public boolean hasAccess(String logicName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return false;
        }

        Set<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        List<String> allowed = switch (logicName) {
            case "findAll", "findById" -> List.of("ADMIN", "USER", "DBA");
            case "save", "update" -> List.of("ADMIN", "DBA");
            case "delete" -> List.of("ADMIN");
            default -> List.<String>of();
        };

        return allowed.stream().anyMatch(authorities::contains);
    }
}
