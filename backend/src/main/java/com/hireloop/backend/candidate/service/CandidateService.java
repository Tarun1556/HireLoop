package com.hireloop.backend.candidate.service;

import com.hireloop.backend.candidate.dto.CandidateRequest;
import com.hireloop.backend.candidate.dto.CandidateResponse;
import com.hireloop.backend.candidate.entity.Candidate;
import com.hireloop.backend.candidate.repository.CandidateRepository;
import com.hireloop.backend.user.entity.User;
import com.hireloop.backend.user.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateRepository candidateRepository, UserRepository userRepository) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
    }

    public CandidateResponse createProfile(String email, CandidateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (candidateRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException("Candidate profile already exists for this user");
        }

        Candidate candidate = new Candidate();
        candidate.setUser(user);
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setExperience(request.getExperience());

        Candidate saved = candidateRepository.save(candidate);
        return toResponse(saved);
    }

    public CandidateResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        Candidate candidate = candidateRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found"));

        return toResponse(candidate);
    }

    private CandidateResponse toResponse(Candidate candidate) {
        CandidateResponse response = new CandidateResponse();
        response.setId(candidate.getId());
        response.setUserId(candidate.getUser().getId());
        response.setName(candidate.getUser().getName());
        response.setEmail(candidate.getUser().getEmail());
        response.setResumeUrl(candidate.getResumeUrl());
        response.setExperience(candidate.getExperience());
        response.setCreatedAt(candidate.getCreatedAt());
        return response;
    }
    public CandidateResponse getById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Candidate not found with id: " + id));
        return toResponse(candidate);
    }
    public List<CandidateResponse> getAll() {
        return candidateRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public CandidateResponse updateMyProfile(String email, CandidateRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        Candidate candidate = candidateRepository.findByUserId(user.getId())
            .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found"));
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setExperience(request.getExperience());
        Candidate saved = candidateRepository.save(candidate);
        return toResponse(saved);
    }
}