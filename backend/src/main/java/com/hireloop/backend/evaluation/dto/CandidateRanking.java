package com.hireloop.backend.evaluation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateRanking {

    private int rank;
    private Long candidateId;
    private String candidateName;
    private Double averageScore;
    private int evaluationCount;
}