import React, { useState, useEffect } from 'react';
import { getChattedUsers } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';
import './userlist.css';

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
        <div className="user-list">
            {users.map((user) => (
                <div
                    key={user.userId}
                    className={`user-list-item ${user.userId === selectedUserId ? 'selected' : ''}`}
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
