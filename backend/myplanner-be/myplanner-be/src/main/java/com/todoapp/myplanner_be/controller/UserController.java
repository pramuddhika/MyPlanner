package com.todoapp.myplanner_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.todoapp.myplanner_be.dto.user.AuthResponseDTO;
import com.todoapp.myplanner_be.dto.user.LogInDTO;
import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.response.ApiResponse;
import com.todoapp.myplanner_be.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "User Management", description = "APIs for user registration, authentication, and profile management")
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account with encrypted password. Username and email must be unique."
    )
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> register(@Valid @RequestBody UserCreationDTO userDTO) {
        userService.createUser(userDTO);
        ApiResponse<Object> response = ApiResponse.success(
            "User creation success"
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
        summary = "User login",
        description = "Authenticates a user with email and password. Returns JWT token on success."
    )
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LogInDTO loginDTO) {
        AuthResponseDTO authResponse = userService.loginUser(loginDTO);
        ApiResponse<AuthResponseDTO> response = ApiResponse.success(
            authResponse,
            "Login successful"
        );
        return ResponseEntity.ok(response);
    }
    
    
}