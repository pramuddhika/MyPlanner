package com.todoapp.myplanner_be.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.task.CreateTaskDTO;
import com.todoapp.myplanner_be.dto.task.TaskResponseDTO;
import com.todoapp.myplanner_be.dto.task.UpdateTaskDTO;
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
    
    public TaskEntity updateTask(UpdateTaskDTO updateTaskDTO, Integer userId) {
        // Validate task ID
        if (updateTaskDTO.getTaskId() == null) {
            throw new IllegalArgumentException("Task ID is required");
        }
        
        // Find existing task
        TaskEntity task = taskRepository.findById(updateTaskDTO.getTaskId())
            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        // Verify task belongs to the user (from token)
        if (!task.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Task does not belong to the user");
        }
        
        // Validate topic
        if (updateTaskDTO.getTopic() == null || updateTaskDTO.getTopic().trim().isEmpty()) {
            throw new IllegalArgumentException("Task topic is required");
        }
        
        // Check if status exists
        StatusEntity status = statusRepository.findById(updateTaskDTO.getStatusId())
            .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        
        // Check if category exists (if provided)
        CategoryList category = null;
        if (updateTaskDTO.getCategoryId() != null) {
            category = categoryListRepository.findById(updateTaskDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            
            // Verify category belongs to the user
            if (!category.getUser().getUserId().equals(userId)) {
                throw new IllegalArgumentException("Category does not belong to the user");
            }
        }
        
        // Validate reminder logic - if isRemainder is false/null, set remainderTime to null
        LocalDateTime remainderTime = null;
        if (Boolean.TRUE.equals(updateTaskDTO.getIsRemainder())) {
            if (updateTaskDTO.getRemainderTime() == null) {
                throw new IllegalArgumentException("Reminder time is required when reminder is enabled");
            }
            remainderTime = updateTaskDTO.getRemainderTime();
        }
        
        // Update task fields
        task.setTopic(updateTaskDTO.getTopic().trim());
        task.setDescription(updateTaskDTO.getDescription() != null ? updateTaskDTO.getDescription().trim() : null);
        task.setStatus(status);
        task.setCategory(category);
        task.setStartTime(updateTaskDTO.getStartTime());
        task.setEndTime(updateTaskDTO.getEndTime());
        task.setIsRemainder(updateTaskDTO.getIsRemainder());
        task.setRemainderTime(remainderTime);
        
        // createTime is NOT updated (remains the same)
        // Only update lastUpdateTime
        task.setLastUpdateTime(LocalDateTime.now());
        
        // Save and return
        return taskRepository.save(task);
    }
    
    public void deleteTask(Integer taskId, Integer userId) {
        // Find the task
        TaskEntity task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        // Verify that the task belongs to the user
        if (!task.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Task does not belong to the user");
        }
        
        // Delete the task
        taskRepository.delete(task);
    }
    
    public List<TaskResponseDTO> getTasksByDateRange(Integer userId, LocalDateTime startDate, LocalDateTime endDate) {
        // Fetch tasks from repository
        List<TaskEntity> tasks = taskRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        
        // Convert to DTOs
        return tasks.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private TaskResponseDTO convertToDTO(TaskEntity task) {
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setTaskId(task.getTaskId());
        dto.setTopic(task.getTopic());
        dto.setDescription(task.getDescription());
        
        // Set status info
        if (task.getStatus() != null) {
            TaskResponseDTO.StatusInfo statusInfo = new TaskResponseDTO.StatusInfo();
            statusInfo.setStatusId(task.getStatus().getStatusId());
            statusInfo.setStatusName(task.getStatus().getStatusName());
            dto.setStatus(statusInfo);
        }
        
        // Set category info
        if (task.getCategory() != null) {
            TaskResponseDTO.CategoryInfo categoryInfo = new TaskResponseDTO.CategoryInfo();
            categoryInfo.setCategoryId(task.getCategory().getCategoryId());
            categoryInfo.setCategoryName(task.getCategory().getCategoryName());
            dto.setCategory(categoryInfo);
        }
        
        dto.setCreateTime(task.getCreateTime());
        dto.setStartTime(task.getStartTime());
        dto.setEndTime(task.getEndTime());
        dto.setIsRemainder(task.getIsRemainder());
        dto.setRemainderTime(task.getRemainderTime());
        dto.setLastUpdateTime(task.getLastUpdateTime());
        
        return dto;
    }
}
