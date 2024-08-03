import React, { useState } from 'react';
import './sendmessage.css';

const SendMessage = ({ receiverId, onSendMessage }) => {
    const [content, setContent] = useState('');

    const handleSend = () => {
        if (!content.trim()) return;

        onSendMessage(content);
        setContent('');
    };

    return (
        <div className="send-message">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default SendMessage;
