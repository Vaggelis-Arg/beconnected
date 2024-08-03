import React from 'react';
import MessageList from './MessageList';
import SendMessage from './SendMessage';

const Chat = ({ currentUserId, otherUserId }) => {
    return (
        <div className="chat">
            <MessageList currentUserId={currentUserId} otherUserId={otherUserId} />
            <SendMessage receiverId={otherUserId} />
        </div>
    );
};

export default Chat;