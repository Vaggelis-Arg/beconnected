import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardHeader, CardContent, Typography, Avatar, CircularProgress, CardActions, IconButton } from '@mui/material';
import { getUserConnectionNotifications, getUserLikeAndCommentNotifications, getProfilePicture } from '../../api/Api';
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

                // Extract unique user IDs for profile picture fetching
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
                                <Card key={notification.notificationId} sx={{ mb: 2 }}>
                                    <CardHeader
                                        avatar={<Avatar src={profilePictures[notification.triggeredByUser.userId] || defaultProfile} />}
                                        title={`${notification.triggeredByUser.username} sent you a connection request.`}
                                    />
                                    <CardActions>
                                        <IconButton color="primary">Accept</IconButton>
                                        <IconButton color="secondary">Decline</IconButton>
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
