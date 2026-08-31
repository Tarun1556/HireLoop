package com.hireloop.backend.candidate.controller;

import com.hireloop.backend.candidate.dto.CandidateRequest;
import com.hireloop.backend.candidate.dto.CandidateResponse;
import com.hireloop.backend.candidate.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateResponse> createMyProfile(
            @Valid @RequestBody CandidateRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        CandidateResponse response = candidateService.createProfile(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateResponse> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        CandidateResponse response = candidateService.getMyProfile(email);
        return ResponseEntity.ok(response);
    }
}