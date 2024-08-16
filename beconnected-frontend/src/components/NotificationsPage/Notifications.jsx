import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardHeader, CardContent, Typography, Avatar, CircularProgress, Grid, CardActions, IconButton } from '@mui/material';
import { getUserConnectionNotifications, getUserLikeAndCommentNotifications } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';
import Navbar from '../Navbar/Navbar';

const Notifications = () => {
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [likesCommentsNotifications, setLikesCommentsNotifications] = useState([]);
    const [loadingConnections, setLoadingConnections] = useState(true);
    const [loadingLikesComments, setLoadingLikesComments] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const connections = await getUserConnectionNotifications();
                setConnectionRequests(connections);

                const likesComments = await getUserLikeAndCommentNotifications();
                setLikesCommentsNotifications(likesComments);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
                setError('Failed to fetch notifications.');
            } finally {
                setLoadingConnections(false);
                setLoadingLikesComments(false);
            }
        };

        fetchNotifications();
    }, []);

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
                            {connectionRequests.map((notification) => (
                                <Card key={notification.id} sx={{ mb: 2 }}>
                                    <CardHeader
                                        avatar={<Avatar src={notification.profilePicture || defaultProfile} />}
                                        title={notification.username}
                                        subheader={`${notification.firstName} ${notification.lastName} sent you a connection request.`}
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
                            {likesCommentsNotifications.map((notification) => (
                                <Card key={notification.id} sx={{ mb: 2 }}>
                                    <CardHeader
                                        avatar={<Avatar src={notification.profilePicture || defaultProfile} />}
                                        title={notification.username}
                                        subheader={
                                            notification.type === 'like'
                                                ? `${notification.username} liked your post.`
                                                : `${notification.username} commented on your post.`
                                        }
                                    />
                                    <CardContent>
                                        {notification.type === 'comment' && (
                                            <Typography variant="body2">{notification.commentText}</Typography>
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
