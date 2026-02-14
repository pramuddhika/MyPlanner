package com.todoapp.myplanner_be.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todoapp.myplanner_be.dto.categoryList.CategoryResponseDTO;
import com.todoapp.myplanner_be.dto.categoryList.CreateDTO;
import com.todoapp.myplanner_be.response.ApiResponse;
import com.todoapp.myplanner_be.service.CategoryListService;
import com.todoapp.myplanner_be.util.AuthUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@Tag(name = "Category Management", description = "APIs for managing user categories")
@RestController
@RequestMapping("/api/category")
public class CategoryListController {
    
    @Autowired
    private CategoryListService categoryListService;
    
    @Operation(
        summary = "Create a new category",
        description = "Creates a new category for the authenticated user. Category name must be unique per user. Requires valid JWT token."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Object>> createCategory(
            @Valid @RequestBody CreateDTO createDTO,
            HttpServletRequest request) {
        
        Integer userId = AuthUtil.getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        
        categoryListService.createCategory(createDTO, userId);
        ApiResponse<Object> response = ApiResponse.success("Category created successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @Operation(
        summary = "Get all categories",
        description = "Retrieves all categories for the authenticated user. Requires valid JWT token."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategories(HttpServletRequest request) {
        Integer userId = AuthUtil.getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        
        List<CategoryResponseDTO> categories = categoryListService.getAllCategoriesByUser(userId);
        ApiResponse<List<CategoryResponseDTO>> response = ApiResponse.success(
            categories, 
            "Categories retrieved successfully"
        );
        return ResponseEntity.ok(response);
    }
    
}
