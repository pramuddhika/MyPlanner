package com.todoapp.myplanner_be.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User login request payload")
public class LogInDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Schema(
        description = "User's email address",
        example = "john.doe@example.com"
    )
    private String email;
    
    @NotBlank(message = "Password is required")
    @Schema(
        description = "User's password",
        example = "SecurePass123!"
    )
    private String password;

}
