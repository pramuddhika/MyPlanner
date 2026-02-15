package com.todoapp.myplanner_be.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile information")
public class UserProfileDTO {
    
    @Schema(
        description = "User's name",
        example = "John Doe"
    )
    private String name;
    
    @Schema(
        description = "User's email address",
        example = "john.doe@example.com"
    )
    private String email;
}
