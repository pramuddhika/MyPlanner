package com.todoapp.myplanner_be.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.user.UserCreationDTO;
import com.todoapp.myplanner_be.entity.UserEntity;
import com.todoapp.myplanner_be.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public boolean createUser(UserCreationDTO userDTO) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                return false;
            }
            
            // Create new user entity
            UserEntity user = new UserEntity();
            user.setName(userDTO.getName());
            user.setEmail(userDTO.getEmail());
            user.setPassword(userDTO.getPassword()); // Note: In production, hash the password!
            
            // Save user
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
