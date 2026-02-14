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
@Schema(description = "Request to change user password")
public class ChangePasswordDTO {
    
    @NotBlank(message = "Current password is required")
    @Schema(
        description = "Current password for verification",
        example = "OldPass123!"
    )
    private String currentPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters")
    @Schema(
        description = "New password (minimum 8 characters)",
        example = "NewSecurePass123!"
    )
    private String newPassword;
}
