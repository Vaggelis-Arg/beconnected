import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import {
    getCurrentUserInfo,
    getConnections,
    searchUsers,
    requestConnection,
    getProfilePicture,
    getReceivedPendingRequests,
    acceptConnection,
    declineConnection
} from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';
import {
    Container,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Box,
    Divider
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const Network = () => {
    const [connections, setConnections] = useState([]);
    const [filteredConnections, setFilteredConnections] = useState([]);
    const [receivedPendingRequests, setReceivedPendingRequests] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [connectionStatus, setConnectionStatus] = useState({});
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingPictures, setLoadingPictures] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConnectionsAndPendingRequests = async () => {
            try {
                const userInfo = await getCurrentUserInfo();
                const userId = userInfo.data.userId;

                const connectionsData = await getConnections(userId);
                setConnections(connectionsData);
                setFilteredConnections(connectionsData);

                const receivedPendingRequestsData = await getReceivedPendingRequests(userId);
                setReceivedPendingRequests(receivedPendingRequestsData);

                const statusMap = {};
                connectionsData.forEach(user => {
                    statusMap[user.userId] = 'connected';
                });
                receivedPendingRequestsData.forEach(request => {
                    statusMap[request.requestingUser.userId] = 'pending';
                });
                setConnectionStatus(statusMap);

                connectionsData.forEach(user => {
                    fetchProfilePicture(user.userId);
                });

                receivedPendingRequestsData.forEach(request => {
                    fetchProfilePicture(request.requestingUser.userId);
                });
            } catch (err) {
                setError(err.message);
            }
        };


        fetchConnectionsAndPendingRequests();

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    useEffect(() => {
        const filteredQuery = filterIgnoredCharacters(searchQuery);
        if (filteredQuery) {
            const fetchSearchResults = async () => {
                try {
                    const response = await searchUsers(filteredQuery);
                    setFilteredConnections(response.data);

                    response.data.forEach(user => {
                        fetchProfilePicture(user.userId);
                    });
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchSearchResults();
        } else {
            setFilteredConnections(connections);
        }
    }, [searchQuery, connections]);

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

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleConnectClick = async (userId) => {
        try {
            await requestConnection(userId);
            const updatedConnectionStatus = { ...connectionStatus, [userId]: 'pending' };
            setConnectionStatus(updatedConnectionStatus);
            sessionStorage.setItem('connectionStatus', JSON.stringify(updatedConnectionStatus));
        } catch (err) {
            console.error('Failed to send connection request:', err);
            setError('Failed to send connection request');
        }
    };

    const handleAcceptRequest = async (userId) => {
        try {
            await acceptConnection(userId);
            const updatedStatus = { ...connectionStatus, [userId]: 'connected' };
            setConnectionStatus(updatedStatus);
            setReceivedPendingRequests(prev => prev.filter(request => request.requestingUser.userId !== userId));
        } catch (err) {
            console.error('Failed to accept connection request:', err);
            setError('Failed to accept connection request');
        }
    };

    const handleDeclineRequest = async (userId) => {
        try {
            await declineConnection(userId);
            setReceivedPendingRequests(prev => prev.filter(request => request.requestingUser.userId !== userId));
        } catch (err) {
            console.error('Failed to decline connection request:', err);
            setError('Failed to decline connection request');
        }
    };

    const handleStorageChange = (event) => {
        if (event.storageArea === sessionStorage) {
            const updatedConnectionStatus = JSON.parse(sessionStorage.getItem('connectionStatus')) || {};
            setConnectionStatus(updatedConnectionStatus);
        }
    };

    const filterIgnoredCharacters = (query) => {
        const ignoredCharacters = /[[\]^$.|?*+()\\]/g;
        return query.replace(ignoredCharacters, '');
    };

    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Received Pending Requests
                </Typography>
                {receivedPendingRequests.length > 0 ? (
                    <Box sx={{ mb: 4 }}>
                        {receivedPendingRequests.map((request) => (
                            <Card
                                key={request.requestingUser.userId}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    mb: 2,
                                    boxShadow: 3
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ width: 60, height: 60, borderRadius: '50%', mr: 2 }}
                                    image={profilePictures[request.requestingUser.userId] || defaultProfile}
                                    alt={`${request.requestingUser.username}'s profile`}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {request.requestingUser.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {request.requestingUser.firstName} {request.requestingUser.lastName}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ mb: 1 }}
                                        onClick={() => handleAcceptRequest(request.requestingUser.userId)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeclineRequest(request.requestingUser.userId)}
                                    >
                                        Decline
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No pending requests.
                    </Typography>
                )}

                <Divider sx={{ my: 4 }} />

                <Typography variant="h4" component="h1" gutterBottom>
                    Search People and Grow Your Network
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ mb: 4 }}
                />
                <Grid container spacing={3}>
                    {filteredConnections.length > 0 ? (
                        filteredConnections.map((user) => (
                            <Grid item xs={12} sm={6} md={4} key={user.userId}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                    onClick={() => handleProfileClick(user.username)}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 100, height: 100, borderRadius: '50%' }}
                                        image={profilePictures[user.userId] || defaultProfile}
                                        alt={`${user.username}'s profile`}
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" component="div">
                                            {user.username}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.firstName} {user.lastName}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            backgroundColor:
                                                connectionStatus[user.userId] === 'connected' ? '#a0a0a0' :
                                                    connectionStatus[user.userId] === 'pending' ? '#ff9800' :
                                                        '#0a66c2',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            borderRadius: '30px',
                                            '&:hover': {
                                                backgroundColor:
                                                    connectionStatus[user.userId] === 'connected' ? '#a0a0a0' :
                                                        connectionStatus[user.userId] === 'pending' ? '#e68a00' :
                                                            '#004182',
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!connectionStatus[user.userId]) {
                                                handleConnectClick(user.userId);
                                            }
                                        }}
                                        disabled={connectionStatus[user.userId] === 'connected' || connectionStatus[user.userId] === 'pending'}
                                    >
                                        {connectionStatus[user.userId] === 'connected' ? 'Connected' :
                                            connectionStatus[user.userId] === 'pending' ? 'Pending' :
                                                'Connect'}
                                    </Button>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Box textAlign="center">
                                <PeopleOutlineIcon sx={{ fontSize: 80, color: '#0a66c2' }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    No users found.
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Try adjusting your search to connect with new people!
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
};

export default Network;
