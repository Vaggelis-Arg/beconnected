import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar/Navbar";
import { getConnections } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';

const Network = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="network-page">
            <Navbar/>
            <h1>Your Network</h1>
            <div className="network-grid">
                {connections.length > 0 ? (
                    connections.map(user => (
                        <div key={user.userId} className="network-item">
                            <img
                                src={user.profilePicture || defaultProfile}
                                alt={`${user.username}'s profile`}
                                style={{width: '100px', height: '100px', objectFit: 'cover'}}
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
