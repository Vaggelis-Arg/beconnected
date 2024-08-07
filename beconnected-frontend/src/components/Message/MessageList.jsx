import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import defaultProfile from "../../assets/default-profile.png";

const MessageList = ({ currentUserId, messages, userInfo }) => {
    if (messages.length === 0 && userInfo) {
        return (
            <Box sx={{ padding: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={userInfo.profilePicture || defaultProfile} sx={{ width: 100, height: 100, marginRight: '16px' }} />
                    <Box>
                        <Typography variant="h5">{userInfo.firstName} {userInfo.lastName}</Typography>
                        <Typography variant="body2">@{userInfo.username}</Typography>
                    </Box>
                </Box>
                <Box sx={{ marginTop: '16px' }}>
                    <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map((message) => (
                <Box
                    key={message.messageId}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        flexDirection: message.sender.userId === currentUserId ? 'row-reverse' : 'row',
                    }}
                >
                    <Avatar
                        src={message.sender.userId === currentUserId ? defaultProfile : userInfo?.profilePicture || defaultProfile}
                        sx={{ marginLeft: message.sender.userId === currentUserId ? '16px' : '0', marginRight: message.sender.userId !== currentUserId ? '16px' : '0' }}
                    />
                    <Box
                        sx={{
                            maxWidth: '60%',
                            padding: '12px',
                            backgroundColor: message.sender.userId === currentUserId ? '#cfe9ff' : '#e0e0e0',
                            borderRadius: '8px',
                            wordWrap: 'break-word'
                        }}
                    >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: message.sender.userId === currentUserId ? 'right' : 'left' }}>
                            {new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;
