package com.todoapp.myplanner_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todoapp.myplanner_be.dto.task.CreateTaskDTO;
import com.todoapp.myplanner_be.response.ApiResponse;
import com.todoapp.myplanner_be.service.TaskService;
import com.todoapp.myplanner_be.util.AuthUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@Tag(name = "Task Management", description = "APIs for managing user tasks")
@RestController
@RequestMapping("/api/task")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @Operation(
        summary = "Create a new task",
        description = "Creates a new task for the authenticated user. UserId and timestamps are set automatically. Requires valid JWT token."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Object>> createTask(
            @Valid @RequestBody CreateTaskDTO createTaskDTO,
            HttpServletRequest request) {
        
        Integer userId = AuthUtil.getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        
        taskService.createTask(createTaskDTO, userId);
        ApiResponse<Object> response = ApiResponse.success("Task created successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
