package com.hireloop.backend.question.service;

import com.hireloop.backend.question.dto.QuestionRequest;
import com.hireloop.backend.question.dto.QuestionResponse;
import com.hireloop.backend.question.entity.Question;
import com.hireloop.backend.question.entity.QuestionCategory;
import com.hireloop.backend.question.entity.QuestionDifficulty;
import com.hireloop.backend.question.repository.QuestionRepository;
import com.hireloop.backend.interview.repository.InterviewQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public QuestionResponse createQuestion(QuestionRequest request) {
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setCategory(request.getCategory());
        question.setDifficulty(request.getDifficulty());
        question.setDescription(request.getDescription());

        Question saved = questionRepository.save(question);
        return toQuestionResponse(saved);
    }

    public QuestionResponse getById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + id));
        return toQuestionResponse(question);
    }

    public List<QuestionResponse> getAll(QuestionCategory category, QuestionDifficulty difficulty) {
        List<Question> questions;

        if (category != null && difficulty != null) {
            questions = questionRepository.findByCategoryAndDifficulty(category, difficulty);
        } else if (category != null) {
            questions = questionRepository.findByCategory(category);
        } else if (difficulty != null) {
            questions = questionRepository.findByDifficulty(difficulty);
        } else {
            questions = questionRepository.findAll();
        }

        return questions.stream()
                .map(this::toQuestionResponse)
                .toList();
    }

    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + id));

        question.setTitle(request.getTitle());
        question.setCategory(request.getCategory());
        question.setDifficulty(request.getDifficulty());
        question.setDescription(request.getDescription());

        Question updated = questionRepository.save(question);
        return toQuestionResponse(updated);
    }

    public void deleteQuestion(Long id) {
        if (interviewQuestionRepository.existsByQuestionId(id)) {
            throw new IllegalArgumentException(
            "This question is attached to an interview and can't be deleted");
        }
        if (!questionRepository.existsById(id)) {
            throw new IllegalArgumentException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }

    public QuestionResponse toQuestionResponse(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getTitle(),
                question.getCategory(),
                question.getDifficulty(),
                question.getDescription(),
                question.getCreatedAt()
        );
    }
}