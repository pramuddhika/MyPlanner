package com.todoapp.myplanner_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.todoapp.myplanner_be.entity.TaskEntity;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {
    
    List<TaskEntity> findByUser_UserId(Integer userId);
    
    List<TaskEntity> findByUser_UserIdAndStatus_StatusId(Integer userId, Byte statusId);
    
    List<TaskEntity> findByUser_UserIdAndCategory_CategoryId(Integer userId, Integer categoryId);
    
    boolean existsByCategory_CategoryId(Integer categoryId);
    
    @Query("SELECT t FROM TaskEntity t WHERE t.user.userId = :userId " +
           "AND (:categoryId IS NULL OR t.category.categoryId = :categoryId) " +
           "AND (:startDate IS NULL OR t.startTime >= :startDate) " +
           "AND (:endDate IS NULL OR t.endTime <= :endDate)")
    List<TaskEntity> findByUserIdAndDateRangeAndCategory(
        @Param("userId") Integer userId,
        @Param("categoryId") Integer categoryId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
