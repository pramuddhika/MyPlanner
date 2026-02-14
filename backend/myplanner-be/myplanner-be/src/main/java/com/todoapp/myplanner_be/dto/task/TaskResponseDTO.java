package com.todoapp.myplanner_be.dto.task;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {
    private Integer taskId;
    private String topic;
    private String description;
    private StatusInfo status;
    private CategoryInfo category;
    private LocalDateTime createTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isRemainder;
    private LocalDateTime remainderTime;
    private LocalDateTime lastUpdateTime;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusInfo {
        private Byte statusId;
        private String statusName;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        private Integer categoryId;
        private String categoryName;
    }
}
