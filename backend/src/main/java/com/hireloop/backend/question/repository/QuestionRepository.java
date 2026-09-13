package com.hireloop.backend.question.repository;

import com.hireloop.backend.question.entity.Question;
import com.hireloop.backend.question.entity.QuestionCategory;
import com.hireloop.backend.question.entity.QuestionDifficulty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategory(QuestionCategory category);
    List<Question> findByDifficulty(QuestionDifficulty difficulty);
    List<Question> findByCategoryAndDifficulty(QuestionCategory category, QuestionDifficulty difficulty);
}