package com.todoApp.myPlanner.task;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.todoApp.myPlanner.user.UserEntity;
import com.todoApp.myPlanner.status.StatusEntity;
import com.todoApp.myPlanner.list.ListEntity;

@Entity
@Table(name = "task")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user", "status", "category"})
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer taskId;

    @Column(nullable = false, length = 30)
    private String topic;

    @Column(length = 100)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "statusId", nullable = false)
    private StatusEntity status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", nullable = false)
    private ListEntity category;

    @Column(nullable = false)
    private LocalDateTime createTime;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean isRemainder;

    private LocalDateTime remainderTime;

    @Column(nullable = false)
    private LocalDateTime lastUpdateTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;
}
