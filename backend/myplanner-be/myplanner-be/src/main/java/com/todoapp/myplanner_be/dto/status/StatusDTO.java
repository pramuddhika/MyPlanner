package com.todoapp.myplanner_be.dto.status;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Task status information")
public class StatusDTO {

    @Schema(
        description = "Unique identifier for the status",
        example = "1"
    )
    private Byte statusId;
    
    @Schema(
        description = "Name of the status",
        example = "In Progress"
    )
    private String statusName;

}
