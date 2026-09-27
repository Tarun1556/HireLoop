package com.hireloop.backend.interview.dto;

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
public class InterviewQuestionResponse {

    private Long id;              // id of the InterviewQuestion join row
    private Long questionId;
    private String questionTitle;
    private QuestionCategory category;
    private QuestionDifficulty difficulty;
    private LocalDateTime attachedAt;
}