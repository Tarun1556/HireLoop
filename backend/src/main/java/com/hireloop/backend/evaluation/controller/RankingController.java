package com.hireloop.backend.evaluation.controller;

import com.hireloop.backend.evaluation.dto.CandidateRanking;
import com.hireloop.backend.evaluation.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/candidates/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERVIEWER')")
    public ResponseEntity<List<CandidateRanking>> getRankings() {
        return ResponseEntity.ok(rankingService.getRankings());
    }
}