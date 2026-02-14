package com.todoapp.myplanner_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.todoapp.myplanner_be.dto.user.LogInDTO;
import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.response.ApiResponse;
import com.todoapp.myplanner_be.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> register(@RequestBody UserCreationDTO userDTO) {
        userService.createUser(userDTO);
        ApiResponse<Object> response = ApiResponse.success(
            "User creation success"
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@RequestBody LogInDTO loginDTO) {
        userService.loginUser(loginDTO);
        ApiResponse<Object> response = ApiResponse.success(
            "Login success"
        );
        return ResponseEntity.ok(response);
    }
    
    
}