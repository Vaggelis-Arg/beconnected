import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserInfoByUsername, getConnections, getProfilePicture } from "../../api/Api";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Container, Paper } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import defaultProfile from '../../assets/default-profile.png';

const ConnectionsPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const userInfoResponse = await getUserInfoByUsername(username);
                const connectionsResponse = await getConnections(userInfoResponse.data.userId);
                setConnections(connectionsResponse);

                connectionsResponse.forEach(connection => {
                    fetchProfilePicture(connection.userId);
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchProfilePicture = async (userId) => {
            try {
                const pictureData = await getProfilePicture(userId);
                if (pictureData.status === 200) {
                    const pictureUrl = URL.createObjectURL(new Blob([pictureData.data]));
                    setProfilePictures(prev => ({ ...prev, [userId]: pictureUrl }));
                } else {
                    setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
                }
            } catch (err) {
                console.error('Failed to get profile picture:', err);
                setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
            }
        };

        fetchConnections();
    }, [username]);

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography color="error" align="center">Error: {error}</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f3f6f8', minHeight: '100vh' }}>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {username}'s Connections
                </Typography>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <List>
                        {connections.map((connection) => (
                            <ListItem
                                key={connection.userId}
                                button
                                onClick={() => handleProfileClick(connection.username)}
                                sx={{
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`${connection.username}'s profile`}
                                        src={profilePictures[connection.userId] || defaultProfile}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${connection.firstName} ${connection.lastName}`}
                                    secondary={`@${connection.username}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
};

export default ConnectionsPage;
