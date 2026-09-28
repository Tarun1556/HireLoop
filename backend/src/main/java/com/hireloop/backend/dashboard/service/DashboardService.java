package com.hireloop.backend.dashboard.service;

import com.hireloop.backend.candidate.repository.CandidateRepository;
import com.hireloop.backend.dashboard.dto.DashboardSummaryResponse;
import com.hireloop.backend.evaluation.entity.Evaluation;
import com.hireloop.backend.evaluation.repository.EvaluationRepository;
import com.hireloop.backend.interview.entity.InterviewStatus;
import com.hireloop.backend.interview.repository.InterviewRepository;
import com.hireloop.backend.question.repository.QuestionRepository;
import com.hireloop.backend.user.entity.Role;
import com.hireloop.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final EvaluationRepository evaluationRepository;

    public DashboardSummaryResponse getSummary() {
        long totalCandidates = candidateRepository.count();
        long totalInterviewers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.INTERVIEWER)
                .count();

        List<com.hireloop.backend.interview.entity.Interview> allInterviews = interviewRepository.findAll();
        long totalInterviews = allInterviews.size();
        long scheduled = allInterviews.stream().filter(i -> i.getStatus() == InterviewStatus.SCHEDULED).count();
        long completed = allInterviews.stream().filter(i -> i.getStatus() == InterviewStatus.COMPLETED).count();
        long cancelled = allInterviews.stream().filter(i -> i.getStatus() == InterviewStatus.CANCELLED).count();

        long totalQuestions = questionRepository.count();

        List<Evaluation> allEvaluations = evaluationRepository.findAll();
        long totalEvaluations = allEvaluations.size();
        Double avgScore = allEvaluations.stream()
                .mapToDouble(Evaluation::getOverallScore)
                .average()
                .stream().boxed().findFirst()
                .map(v -> Math.round(v * 100.0) / 100.0)
                .orElse(null);

        return new DashboardSummaryResponse(
                totalCandidates, totalInterviewers, totalInterviews,
                scheduled, completed, cancelled,
                totalQuestions, totalEvaluations, avgScore
        );
    }
}