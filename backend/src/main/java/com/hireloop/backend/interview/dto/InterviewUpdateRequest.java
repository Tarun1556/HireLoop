package com.hireloop.backend.interview.dto;

import com.hireloop.backend.interview.entity.InterviewStatus;
import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewUpdateRequest {

    @Future
    private LocalDateTime scheduledAt;

    private InterviewStatus status;
}