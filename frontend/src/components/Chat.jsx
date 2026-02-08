import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import './Chat.css';

const Chat = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { 
        isConnected, 
        messages, 
        onlineCount, 
        typingUser, 
        sendMessage, 
        sendTyping, 
        sendStopTyping 
    } = useSocket();

    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || !isConnected) {
            return;
        }

        sendMessage(inputMessage);
        setInputMessage('');
        setIsTyping(false);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        sendStopTyping();
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);

        if (!isTyping && isConnected) {
            setIsTyping(true);
            sendTyping();
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            sendStopTyping();
        }, 1000);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            {!isOpen && (
                <button
                    className="chat-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                >
                    <span className="chat-toggle-icon">💬</span>
                    <span className="chat-toggle-label">Chat</span>
                    {isAuthenticated && isConnected && onlineCount > 1 && (
                        <span className="chat-badge">{onlineCount}</span>
                    )}
                </button>
            )}

            {isOpen && (
                <div className="chat-panel">
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <h3 className="chat-title"> Cosmic Chat</h3>
                            <div className="chat-status">
                                {isAuthenticated ? (
                                    isConnected ? (
                                        <>
                                            <span className="status-dot status-online" />
                                            <span className="status-text">{onlineCount} online</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="status-dot status-offline" />
                                            <span className="status-text">Connecting...</span>
                                        </>
                                    )
                                ) : (
                                    <span className="status-text">Guest View</span>
                                )}
                            </div>
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {isAuthenticated ? (
                        <>
                            <div className="chat-messages">
                                {messages.length === 0 && (
                                    <div className="chat-empty">
                                        <p>No messages yet. Start a conversation! 🚀</p>
                                    </div>
                                )}

                                {messages.map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        className={`chat-message ${msg.type === 'system' ? 'system-message' : ''} ${msg.userId === user?.id ? 'own-message' : 'other-message'
                                            }`}
                                    >
                                        {msg.type === 'system' ? (
                                            <div className="system-text">{msg.text}</div>
                                        ) : (
                                            <>
                                                <div className="message-header">
                                                    <span className="message-user">
                                                        {msg.userId === user?.id ? 'You' : msg.userName}
                                                    </span>
                                                    <span className="message-time">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                                <div className="message-text">{msg.text}</div>
                                            </>
                                        )}
                                    </div>
                                ))}

                                {typingUser && (
                                    <div className="typing-indicator">
                                        <span>{typingUser} is typing</span>
                                        <span className="typing-dots">
                                            <span>.</span>
                                            <span>.</span>
                                            <span>.</span>
                                        </span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                    placeholder="Type a message..."
                                    className="chat-input"
                                    disabled={!isConnected}
                                />
                                <button
                                    type="submit"
                                    className="chat-send-btn"
                                    disabled={!isConnected || !inputMessage.trim()}
                                >
                                    🚀
                                </button>
                            </form>
                        </>
                    ) : (
                    <div className="chat-guest-view">
                        <div className="guest-icon">🚀</div>
                        <h4 className="guest-title">Join the Conversation!</h4>
                        <p className="guest-text">
                            Login to chat with other space enthusiasts and discuss near-earth objects in real-time.
                        </p>
                        <a href="/auth" className="guest-login-btn">
                            Login to Chat
                        </a>
                    </div>
                )}
            </div>
        )}
    </>
);
};

export default Chat;
