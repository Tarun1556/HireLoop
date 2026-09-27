package com.hireloop.backend.evaluation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequest {

    @NotNull
    @Min(0) @Max(10)
    private Double technicalScore;

    @NotNull
    @Min(0) @Max(10)
    private Double communicationScore;

    @NotNull
    @Min(0) @Max(10)
    private Double problemSolvingScore;

    private String feedback;
}