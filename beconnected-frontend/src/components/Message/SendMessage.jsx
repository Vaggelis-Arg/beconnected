import React, { useState } from 'react';
import { sendMessage } from '../../api/Api';

const SendMessage = ({ receiverId }) => {
    const [content, setContent] = useState('');

    const handleSend = async () => {
        if (!content.trim()) return;

        try {
            await sendMessage(receiverId, content);
            setContent('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
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
