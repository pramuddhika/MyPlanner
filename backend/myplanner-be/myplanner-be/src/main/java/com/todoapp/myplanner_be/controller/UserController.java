package com.todoapp.myplanner_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public String register(@RequestBody UserCreationDTO userDTO) {
        boolean isCreated = userService.createUser(userDTO);
        
        if (isCreated) {
            return "User creation success";
        } else {
            return "User creation failed";
        }
    }
    
}