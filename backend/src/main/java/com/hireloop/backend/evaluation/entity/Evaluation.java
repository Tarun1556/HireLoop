package com.hireloop.backend.evaluation.entity;

import com.hireloop.backend.interview.entity.Interview;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    @Column(name = "technical_score", nullable = false)
    private Double technicalScore;

    @Column(name = "communication_score", nullable = false)
    private Double communicationScore;

    @Column(name = "problem_solving_score", nullable = false)
    private Double problemSolvingScore;

    @Column(name = "overall_score", nullable = false)
    private Double overallScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}