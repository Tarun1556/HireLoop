package com.hireloop.backend.auth.dto;

import com.hireloop.backend.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String token; // null for now — populated starting Day 11 (JWT)
}