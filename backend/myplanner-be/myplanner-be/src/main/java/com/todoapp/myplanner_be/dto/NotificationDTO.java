package com.todoapp.myplanner_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String type;
    private Integer taskId;
    private String topic;
    private String message;
    private LocalDateTime timestamp;
}
