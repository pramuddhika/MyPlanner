package com.todoapp.myplanner_be.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todoapp.myplanner_be.service.StatusService;

@RestController
@RequestMapping("/api/status")
public class StatusController {
    
    @Autowired
    private StatusService statusService;
    
    @GetMapping("/all")
    public ResponseEntity<List<?>> getAllStatuses() {
        List<?> statuses = statusService.getAllStatuses();
        return ResponseEntity.ok(statuses);
    }
    
    
}
