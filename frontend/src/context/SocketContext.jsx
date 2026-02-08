import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import getBaseUrl from '../utils/baseURL';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [onlineCount, setOnlineCount] = useState(0);
    const [typingUser, setTypingUser] = useState(null);

    const { isAuthenticated, user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            setMessages([]);
            localStorage.removeItem('chatMessages');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || !user || !token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const baseUrl = getBaseUrl();
        
        const newSocket = io(baseUrl, {
            autoConnect: false,
            auth: { token }
        });

        const onConnect = () => {
             setIsConnected(true);
             newSocket.emit('join', { token, userName: user.name });
        };

        const onDisconnect = () => {
             setIsConnected(false);
        };

        const onJoined = (data) => {
            setMessages((prev) => {
                if (prev.length > 0) return prev;
                
                return [
                    ...prev,
                    {
                        type: 'system',
                        text: data.message,
                        timestamp: new Date().toISOString(),
                    },
                ];
            });
        };

        const onMessage = (data) => {
            setMessages((prev) => [...prev, { ...data, type: 'message' }]);
        };

        const onUserJoined = (data) => {
            if (data.userName === user.name) return;

            setOnlineCount(data.onlineCount);
            setMessages((prev) => [
                ...prev,
                {
                    type: 'system',
                    text: `${data.userName} joined the chat`,
                    timestamp: new Date().toISOString(),
                },
            ]);
        };

        const onUserLeft = (data) => {
            if (data.userName === user.name) return;

            setOnlineCount(data.onlineCount);
            setMessages((prev) => [
                ...prev,
                {
                    type: 'system',
                    text: `${data.userName} left the chat`,
                    timestamp: new Date().toISOString(),
                },
            ]);
        };

        const onOnlineCount = (data) => {
            setOnlineCount(data.count);
        };

        const onTyping = (data) => {
            setTypingUser(data.userName);
            setTimeout(() => setTypingUser(null), 3000);
        };

        const onStopTyping = () => {
            setTypingUser(null);
        };

        const onError = (data) => {
            console.error('Socket error:', data.message);
        };

        newSocket.on('connect', onConnect);
        newSocket.on('disconnect', onDisconnect);
        newSocket.on('joined', onJoined);
        newSocket.on('message', onMessage);
        newSocket.on('user_joined', onUserJoined);
        newSocket.on('user_left', onUserLeft);
        newSocket.on('online_count', onOnlineCount);
        newSocket.on('typing', onTyping);
        newSocket.on('stop_typing', onStopTyping);
        newSocket.on('error', onError);

        newSocket.connect();
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, token, user?.name]);


    const sendMessage = (text) => {
        if (socket && isConnected) {
            socket.emit('message', { text });
        }
    };

    const sendTyping = () => {
        if (socket && isConnected) {
            socket.emit('typing');
        }
    };

    const sendStopTyping = () => {
        if (socket && isConnected) {
            socket.emit('stop_typing');
        }
    };

    return (
        <SocketContext.Provider value={{ 
            socket, 
            isConnected, 
            messages, 
            onlineCount, 
            typingUser,
            sendMessage,
            sendTyping,
            sendStopTyping
        }}>
            {children}
        </SocketContext.Provider>
    );
};
