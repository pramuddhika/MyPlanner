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

@RestController
@RequestMapping("/api/status")
public class StatusController {
    
    @Autowired
    private StatusService statusService;
    
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
