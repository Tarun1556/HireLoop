package com.hireloop.backend.interview.service;

import com.hireloop.backend.candidate.entity.Candidate;
import com.hireloop.backend.candidate.repository.CandidateRepository;
import com.hireloop.backend.interview.dto.InterviewRequest;
import com.hireloop.backend.interview.dto.InterviewResponse;
import com.hireloop.backend.interview.entity.Interview;
import com.hireloop.backend.interview.entity.InterviewStatus;
import com.hireloop.backend.interview.repository.InterviewRepository;
import com.hireloop.backend.user.entity.Role;
import com.hireloop.backend.user.entity.User;
import com.hireloop.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public InterviewResponse scheduleInterview(InterviewRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        User interviewer = userRepository.findById(request.getInterviewerId())
                .orElseThrow(() -> new IllegalArgumentException("Interviewer not found"));

        if (interviewer.getRole() != Role.INTERVIEWER) {
            throw new IllegalArgumentException("Assigned user is not an interviewer");
        }

        Interview interview = new Interview();
        interview.setCandidate(candidate);
        interview.setInterviewer(interviewer);
        interview.setScheduledAt(request.getScheduledAt());
        interview.setInterviewType(request.getInterviewType());
        interview.setStatus(InterviewStatus.SCHEDULED);

        Interview saved = interviewRepository.save(interview);

        return toInterviewResponse(saved);
    }

    public InterviewResponse toInterviewResponse(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getCandidate().getId(),
                interview.getCandidate().getUser().getName(),
                interview.getInterviewer().getId(),
                interview.getInterviewer().getName(),
                interview.getScheduledAt(),
                interview.getStatus(),
                interview.getInterviewType(),
                interview.getCreatedAt()
        );
    }
}