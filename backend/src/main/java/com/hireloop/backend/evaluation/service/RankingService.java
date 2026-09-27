package com.hireloop.backend.evaluation.service;

import com.hireloop.backend.candidate.entity.Candidate;
import com.hireloop.backend.candidate.repository.CandidateRepository;
import com.hireloop.backend.evaluation.dto.CandidateRanking;
import com.hireloop.backend.evaluation.entity.Evaluation;
import com.hireloop.backend.evaluation.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final CandidateRepository candidateRepository;
    private final EvaluationRepository evaluationRepository;

    public List<CandidateRanking> getRankings() {
        List<Candidate> candidates = candidateRepository.findAll();
        List<CandidateRanking> rankings = new ArrayList<>();

        for (Candidate candidate : candidates) {
            List<Evaluation> evaluations = evaluationRepository.findByInterview_Candidate_Id(candidate.getId());

            if (evaluations.isEmpty()) {
                continue; // exclude un-evaluated candidates from ranking
            }

            double average = evaluations.stream()
                    .mapToDouble(Evaluation::getOverallScore)
                    .average()
                    .orElse(0.0);

            rankings.add(new CandidateRanking(
                    0, // rank assigned after sort
                    candidate.getId(),
                    candidate.getUser().getName(),
                    Math.round(average * 100.0) / 100.0,
                    evaluations.size()
            ));
        }

        rankings.sort((a, b) -> Double.compare(b.getAverageScore(), a.getAverageScore()));

        for (int i = 0; i < rankings.size(); i++) {
            rankings.get(i).setRank(i + 1);
        }

        return rankings;
    }
}