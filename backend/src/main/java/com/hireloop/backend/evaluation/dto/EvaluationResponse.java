package com.hireloop.backend.evaluation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponse {

    private Long id;
    private Long interviewId;
    private Double technicalScore;
    private Double communicationScore;
    private Double problemSolvingScore;
    private Double overallScore;
    private String feedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}