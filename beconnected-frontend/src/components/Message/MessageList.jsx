import React, { useState, useEffect } from 'react';
import { getConversation } from '../../api/Api'; // Assuming you've defined these API methods

const MessageList = ({ currentUserId, otherUserId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesData = await getConversation(otherUserId);
                setMessages(messagesData);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();
    }, [otherUserId]);

    return (
        <div className="message-list">
            {messages.map((message) => (
                <div key={message.messageId} className={message.sender.userId === currentUserId ? 'message sent' : 'message received'}>
                    <p>{message.content}</p>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
