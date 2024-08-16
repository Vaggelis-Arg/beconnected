import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardHeader, Typography, Avatar, CircularProgress, CardActions, Button, CardContent } from '@mui/material';
import { getUserConnectionNotifications, getUserLikeAndCommentNotifications, getProfilePicture, acceptConnection, declineConnection } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';
import Navbar from '../Navbar/Navbar';

const Notifications = () => {
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [likesCommentsNotifications, setLikesCommentsNotifications] = useState([]);
    const [loadingConnections, setLoadingConnections] = useState(true);
    const [loadingLikesComments, setLoadingLikesComments] = useState(true);
    const [error, setError] = useState(null);
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingPictures, setLoadingPictures] = useState({});

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const connections = await getUserConnectionNotifications();
                setConnectionRequests(connections);

                const likesComments = await getUserLikeAndCommentNotifications();
                setLikesCommentsNotifications(likesComments);

                const userIds = [
                    ...new Set([
                        ...connections.map(notification => notification.triggeredByUser.userId),
                        ...likesComments.map(notification => notification.triggeredByUser.userId),
                    ])
                ];

                userIds.forEach(userId => fetchProfilePicture(userId));
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
                setError('Failed to fetch notifications.');
            } finally {
                setLoadingConnections(false);
                setLoadingLikesComments(false);
            }
        };

        const fetchProfilePicture = async (userId) => {
            if (!profilePictures[userId] && !loadingPictures[userId]) {
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
            }
        };

        fetchNotifications();

        return () => {
            Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
        };
    }, [profilePictures]);

    const handleAcceptRequest = async (userId) => {
        try {
            await acceptConnection(userId);
            setConnectionRequests(prev => prev.filter(notification => notification.triggeredByUser.userId !== userId));
        } catch (err) {
            console.error('Failed to accept connection request:', err);
            setError('Failed to accept connection request');
        }
    };

    const handleDeclineRequest = async (userId) => {
        try {
            await declineConnection(userId);
            setConnectionRequests(prev => prev.filter(notification => notification.triggeredByUser.userId !== userId));
        } catch (err) {
            console.error('Failed to decline connection request:', err);
            setError('Failed to decline connection request');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f3f6f8', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Notifications
                    </Typography>

                    {loadingConnections ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" align="center">{error}</Typography>
                    ) : connectionRequests.length > 0 ? (
                        <Box mb={4}>
                            {connectionRequests.map(notification => (
                                <Card key={notification.notificationId} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CardHeader
                                        avatar={<Avatar src={profilePictures[notification.triggeredByUser.userId] || defaultProfile} />}
                                        title={`${notification.triggeredByUser.username} sent you a connection request.`}
                                    />
                                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ mr: 1 }}
                                            onClick={() => handleAcceptRequest(notification.triggeredByUser.userId)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDeclineRequest(notification.triggeredByUser.userId)}
                                        >
                                            Decline
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No connection requests.</Typography>
                    )}

                    {loadingLikesComments ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress />
                        </Box>
                    ) : likesCommentsNotifications.length > 0 ? (
                        <Box>
                            {likesCommentsNotifications.map(notification => (
                                <Card key={notification.notificationId} sx={{ mb: 2 }}>
                                    <CardHeader
                                        avatar={<Avatar src={profilePictures[notification.triggeredByUser.userId] || defaultProfile} />}
                                        title={
                                            notification.type === 'LIKE'
                                                ? `${notification.triggeredByUser.username} liked your post.`
                                                : `${notification.triggeredByUser.username} commented on your post.`
                                        }
                                    />
                                    <CardContent>
                                        {notification.type === 'COMMENT' && (
                                            <Typography variant="body2">{notification.commentMessage}</Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No likes or comments notifications.</Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Notifications;
