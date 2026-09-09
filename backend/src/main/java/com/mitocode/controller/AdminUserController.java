package com.mitocode.controller;

import com.mitocode.dto.AdminUserRequest;
import com.mitocode.dto.AdminUserResponse;
import com.mitocode.model.Role;
import com.mitocode.model.User;
import com.mitocode.service.IAdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/admin/users")
public class AdminUserController {

    private final IAdminUserService service;

    @PostMapping
    public ResponseEntity<AdminUserResponse> save(@Valid @RequestBody AdminUserRequest dto) throws Exception {
        User obj = service.create(dto);

        return ResponseEntity.ok(convertToDto(obj));
    }

    private AdminUserResponse convertToDto(User obj) {
        List<String> roles = obj.getRoles() == null ? List.of() : obj.getRoles().stream().map(Role::getName).toList();

        return new AdminUserResponse(obj.getIdUser(), obj.getUsername(), obj.getSupabaseUserId(), obj.isEnabled(), roles);
    }
}
