import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { websocketService } from '@/services/websocketService';
import type { TaskNotification } from '@/services/websocketService';
import toast from 'react-hot-toast';

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

    const handleNotification = (notification: TaskNotification) => {
        console.log('Handling notification:', notification);

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Reminder', {
                body: notification.message,
                tag: `task-${notification.taskId}`,
                requireInteraction: false,
            });
        }

        // Show toast notification
        toast('🔔 ' + notification.message, {
            duration: 10000, // 10 seconds
            style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
            },
        });
    };

     useEffect(() => {
        // Connect to WebSocket when user is authenticated
        if (userId && token) {
            console.log('Connecting to WebSocket for user:', userId);
            websocketService.connect(userId, token);

            // Subscribe to notifications
            const unsubscribe = websocketService.onNotification((notification: TaskNotification) => {
                handleNotification(notification);
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
