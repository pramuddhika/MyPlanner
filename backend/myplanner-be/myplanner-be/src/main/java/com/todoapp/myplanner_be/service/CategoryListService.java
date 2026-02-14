package com.todoapp.myplanner_be.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.categoryList.CategoryResponseDTO;
import com.todoapp.myplanner_be.dto.categoryList.CreateDTO;
import com.todoapp.myplanner_be.entity.CategoryList;
import com.todoapp.myplanner_be.entity.UserEntity;
import com.todoapp.myplanner_be.exception.ResourceNotFoundException;
import com.todoapp.myplanner_be.repository.CategoryListRepository;
import com.todoapp.myplanner_be.repository.UserRepository;

@Service
public class CategoryListService {
    
    @Autowired
    private CategoryListRepository categoryListRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public CategoryList createCategory(CreateDTO createDTO, Integer userId) {
        // Validate category name
        if (createDTO.getCategoryName() == null || createDTO.getCategoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }
        
        // Check if user exists
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check if category name already exists for this user
        if (categoryListRepository.existsByCategoryNameAndUser_UserId(createDTO.getCategoryName().trim(), userId)) {
            throw new IllegalArgumentException("Category name already exists for this user");
        }
        
        // Create new category
        CategoryList category = new CategoryList();
        category.setCategoryName(createDTO.getCategoryName().trim());
        category.setUser(user);
        
        // Save and return
        return categoryListRepository.save(category);
    }
    
    public List<CategoryResponseDTO> getAllCategoriesByUser(Integer userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        // Get all categories for the user
        List<CategoryList> categories = categoryListRepository.findByUser_UserId(userId);
        
        // Convert to DTO to avoid circular reference and only return necessary data
        return categories.stream()
            .map(category -> new CategoryResponseDTO(category.getCategoryId(), category.getCategoryName()))
            .collect(Collectors.toList());
    }
    
}
