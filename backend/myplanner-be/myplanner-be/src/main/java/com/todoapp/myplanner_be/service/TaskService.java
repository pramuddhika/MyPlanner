package com.todoapp.myplanner_be.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.task.CreateTaskDTO;
import com.todoapp.myplanner_be.entity.CategoryList;
import com.todoapp.myplanner_be.entity.StatusEntity;
import com.todoapp.myplanner_be.entity.TaskEntity;
import com.todoapp.myplanner_be.entity.UserEntity;
import com.todoapp.myplanner_be.exception.ResourceNotFoundException;
import com.todoapp.myplanner_be.repository.CategoryListRepository;
import com.todoapp.myplanner_be.repository.StatusRepository;
import com.todoapp.myplanner_be.repository.TaskRepository;
import com.todoapp.myplanner_be.repository.UserRepository;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StatusRepository statusRepository;
    
    @Autowired
    private CategoryListRepository categoryListRepository;
    
    public TaskEntity createTask(CreateTaskDTO createTaskDTO, Integer userId) {
        // Validate topic
        if (createTaskDTO.getTopic() == null || createTaskDTO.getTopic().trim().isEmpty()) {
            throw new IllegalArgumentException("Task topic is required");
        }
        
        // Check if user exists
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check if status exists
        StatusEntity status = statusRepository.findById(createTaskDTO.getStatusId())
            .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        
        // Check if category exists (if provided)
        CategoryList category = null;
        if (createTaskDTO.getCategoryId() != null) {
            category = categoryListRepository.findById(createTaskDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            
            // Verify category belongs to the user
            if (!category.getUser().getUserId().equals(userId)) {
                throw new IllegalArgumentException("Category does not belong to the user");
            }
        }
        
        // Validate reminder logic
        if (Boolean.TRUE.equals(createTaskDTO.getIsRemainder()) && createTaskDTO.getRemainderTime() == null) {
            throw new IllegalArgumentException("Reminder time is required when reminder is enabled");
        }
        
        // Create new task
        TaskEntity task = new TaskEntity();
        task.setTopic(createTaskDTO.getTopic().trim());
        task.setDescription(createTaskDTO.getDescription() != null ? createTaskDTO.getDescription().trim() : null);
        task.setStatus(status);
        task.setCategory(category);
        task.setStartTime(createTaskDTO.getStartTime());
        task.setEndTime(createTaskDTO.getEndTime());
        task.setIsRemainder(createTaskDTO.getIsRemainder());
        task.setRemainderTime(createTaskDTO.getRemainderTime());
        task.setUser(user);
        
        // Set timestamps automatically
        LocalDateTime now = LocalDateTime.now();
        task.setCreateTime(now);
        task.setLastUpdateTime(now);
        
        // Save and return
        return taskRepository.save(task);
    }
}
