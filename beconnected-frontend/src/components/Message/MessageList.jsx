import React from 'react';
import './messagelist.css';
import defaultProfile from "../../assets/default-profile.png";

const MessageList = ({ currentUserId, messages, userInfo }) => {
    if (messages.length === 0 && userInfo) {
        return (
            <div className="user-profile-info">
                <div className="profile-header">
                    <img src={userInfo.profilePicture || defaultProfile} alt={`${userInfo.username}'s profile`}
                         className="profile-picture"/>
                    <div className="profile-details">
                        <h2 className="profile-name">{userInfo.firstName} {userInfo.lastName}</h2>
                        <h4 className="profile-username">{userInfo.username}</h4>
                    </div>
                </div>
                <div className="profile-info">
                    <p className="profile-email"><strong>Email:</strong> {userInfo.email}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages.map((message) => (
                <div
                    key={message.messageId}
                    className={`message ${
                        message.sender.userId === currentUserId ? 'sent' : 'received'
                    }`}
                >
                    <p>{message.content}</p>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
