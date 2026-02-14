package com.todoapp.myplanner_be.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todoapp.myplanner_be.dto.status.StatusDTO;
import com.todoapp.myplanner_be.response.ApiResponse;
import com.todoapp.myplanner_be.service.StatusService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Status Management", description = "APIs for managing task statuses (e.g., To Do, In Progress, Completed)")
@RestController
@RequestMapping("/api/status")
public class StatusController {
    
    @Autowired
    private StatusService statusService;
    
    @Operation(
        summary = "Get all task statuses"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved all statuses",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<StatusDTO>>> getAllStatuses() {
        List<StatusDTO> statuses = statusService.getAllStatuses();
        ApiResponse<List<StatusDTO>> response = ApiResponse.success(
            statuses, 
            "Statuses retrieved successfully"
        );
        return ResponseEntity.ok(response);
    }
    
    
}
