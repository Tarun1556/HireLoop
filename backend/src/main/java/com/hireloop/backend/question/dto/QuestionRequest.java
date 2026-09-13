package com.hireloop.backend.question.dto;

import com.hireloop.backend.question.entity.QuestionCategory;
import com.hireloop.backend.question.entity.QuestionDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {

    @NotBlank
    private String title;

    @NotNull
    private QuestionCategory category;

    @NotNull
    private QuestionDifficulty difficulty;

    private String description;
}