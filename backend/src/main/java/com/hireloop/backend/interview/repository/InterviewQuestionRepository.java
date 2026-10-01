package com.hireloop.backend.interview.repository;

import com.hireloop.backend.interview.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByInterviewId(Long interviewId);
    Optional<InterviewQuestion> findByInterviewIdAndQuestionId(Long interviewId, Long questionId);
    boolean existsByInterviewIdAndQuestionId(Long interviewId, Long questionId);
    boolean existsByQuestionId(Long questionId);
}