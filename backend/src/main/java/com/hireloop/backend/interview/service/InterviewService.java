package com.hireloop.backend.interview.service;

import com.hireloop.backend.candidate.entity.Candidate;
import com.hireloop.backend.candidate.repository.CandidateRepository;
import com.hireloop.backend.interview.dto.AttachQuestionRequest;
import com.hireloop.backend.interview.dto.InterviewQuestionResponse;
import com.hireloop.backend.interview.dto.InterviewRequest;
import com.hireloop.backend.interview.dto.InterviewResponse;
import com.hireloop.backend.interview.entity.Interview;
import com.hireloop.backend.interview.entity.InterviewQuestion;
import com.hireloop.backend.interview.entity.InterviewStatus;
import com.hireloop.backend.interview.repository.InterviewQuestionRepository;
import com.hireloop.backend.interview.repository.InterviewRepository;
import com.hireloop.backend.question.entity.Question;
import com.hireloop.backend.question.repository.QuestionRepository;
import com.hireloop.backend.user.entity.Role;
import com.hireloop.backend.user.entity.User;
import com.hireloop.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.hireloop.backend.interview.dto.InterviewUpdateRequest;

import java.util.List;
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

   public InterviewResponse getInterviewById(Long id, Authentication authentication) {
        Interview interview = interviewRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Interview not found"));

        checkOwnership(interview, authentication);

        return toInterviewResponse(interview);
}
    public List<InterviewResponse> getInterviewsByCandidateId(Long candidateId) {
        if (!candidateRepository.existsById(candidateId)) {
                throw new IllegalArgumentException("Candidate not found");
        }

        return interviewRepository.findByCandidateId(candidateId).stream()
            .map(this::toInterviewResponse)
            .toList(); 
        }

    public List<InterviewResponse> getMyInterviewsAsInterviewer(Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return interviewRepository.findByInterviewerId(currentUser.getId()).stream()
                .map(this::toInterviewResponse)
                .toList();
        }
    public List<InterviewResponse> getMyInterviewsAsCandidate(Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Candidate candidate = candidateRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found"));

        return interviewRepository.findByCandidateId(candidate.getId()).stream()
                .map(this::toInterviewResponse)
                .toList();
        }
    public InterviewResponse updateInterview(Long id, InterviewUpdateRequest request, Authentication authentication) {
        Interview interview = interviewRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Interview not found"));

        User currentUser = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (currentUser.getRole() == Role.INTERVIEWER
            && !interview.getInterviewer().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Not authorized to update this interview");
        }

        if (request.getScheduledAt() != null) {
                interview.setScheduledAt(request.getScheduledAt());
        }

        if (request.getStatus() != null) {
                interview.setStatus(request.getStatus());
        }

        Interview updated = interviewRepository.save(interview);

        return toInterviewResponse(updated);
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
    private final QuestionRepository questionRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public void checkOwnership(Interview interview, Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (currentUser.getRole() == Role.INTERVIEWER
            && !interview.getInterviewer().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Not authorized to access this interview");
        }
        }

    public InterviewQuestionResponse attachQuestion(Long interviewId, AttachQuestionRequest request, Authentication authentication) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + interviewId));
        checkOwnership(interview, authentication); // reuse existing ownership-check helper
        Question question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + request.getQuestionId()));

        if (interviewQuestionRepository.existsByInterviewIdAndQuestionId(interviewId, request.getQuestionId())) {
                throw new IllegalArgumentException("Question is already attached to this interview");
        }

        InterviewQuestion iq = new InterviewQuestion();
        iq.setInterview(interview);
        iq.setQuestion(question);

        InterviewQuestion saved = interviewQuestionRepository.save(iq);
        return toInterviewQuestionResponse(saved);
}

   public List<InterviewQuestionResponse> getQuestionsForInterview(Long interviewId, Authentication authentication) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + interviewId));
        checkOwnership(interview, authentication);

        return interviewQuestionRepository.findByInterviewId(interviewId).stream()
            .map(this::toInterviewQuestionResponse)
            .toList();
        }

   public void detachQuestion(Long interviewId, Long questionId, Authentication authentication) {
        Interview interview = interviewRepository.findById(interviewId)
            .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + interviewId));

        checkOwnership(interview, authentication);

        InterviewQuestion iq = interviewQuestionRepository.findByInterviewIdAndQuestionId(interviewId, questionId)
            .orElseThrow(() -> new IllegalArgumentException("Question is not attached to this interview"));

        interviewQuestionRepository.delete(iq);
}

   private InterviewQuestionResponse toInterviewQuestionResponse(InterviewQuestion iq) {
        return new InterviewQuestionResponse(
            iq.getId(),
            iq.getQuestion().getId(),
            iq.getQuestion().getTitle(),
            iq.getQuestion().getCategory(),
            iq.getQuestion().getDifficulty(),
            iq.getCreatedAt()
        );
}
}