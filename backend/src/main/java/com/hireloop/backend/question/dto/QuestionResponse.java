package com.hireloop.backend.question.dto;

import com.hireloop.backend.question.entity.QuestionCategory;
import com.hireloop.backend.question.entity.QuestionDifficulty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String title;
    private QuestionCategory category;
    private QuestionDifficulty difficulty;
    private String description;
    private LocalDateTime createdAt;
}