package com.hireloop.backend.interview.dto;

import com.hireloop.backend.interview.entity.InterviewType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRequest {

    @NotNull
    private Long candidateId;

    @NotNull
    private Long interviewerId;

    @NotNull
    private InterviewType interviewType;

    @NotNull
    @Future
    private LocalDateTime scheduledAt;
}