import React from 'react';
import './messagelist.css';

const MessageList = ({ currentUserId, messages }) => {
    return (
        <div className="message-list">
            {messages.map((message) => (
                <div
                    key={message.messageId}
                    className={`message ${message.sender.userId === currentUserId ? 'sent' : 'received'}`}
                >
                    <p>{message.content}</p>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
