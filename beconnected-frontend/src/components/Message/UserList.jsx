import React, { useState, useEffect } from 'react';
import { getChattedUsers } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';

const UserList = ({ currentUserId, selectedUserId, onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getChattedUsers();
                setUsers(userList);
            } catch (error) {
                console.error('Failed to fetch user list:', error);
            }
        };

        fetchUsers();
    }, [currentUserId]);

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
                            <Avatar src={user.profilePicture || defaultProfile} alt={user.username} />
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default UserList;
