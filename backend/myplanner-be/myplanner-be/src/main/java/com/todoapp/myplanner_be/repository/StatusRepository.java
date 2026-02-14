package com.todoapp.myplanner_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todoapp.myplanner_be.entity.StatusEntity;

@Repository
public interface StatusRepository extends JpaRepository<StatusEntity, Byte> {
    
}
