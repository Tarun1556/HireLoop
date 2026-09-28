package com.hireloop.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private long totalCandidates;
    private long totalInterviewers;
    private long totalInterviews;
    private long scheduledInterviews;
    private long completedInterviews;
    private long cancelledInterviews;
    private long totalQuestions;
    private long totalEvaluations;
    private Double averageOverallScore;
}