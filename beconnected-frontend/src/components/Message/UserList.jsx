// src/components/UserList.js

import React, { useState, useEffect } from 'react';
import { getChattedUsers } from '../../api/Api'; // Import the API utility
import defaultProfile from '../../assets/default-profile.png'; // Import the default profile image
import './userlist.css'; // Import the CSS file

const UserList = ({ currentUserId, onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Use the getChattedUsers function to fetch users
                const userList = await getChattedUsers();
                setUsers(userList);
            } catch (error) {
                console.error('Failed to fetch user list:', error);
            }
        };

        fetchUsers();
    }, [currentUserId]); // Dependency on currentUserId to refetch when it changes

    return (
        <div className="user-list">
            {users.map((user) => (
                <div
                    key={user.userId}
                    className="user-list-item"
                    onClick={() => onSelectUser(user.userId)}
                >
                    <img src={defaultProfile} alt={user.username} className="avatar" />
                    {user.username}
                </div>
            ))}
        </div>
    );
};

export default UserList;
