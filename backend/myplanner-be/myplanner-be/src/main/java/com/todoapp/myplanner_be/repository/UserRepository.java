package com.todoapp.myplanner_be.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todoapp.myplanner_be.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    
    boolean existsByEmail(String email);
    
    Optional<UserEntity> findByEmail(String email);
    
}