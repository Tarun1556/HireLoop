package com.hireloop.backend.interview.controller;

import com.hireloop.backend.interview.dto.InterviewRequest;
import com.hireloop.backend.interview.dto.InterviewResponse;
import com.hireloop.backend.interview.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<InterviewResponse> scheduleInterview(@Valid @RequestBody InterviewRequest request) {
        InterviewResponse response = interviewService.scheduleInterview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(interviewService.getInterviewById(id, authentication));
    }

    @GetMapping("/candidate/{candidateId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByCandidateId(@PathVariable Long candidateId) {
        return ResponseEntity.ok(interviewService.getInterviewsByCandidateId(candidateId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('INTERVIEWER')")
    public ResponseEntity<List<InterviewResponse>> getMyInterviews(Authentication authentication) {
        return ResponseEntity.ok(interviewService.getMyInterviewsAsInterviewer(authentication));
    }

    @GetMapping("/candidate/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<InterviewResponse>> getMyInterviewsAsCandidate(Authentication authentication) {
        return ResponseEntity.ok(interviewService.getMyInterviewsAsCandidate(authentication));
    }
}