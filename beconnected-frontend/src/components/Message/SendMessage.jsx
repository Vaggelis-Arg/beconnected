import React, { useState } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const SendMessage = ({ receiverId, onSendMessage }) => {
    const [content, setContent] = useState('');

    const handleSend = () => {
        if (!content.trim()) return;

        onSendMessage(content);
        setContent('');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                fullWidth
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                sx={{ marginRight: '8px' }}
            />
            <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
            </IconButton>
        </Box>
    );
};

export default SendMessage;
