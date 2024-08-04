import React, { useState, useEffect } from 'react';
import { getChattedUsers, getConversation, sendMessage as apiSendMessage, searchUsers } from "../../api/Api";
import UserList from './UserList';
import MessageList from './MessageList';
import SendMessage from './SendMessage';
import Navbar from "../Navbar/Navbar";
import './chat.css';

const Chat = ({ currentUserId }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchRecentChattedUser = async () => {
            try {
                const chattedUsers = await getChattedUsers();
                if (chattedUsers.length > 0) {
                    setSelectedUserId(chattedUsers[0].userId);
                }
            } catch (error) {
                console.error('Failed to fetch recent chatted user:', error);
            }
        };

        fetchRecentChattedUser();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            const fetchMessages = async () => {
                try {
                    const messagesData = await getConversation(selectedUserId);
                    setMessages(messagesData);
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
                    setSearchResults(response.data); // assuming response.data is the user list
                } catch (error) {
                    console.error('Failed to search users:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        fetchSearchResults(); // Perform search immediately without debounce
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
        <div className="chat">
            <Navbar />
            <div className="chat-container">
                <button className="search-button" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                    {isSearchOpen ? 'Close Search' : 'Search Users'}
                </button>
                {isSearchOpen && (
                    <div className="user-search">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users..."
                        />
                        <ul className="search-results">
                            {searchResults.map(user => (
                                <li key={user.userId} onClick={() => handleUserSelect(user.userId)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <UserList className="user-list" currentUserId={currentUserId} onSelectUser={setSelectedUserId} />
                <div className="chat-body">
                    {selectedUserId && (
                        <>
                            <MessageList className="message-list" currentUserId={currentUserId} otherUserId={selectedUserId} messages={messages} />
                            <SendMessage className="send-message" receiverId={selectedUserId} onSendMessage={handleSendMessage} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
