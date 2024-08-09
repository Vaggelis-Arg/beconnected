import React, { useState, useEffect } from 'react';
import { getChattedUsers, getProfilePicture } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, CircularProgress } from '@mui/material';

const UserList = ({ currentUserId, selectedUserId, onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingPictures, setLoadingPictures] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getChattedUsers();
                setUsers(userList);

                // Fetch profile pictures for each user
                userList.forEach(user => {
                    fetchProfilePicture(user.userId);
                });
            } catch (error) {
                console.error('Failed to fetch user list:', error);
            }
        };

        fetchUsers();

        return () => {
            // Revoke object URLs to prevent memory leaks
            Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
        };
    }, [currentUserId]);

    const fetchProfilePicture = async (userId) => {
        setLoadingPictures(prev => ({ ...prev, [userId]: true }));
        try {
            const pictureData = await getProfilePicture(userId);
            const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
            setProfilePictures(prev => ({ ...prev, [userId]: pictureUrl }));
        } catch (err) {
            console.error('Failed to get profile picture:', err);
            setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
        } finally {
            setLoadingPictures(prev => ({ ...prev, [userId]: false }));
        }
    };

    return (
        <Box sx={{ overflowY: 'auto', height: '100%' }}>
            <List>
                {users.map((user) => (
                    <ListItem
                        button
                        key={user.userId}
                        selected={user.userId === selectedUserId}
                        onClick={() => onSelectUser(user.userId)}
                    >
                        <ListItemAvatar>
                            <Avatar
                                src={profilePictures[user.userId] || defaultProfile}
                                alt={user.username}
                            />
                            {loadingPictures[user.userId] && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default UserList;
