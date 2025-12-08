import { useState, useRef, useEffect, useCallback } from 'react';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    // Use a ref to track if we should reconnect to avoid infinite loops
    const shouldReconnect = useRef(true);

    const connect = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        // Get or Create Session ID
        let sessionId = localStorage.getItem('chat_session_id');
        console.log("useChat: Connect called. Retrieved Session ID:", sessionId);
        if (!sessionId) {
            // Simple UUID generator fallback for non-secure contexts
            sessionId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('chat_session_id', sessionId);
        }

        // Use specific IP or localhost depending on environment
        // Ideally this URL should come from an env var, e.g. import.meta.env.VITE_WS_URL
        const wsUrl = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1') + '/chatbot/ws/chat?session_id=' + sessionId;

        console.log("Connecting to WebSocket:", wsUrl);
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
            setIsStreaming(false);
        };

        socketRef.current.onmessage = (event) => {
            try {
                // Try parsing as JSON (new protocol)
                const data = JSON.parse(event.data);

                if (data.type === 'history') {
                    // Restore history from backend
                    setMessages(data.payload);
                    setIsStreaming(false);
                } else if (data.type === 'content') {
                    const chunk = data.payload;
                    setMessages((prev) => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg && lastMsg.sender === 'bot') {
                            return [
                                ...prev.slice(0, -1),
                                { ...lastMsg, text: lastMsg.text + chunk }
                            ];
                        } else {
                            return [...prev, { sender: 'bot', text: chunk }];
                        }
                    });
                    setIsStreaming(true);
                } else if (data.type === 'end') {
                    setIsStreaming(false);
                } else if (data.type === 'error') {
                    console.error("Chat Error:", data.payload);
                    setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${data.payload}` }]);
                    setIsStreaming(false);
                }
            } catch (e) {
                // Fallback for raw text (legacy or error) or just ignore
                console.warn("Received non-JSON message:", event.data);
            }
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsConnected(false);
            setIsStreaming(false);

            // Optional: Attempt reconnect logic could go here
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }, []);

    // Connect on mount
    useEffect(() => {
        connect();
        return () => {
            shouldReconnect.current = false;
            socketRef.current?.close();
        };
    }, [connect]);

    // Send Message Function
    const sendMessage = useCallback((text) => {
        // Add User Message immediately
        setMessages((prev) => [...prev, { sender: 'user', text }]);

        // Send to Backend
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(text);
            setIsStreaming(true);
        } else {
            console.warn("WebSocket is not open. Attempting to reconnect...");
            connect();
            // Simple retry once connected could be added here, but for now just warn
        }
    }, [connect]);

    // Clear History
    const clearHistory = useCallback(() => {
        // 1. Generate new Session ID
        const newId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem('chat_session_id', newId);

        // 2. Clear Local State
        setMessages([]);
        setIsStreaming(false);

        // 3. Force Reconnect to use new ID
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        // Small delay to ensure clear
        setTimeout(() => connect(), 100);

    }, [connect]);

    // Load initial history support (optional, if we want to pass it in)
    // For now, ChatWidget handles loading from localStorage, so we might want to expose setMessages
    // or handle it internally. Let's expose setMessages for flexibility if the Widget wants to hydrate it.

    return {
        messages,
        sendMessage,
        isStreaming,
        isConnected,
        setMessages,
        clearHistory
    };
}
