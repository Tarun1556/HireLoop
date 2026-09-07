package com.hireloop.backend.interview.repository;

import com.hireloop.backend.interview.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByCandidateId(Long candidateId);

    List<Interview> findByInterviewerId(Long interviewerId);
}