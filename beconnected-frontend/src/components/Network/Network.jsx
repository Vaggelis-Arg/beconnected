import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { getConnections, searchUsers } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';

const Network = () => {
    const [connections, setConnections] = useState([]);
    const [filteredConnections, setFilteredConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await getConnections();
                setConnections(response.data);
                setFilteredConnections(response.data); // Initially, show all connections
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const fetchSearchResults = async () => {
                try {
                    const response = await searchUsers(searchQuery);
                    setFilteredConnections(response.data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchSearchResults();
        } else {
            setFilteredConnections(connections);
        }
    }, [searchQuery, connections]);

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="network-page">
            <Navbar />
            <h1>Your Network</h1>
            <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />
            <div className="network-grid">
                {filteredConnections.length > 0 ? (
                    filteredConnections.map((user) => (
                        <div
                            key={user.userId}
                            className="network-item"
                            onClick={() => handleProfileClick(user.username)}
                            style={{
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                margin: "10px",
                                textAlign: "center",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s",
                                display: "inline-block",
                                width: "150px",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <img
                                src={user.profilePicture || defaultProfile}
                                alt={`${user.username}'s profile`}
                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                            />
                            <p>{user.username}</p>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default Network;
