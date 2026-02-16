import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { websocketService } from '@/services/websocketService';
import type { TaskNotification } from '@/services/websocketService';
import toast from 'react-hot-toast';
import { TaskReminderToast } from '@/components/notifications/TaskReminderToast';

export const useNotifications = () => {
    const { userId, token } = useSelector((state: RootState) => state.auth);
    const hasRequestedPermission = useRef(false);

    useEffect(() => {
        // Request browser notification permission on mount
        if (!hasRequestedPermission.current && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then((permission) => {
                    console.log('Notification permission:', permission);
                });
            }
            hasRequestedPermission.current = true;
        }
    }, []);

     useEffect(() => {
        // Connect to WebSocket when user is authenticated
        if (userId && token) {
            websocketService.connect(userId, token);

            // Subscribe to notifications
            const unsubscribe = websocketService.onNotification((notification: TaskNotification) => {
                console.log(`🔔 [Notification] Task topic: "${notification.topic}" (taskId: ${notification.taskId}, time: ${notification.timestamp})`);

                // Show browser notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Task Reminder', {
                        body: notification.message,
                        tag: `task-${notification.taskId}`,
                        requireInteraction: false,
                    });
                }

                // Show custom toast notification
                toast.custom(
                    (t) => TaskReminderToast({
                        t,
                        topic: notification.topic,
                        message: notification.message,
                        timestamp: notification.timestamp,
                    }),
                    {
                        duration: 15000,
                        id: `task-reminder-${notification.taskId}`,
                    }
                );
            });

            // Cleanup on unmount
            return () => {
                unsubscribe();
                websocketService.disconnect();
            };
        }
    }, [userId, token]);

    return {
        isConnected: websocketService.getConnectionStatus(),
    };
};
