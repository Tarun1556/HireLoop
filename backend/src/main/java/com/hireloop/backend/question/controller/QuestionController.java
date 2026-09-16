package com.hireloop.backend.question.controller;

import com.hireloop.backend.question.dto.QuestionRequest;
import com.hireloop.backend.question.dto.QuestionResponse;
import com.hireloop.backend.question.entity.QuestionCategory;
import com.hireloop.backend.question.entity.QuestionDifficulty;
import com.hireloop.backend.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> createQuestion(@Valid @RequestBody QuestionRequest request) {
        QuestionResponse response = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<QuestionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<List<QuestionResponse>> getAll(
            @RequestParam(required = false) QuestionCategory category,
            @RequestParam(required = false) QuestionDifficulty difficulty) {
        return ResponseEntity.ok(questionService.getAll(category, difficulty));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}