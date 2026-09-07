package com.hireloop.backend.interview.dto;

import com.hireloop.backend.interview.entity.InterviewStatus;
import com.hireloop.backend.interview.entity.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private Long id;
    private Long candidateId;
    private String candidateName;
    private Long interviewerId;
    private String interviewerName;
    private LocalDateTime scheduledAt;
    private InterviewStatus status;
    private InterviewType interviewType;
    private LocalDateTime createdAt;
}