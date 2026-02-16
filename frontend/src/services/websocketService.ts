import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type NotificationCallback = (notification: TaskNotification) => void;

export interface TaskNotification {
    type: string;
    taskId: number;
    topic: string;
    message: string;
    timestamp: string;
}

class WebSocketService {
    private client: Client | null = null;
    private callbacks: NotificationCallback[] = [];
    private isConnected = false;

    connect(userId: number, token: string) {

        // Create SockJS instance
        const socket = new SockJS('http://localhost:8080/ws');

        // Create STOMP client
        this.client = new Client({
            webSocketFactory: () => socket as unknown as WebSocket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // On successful connection
        this.client.onConnect = () => {
            this.isConnected = true;

            // Subscribe to user-specific notification queue
            this.client?.subscribe(`/queue/user/${userId}/notifications`, (message) => {
                try {
                    const notification: TaskNotification = JSON.parse(message.body);

                    // Notify all registered callbacks
                    this.callbacks.forEach((callback) => callback(notification));
                } catch (error) {
                    console.error('Error parsing notification:', error);
                }
            });
        };

        // On connection error
        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame.headers['message']);
            console.error('Details:', frame.body);
            this.isConnected = false;
        };

        // On WebSocket close
        this.client.onWebSocketClose = () => {
            this.isConnected = false;
        };

        // Activate the client
        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.isConnected = false;
        }
    }

    onNotification(callback: NotificationCallback) {
        this.callbacks.push(callback);

        // Return unsubscribe function
        return () => {
            this.callbacks = this.callbacks.filter((cb) => cb !== callback);
        };
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

// Export singleton instance
export const websocketService = new WebSocketService();
