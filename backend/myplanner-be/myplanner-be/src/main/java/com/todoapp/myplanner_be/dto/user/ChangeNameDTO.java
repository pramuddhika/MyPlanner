package com.todoapp.myplanner_be.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to change user name")
public class ChangeNameDTO {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 45, message = "Name must be between 2 and 45 characters")
    @Schema(
        description = "New name for the user",
        example = "John Smith"
    )
    private String name;
}
