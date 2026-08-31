package com.hireloop.backend.candidate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String resumeUrl;
    private String experience;
    private LocalDateTime createdAt;
}