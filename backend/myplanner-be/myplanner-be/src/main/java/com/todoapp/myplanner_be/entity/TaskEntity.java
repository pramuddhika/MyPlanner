package com.todoapp.myplanner_be.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "task")
@Getter
@Setter
public class TaskEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "taskId")
    private Integer taskId;

    @Column(name = "topic", nullable = false, length = 30)
    private String topic;

    @Column(name = "description", length = 100)
    private String description;

    @ManyToOne
    @JoinColumn(name = "statusId", nullable = false)
    private StatusEntity status;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    private CategoryList category;

    @Column(name = "createTime", nullable = false)
    private LocalDateTime createTime;

    @Column(name = "startTime")
    private LocalDateTime startTime;

    @Column(name = "endTime")
    private LocalDateTime endTime;

    @Column(name = "isRemainder")
    private Boolean isRemainder;

    @Column(name = "remainderTime")
    private LocalDateTime remainderTime;

    @Column(name = "lastUpdateTime", nullable = false)
    private LocalDateTime lastUpdateTime;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;
    
}
