package com.todoapp.myplanner_be.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todoapp.myplanner_be.entity.CategoryList;

@Repository
public interface CategoryListRepository extends JpaRepository<CategoryList, Integer> {
    
    List<CategoryList> findByUser_UserId(Integer userId);
    
    boolean existsByCategoryNameAndUser_UserId(String categoryName, Integer userId);
    
}
