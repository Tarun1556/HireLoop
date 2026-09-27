package com.hireloop.backend.evaluation.service;

import com.hireloop.backend.evaluation.dto.EvaluationRequest;
import com.hireloop.backend.evaluation.dto.EvaluationResponse;
import com.hireloop.backend.evaluation.entity.Evaluation;
import com.hireloop.backend.evaluation.repository.EvaluationRepository;
import com.hireloop.backend.interview.entity.Interview;
import com.hireloop.backend.interview.entity.InterviewType;
import com.hireloop.backend.interview.repository.InterviewRepository;
import com.hireloop.backend.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewService interviewService; // reuse checkOwnership

    private static final Map<InterviewType, double[]> WEIGHTS = Map.of(
            // {technical, communication, problemSolving}
            InterviewType.TECHNICAL,  new double[]{0.50, 0.20, 0.30},
            InterviewType.HR,         new double[]{0.20, 0.50, 0.30},
            InterviewType.MANAGERIAL, new double[]{0.20, 0.40, 0.40},
            InterviewType.FINAL,      new double[]{0.34, 0.33, 0.33}
    );

    public EvaluationResponse submitEvaluation(Long interviewId, EvaluationRequest request, Authentication authentication) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + interviewId));

        interviewService.checkOwnership(interview, authentication);

        Evaluation evaluation = evaluationRepository.findByInterviewId(interviewId)
                .orElseGet(Evaluation::new);

        evaluation.setInterview(interview);
        evaluation.setTechnicalScore(request.getTechnicalScore());
        evaluation.setCommunicationScore(request.getCommunicationScore());
        evaluation.setProblemSolvingScore(request.getProblemSolvingScore());
        evaluation.setFeedback(request.getFeedback());
        evaluation.setOverallScore(calculateOverallScore(interview.getInterviewType(), request));

        Evaluation saved = evaluationRepository.save(evaluation);
        return toEvaluationResponse(saved);
    }

    public EvaluationResponse getEvaluation(Long interviewId, Authentication authentication) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + interviewId));

        interviewService.checkOwnership(interview, authentication);

        Evaluation evaluation = evaluationRepository.findByInterviewId(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("No evaluation found for interview id: " + interviewId));

        return toEvaluationResponse(evaluation);
    }

    private Double calculateOverallScore(InterviewType type, EvaluationRequest request) {
        double[] weights = WEIGHTS.get(type);
        double score = (request.getTechnicalScore() * weights[0])
                + (request.getCommunicationScore() * weights[1])
                + (request.getProblemSolvingScore() * weights[2]);
        return Math.round(score * 100.0) / 100.0; // round to 2 decimals
    }

    private EvaluationResponse toEvaluationResponse(Evaluation evaluation) {
        return new EvaluationResponse(
                evaluation.getId(),
                evaluation.getInterview().getId(),
                evaluation.getTechnicalScore(),
                evaluation.getCommunicationScore(),
                evaluation.getProblemSolvingScore(),
                evaluation.getOverallScore(),
                evaluation.getFeedback(),
                evaluation.getCreatedAt(),
                evaluation.getUpdatedAt()
        );
    }
}