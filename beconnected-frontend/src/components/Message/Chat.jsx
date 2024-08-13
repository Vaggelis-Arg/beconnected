import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import {
    getChattedUsers,
    getConversation,
    sendMessage as apiSendMessage,
    searchUsers,
    getUserInfoById
} from "../../api/Api";
import UserList from './UserList';
import MessageList from './MessageList';
import SendMessage from './SendMessage';
import Navbar from "../Navbar/Navbar";
import { Container, Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Chat = ({ currentUserId }) => {
    const location = useLocation();
    const initialSelectedUserId = location.state?.userId;

    const [selectedUserId, setSelectedUserId] = useState(initialSelectedUserId || null);
    const [messages, setMessages] = useState([]);
    const [selectedUserInfo, setSelectedUserInfo] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchRecentChattedUser = async () => {
            try {
                const chattedUsers = await getChattedUsers();
                if (chattedUsers.length > 0 && !initialSelectedUserId) {
                    setSelectedUserId(chattedUsers[0].userId);
                }
            } catch (error) {
                console.error('Failed to fetch recent chatted user:', error);
            }
        };

        fetchRecentChattedUser();
    }, [initialSelectedUserId]);

    useEffect(() => {
        if (selectedUserId) {
            const fetchMessages = async () => {
                try {
                    const messagesData = await getConversation(selectedUserId);
                    setMessages(messagesData);

                    if (messagesData.length === 0) {
                        const userInfo = await getUserInfoById(selectedUserId);
                        setSelectedUserInfo(userInfo.data);
                    } else {
                        setSelectedUserInfo(null);
                    }
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            };

            fetchMessages();
        }
    }, [selectedUserId]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.trim()) {
                try {
                    const response = await searchUsers(searchQuery);
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Failed to search users:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const handleSendMessage = async (content) => {
        if (!content.trim()) return;

        try {
            const newMessage = {
                content,
                sender: { userId: currentUserId },
                receiver: { userId: selectedUserId },
                timestamp: new Date().toISOString()
            };

            await apiSendMessage(selectedUserId, content);

            // Only update the state if the message is successfully sent
            setMessages(prevMessages => [...prevMessages, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
        setIsSearchOpen(false);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f3f6f8' }}>
            <Navbar />
            <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', marginTop: '16px' }}>
                <Box sx={{ width: { xs: '30%', sm: '25%', md: '20%' }, borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
                    <Button fullWidth variant="contained" sx={{ marginBottom: '8px' }} onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        {isSearchOpen ? 'Close' : 'Search'}
                    </Button>
                    {isSearchOpen && (
                        <Box p={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                            />
                            <List>
                                {searchResults.map(user => (
                                    <ListItem button key={user.userId} onClick={() => handleUserSelect(user.userId)}>
                                        <ListItemText primary={user.username} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    <UserList currentUserId={currentUserId} selectedUserId={selectedUserId} onSelectUser={handleUserSelect} />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {selectedUserId && (
                        <>
                            <MessageList currentUserId={currentUserId} messages={messages} userInfo={selectedUserInfo} />
                            <Box sx={{ padding: '16px' }}>
                                <SendMessage receiverId={selectedUserId} onSendMessage={handleSendMessage} />
                            </Box>
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Chat;
