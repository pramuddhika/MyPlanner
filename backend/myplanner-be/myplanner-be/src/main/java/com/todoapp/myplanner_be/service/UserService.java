package com.todoapp.myplanner_be.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.user.AuthResponseDTO;
import com.todoapp.myplanner_be.dto.user.LogInDTO;
import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.entity.UserEntity;
import com.todoapp.myplanner_be.repository.UserRepository;
import com.todoapp.myplanner_be.security.JwtUtil;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
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
        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        
        // Save user
        userRepository.save(user);
    }
    
    public AuthResponseDTO loginUser(LogInDTO loginDTO) {
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
        
        // Verify encrypted password
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());
        
        // Return authentication response with token and user details
        return new AuthResponseDTO(token, user.getUserId(), user.getEmail(), user.getName());
    }
}
