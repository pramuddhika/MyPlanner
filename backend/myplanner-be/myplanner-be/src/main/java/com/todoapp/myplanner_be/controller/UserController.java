package com.todoapp.myplanner_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.response.ApiResponse;
import com.todoapp.myplanner_be.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserCreationDTO>> register(@RequestBody UserCreationDTO userDTO) {
        UserCreationDTO createdUser = userService.createUser(userDTO);
        ApiResponse<UserCreationDTO> response = ApiResponse.success(
            createdUser, 
            "User creation success",
            HttpStatus.CREATED.value()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
}