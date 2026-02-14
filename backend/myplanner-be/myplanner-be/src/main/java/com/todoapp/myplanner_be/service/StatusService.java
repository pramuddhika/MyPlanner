package com.todoapp.myplanner_be.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.myplanner_be.dto.status.StatusDTO;
import com.todoapp.myplanner_be.entity.StatusEntity;
import com.todoapp.myplanner_be.repository.StatusRepository;

@Service
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;

    public List<StatusDTO> getAllStatuses() {
        List<StatusEntity> statusEntities = statusRepository.findAll();
        return statusEntities.stream()
                .map(status -> new StatusDTO(status.getStatusId(), status.getStatusName()))
                .collect(Collectors.toList());
    }
}
