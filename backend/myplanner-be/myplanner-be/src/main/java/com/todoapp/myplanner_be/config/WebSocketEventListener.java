package com.todoapp.myplanner_be.config;

import com.todoapp.myplanner_be.dto.NotificationDTO;
import com.todoapp.myplanner_be.entity.TaskEntity;
import com.todoapp.myplanner_be.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Listens for STOMP subscribe events. When a client subscribes to their
 * notification queue, sends any pending (due but unsent) reminders immediately.
 */
@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private static final Pattern NOTIFICATION_DEST_PATTERN =
            Pattern.compile("^/queue/user/(\\d+)/notifications$");

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    @Transactional
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();

        if (destination == null) return;

        Matcher matcher = NOTIFICATION_DEST_PATTERN.matcher(destination);
        if (!matcher.matches()) return;

        Integer userId = Integer.parseInt(matcher.group(1));
        logger.info("User {} subscribed to notifications queue. Checking for pending reminders...", userId);

        LocalDateTime now = LocalDateTime.now();

        // Find all due but unsent reminders for this user
        List<TaskEntity> pendingTasks = taskRepository.findByUser_UserId(userId).stream()
                .filter(task -> Boolean.TRUE.equals(task.getIsRemainder()))
                .filter(task -> task.getRemainderTime() != null)
                .filter(task -> task.getRemainderTime().isBefore(now) || task.getRemainderTime().isEqual(now))
                .filter(task -> !Boolean.TRUE.equals(task.getReminderSent()))
                .toList();

        logger.info("Found {} pending reminders for user {}", pendingTasks.size(), userId);

        for (TaskEntity task : pendingTasks) {
            try {
                NotificationDTO notification = new NotificationDTO(
                        "TASK_REMINDER",
                        task.getTaskId(),
                        task.getTopic(),
                        "Reminder: Your task \"" + task.getTopic() + "\" is coming up!",
                        LocalDateTime.now());

                messagingTemplate.convertAndSend(destination, notification);

                logger.info("Sent pending reminder for task '{}' (id={}) to user {}",
                        task.getTopic(), task.getTaskId(), userId);

                task.setReminderSent(true);
                taskRepository.save(task);
            } catch (Exception e) {
                logger.error("Failed to send pending reminder for task {}: {}",
                        task.getTaskId(), e.getMessage(), e);
            }
        }
    }
}
