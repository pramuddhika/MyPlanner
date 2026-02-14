package com.todoapp.myplanner_be.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.user.LogInDTO;
import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.entity.UserEntity;
import com.todoapp.myplanner_be.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public void createUser(UserCreationDTO userDTO) {
        // Check if email already exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Validate input
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userDTO.getName() == null || userDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        // Create new user entity
        UserEntity user = new UserEntity();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword()); // Note: In production, hash the password!
        
        // Save user
        userRepository.save(user);
    }
    
    public void loginUser(LogInDTO loginDTO) {
        // Validate input
        if (loginDTO.getEmail() == null || loginDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (loginDTO.getPassword() == null || loginDTO.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        // Find user by email
        UserEntity user = userRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        // Check password (Note: In production, compare hashed passwords!)
        if (!user.getPassword().equals(loginDTO.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
    }
}
