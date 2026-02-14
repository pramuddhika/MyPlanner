package com.todoapp.myplanner_be.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standard API response wrapper")
public class ApiResponse<T> {
    
    @Schema(
        description = "Response status",
        example = "success",
        allowableValues = {"success", "error"}
    )
    private String status;
    
    @Schema(
        description = "HTTP status code",
        example = "200"
    )
    private int code;
    
    @Schema(
        description = "Response message",
        example = "Operation completed successfully"
    )
    private String message;
    
    @Schema(
        description = "Response data payload"
    )
    private T data;
    
    // Success response with data
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>("success", 200, message, data);
    }
    
    // Success response with data and custom code
    public static <T> ApiResponse<T> success(T data, String message, int code) {
        return new ApiResponse<>("success", code, message, data);
    }
    
    // Success response without data
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("success", 200, message, null);
    }
    
    // Error response
    public static <T> ApiResponse<T> error(String message, int code) {
        return new ApiResponse<>("error", code, message, null);
    }
    
    // Error response with data
    public static <T> ApiResponse<T> error(String message, int code, T data) {
        return new ApiResponse<>("error", code, message, data);
    }
}
