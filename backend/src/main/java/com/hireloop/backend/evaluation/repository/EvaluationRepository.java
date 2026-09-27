package com.hireloop.backend.evaluation.repository;

import com.hireloop.backend.evaluation.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByInterviewId(Long interviewId);
    boolean existsByInterviewId(Long interviewId);
    List<Evaluation> findByInterview_Candidate_Id(Long candidateId);
}