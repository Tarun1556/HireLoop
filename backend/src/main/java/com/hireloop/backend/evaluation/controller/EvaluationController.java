package com.hireloop.backend.evaluation.controller;

import com.hireloop.backend.evaluation.dto.EvaluationRequest;
import com.hireloop.backend.evaluation.dto.EvaluationResponse;
import com.hireloop.backend.evaluation.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews/{interviewId}/evaluation")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<EvaluationResponse> submitEvaluation(
            @PathVariable Long interviewId,
            @Valid @RequestBody EvaluationRequest request,
            Authentication authentication) {
        EvaluationResponse response = evaluationService.submitEvaluation(interviewId, request, authentication);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<EvaluationResponse> getEvaluation(
            @PathVariable Long interviewId,
            Authentication authentication) {
        return ResponseEntity.ok(evaluationService.getEvaluation(interviewId, authentication));
    }
}