package com.todoapp.myplanner_be.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response with JWT token")
public class AuthResponseDTO {
    
    @Schema(
        description = "JWT access token",
        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    )
    private String token;
    
    @Schema(
        description = "Token type",
        example = "Bearer"
    )
    private String type = "Bearer";
    
    @Schema(
        description = "User ID",
        example = "1"
    )
    private Integer userId;
    
    @Schema(
        description = "User email",
        example = "john.doe@example.com"
    )
    private String email;
    
    @Schema(
        description = "User name",
        example = "John Doe"
    )
    private String name;

    public AuthResponseDTO(String token, Integer userId, String email, String name) {
        this.token = token;
        this.type = "Bearer";
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
}
