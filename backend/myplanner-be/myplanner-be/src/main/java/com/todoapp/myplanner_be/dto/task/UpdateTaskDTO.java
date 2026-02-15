package com.todoapp.myplanner_be.dto.task;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update an existing task")
public class UpdateTaskDTO {

    @NotNull(message = "Task ID is required")
    @Schema(
        description = "Task ID to update",
        example = "1"
    )
    private Integer taskId;

    @NotBlank(message = "Topic is required")
    @Size(min = 1, max = 30, message = "Topic must be between 1 and 30 characters")
    @Schema(
        description = "Task topic/title",
        example = "Complete project report"
    )
    private String topic;

    @Size(max = 100, message = "Description must not exceed 100 characters")
    @Schema(
        description = "Task description",
        example = "Finalize and submit the quarterly project report"
    )
    private String description;

    @NotNull(message = "Status ID is required")
    @Schema(
        description = "Status ID of the task",
        example = "1"
    )
    private Byte statusId;

    @Schema(
        description = "Category ID of the task (optional)",
        example = "1"
    )
    private Integer categoryId;

    @Schema(
        description = "Task start time",
        example = "2026-02-15T09:00:00"
    )
    private LocalDateTime startTime;

    @Schema(
        description = "Task end time",
        example = "2026-02-15T17:00:00"
    )
    private LocalDateTime endTime;

    @Schema(
        description = "Whether to set a reminder",
        example = "true"
    )
    private Boolean isRemainder;

    @Schema(
        description = "Reminder time (will be set to null if isRemainder is false)",
        example = "2026-02-15T08:30:00"
    )
    private LocalDateTime remainderTime;
}
