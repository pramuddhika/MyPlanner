package com.todoapp.myplanner_be.service;

import com.todoapp.myplanner_be.dto.NotificationDTO;
import com.todoapp.myplanner_be.entity.TaskEntity;
import com.todoapp.myplanner_be.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(ReminderSchedulerService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Runs every 1 minute to check for due task reminders
     */
    @Scheduled(fixedRate = 30000) // 30000 ms = 30 seconds
    @Transactional
    public void checkAndSendReminders() {
        logger.info("Checking for due task reminders...");

        LocalDateTime now = LocalDateTime.now();

        // Find all tasks where:
        // - isRemainder is true
        // - remainderTime is <= now
        // - reminderSent is false or null
        List<TaskEntity> dueTasks = taskRepository.findAll().stream()
                .filter(task -> Boolean.TRUE.equals(task.getIsRemainder()))
                .filter(task -> task.getRemainderTime() != null)
                .filter(task -> task.getRemainderTime().isBefore(now) || task.getRemainderTime().isEqual(now))
                .filter(task -> !Boolean.TRUE.equals(task.getReminderSent()))
                .toList();

        logger.info("Found {} due reminders", dueTasks.size());

        for (TaskEntity task : dueTasks) {
            try {
                // Create notification DTO
                NotificationDTO notification = new NotificationDTO(
                        "TASK_REMINDER",
                        task.getTaskId(),
                        task.getTopic(),
                        "Reminder: Your task \"" + task.getTopic() + "\" is coming up!",
                        LocalDateTime.now());

                // Send WebSocket notification to user's personal queue
                String destination = "/queue/user/" + task.getUser().getUserId() + "/notifications";
                messagingTemplate.convertAndSend(destination, notification);

                logger.info("Sent reminder notification for task {} to user {}",
                        task.getTaskId(), task.getUser().getUserId());

                // Mark reminder as sent
                task.setReminderSent(true);
                taskRepository.save(task);

            } catch (Exception e) {
                logger.error("Failed to send reminder for task {}: {}",
                        task.getTaskId(), e.getMessage(), e);
            }
        }
    }
}
