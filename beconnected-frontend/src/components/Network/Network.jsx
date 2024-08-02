import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { getConnections } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';

const Network = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMutualFollowers = async () => {
            try {
                const response = await getConnections();
                setConnections(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMutualFollowers();
    }, []);

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="network-page">
            <Navbar />
            <h1>Your Network</h1>
            <div className="network-grid">
                {connections.length > 0 ? (
                    connections.map((user) => (
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
                    <p>No mutual followers found.</p>
                )}
            </div>
        </div>
    );
};

export default Network;
