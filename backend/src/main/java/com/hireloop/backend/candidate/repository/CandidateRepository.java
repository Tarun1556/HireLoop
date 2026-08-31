package com.hireloop.backend.candidate.repository;

import com.hireloop.backend.candidate.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}