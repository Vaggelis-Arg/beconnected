import React, {useEffect, useState} from 'react';
import Chat from './Chat';
import {getCurrentUserInfo} from '../../api/Api';

const ChatPage = () => {
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUserInfo();
                setCurrentUserId(response.data.userId);
            } catch (error) {
                console.error('Failed to fetch current user info:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <div>
            <Chat currentUserId={currentUserId}/>
        </div>
    );
};

export default ChatPage;
