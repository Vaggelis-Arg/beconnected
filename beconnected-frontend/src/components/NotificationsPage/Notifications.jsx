import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardHeader, Typography, Avatar, CircularProgress, CardActions, Button, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserConnectionNotifications, getUserLikeAndCommentNotifications, getProfilePicture, getMediaPost, acceptConnection, declineConnection } from '../../api/Api';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Navbar from '../Navbar/Navbar';
import defaultProfile from '../../assets/default-profile.png';

const Notifications = () => {
    const navigate = useNavigate();
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [likesCommentsNotifications, setLikesCommentsNotifications] = useState([]);
    const [loadingConnections, setLoadingConnections] = useState(true);
    const [loadingLikesComments, setLoadingLikesComments] = useState(true);
    const [error, setError] = useState(null);
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingPictures, setLoadingPictures] = useState({});
    const [mediaContent, setMediaContent] = useState({});

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
                likesComments.forEach(notification => fetchMediaContent(notification.post));
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
                    if (pictureData.status === 200) {
                        const pictureUrl = URL.createObjectURL(new Blob([pictureData.data]));
                        setProfilePictures(prev => ({ ...prev, [userId]: pictureUrl }));
                    } else {
                        setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
                    }
                } catch (err) {
                    console.error('Failed to get profile picture:', err);
                    setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
                } finally {
                    setLoadingPictures(prev => ({ ...prev, [userId]: false }));
                }
            }
        };

        const fetchMediaContent = async (post) => {
            if (!post || mediaContent[post.postId]) return;
            try {
                const mediaBlob = await getMediaPost(post.postId);
                if (!mediaBlob) {
                    return;
                }
                const mediaUrl = URL.createObjectURL(mediaBlob);
                setMediaContent(prev => ({
                    ...prev,
                    [post.postId]: {
                        mediaUrl,
                        mediaType: mediaBlob.type,
                    },
                }));
            } catch (err) {
                console.error('Failed to fetch media for post:', err);
            }
        };

        fetchNotifications();

        return () => {
            Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
            Object.values(mediaContent).forEach(({ mediaUrl }) => URL.revokeObjectURL(mediaUrl));
        };
    }, [profilePictures, mediaContent]);

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

    const handleUserClick = (username) => {
        navigate(`/profile/${username}`);
    };

    const renderPostContent = (post) => {
        if (!post) return null;

        const media = mediaContent[post.postId];

        return (
            <Box mt={2} p={2} sx={{ backgroundColor: '#f3f6f8', borderRadius: 2 }}>
                <Typography variant="body2" color="textPrimary">
                    {post.textContent}
                </Typography>
                {media && (
                    <Box mt={1}>
                        {renderMedia(media)}
                    </Box>
                )}
            </Box>
        );
    };

    const renderMedia = (media) => {
        if (!media || !media.mediaUrl) return null;

        const mediaStyles = {
            maxWidth: '200px',
            maxHeight: '150px',
            borderRadius: '8px',
            objectFit: 'cover',
        };

        switch (media.mediaType) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                return <img src={media.mediaUrl} alt="Post media" style={mediaStyles} />;
            case 'video/mp4':
            case 'video/webm':
                return (
                    <video controls style={mediaStyles}>
                        <source src={media.mediaUrl} type={media.mediaType} />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'audio/mpeg':
            case 'audio/wav':
                return (
                    <audio controls style={{ maxWidth: '200px', width: '100%' }}>
                        <source src={media.mediaUrl} type={media.mediaType} />
                        Your browser does not support the audio element.
                    </audio>
                );
            default:
                return <Typography variant="body2" color="error">Unsupported media type</Typography>;
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f3f6f8', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Notifications
                </Typography>
                <Box mb={4}>
                    <Typography variant="h5" gutterBottom>
                        Connection Requests
                    </Typography>
                    {loadingConnections ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" align="center">{error}</Typography>
                    ) : connectionRequests.length > 0 ? (
                        <Box>
                            {connectionRequests.map(notification => (
                                <Card key={notification.notificationId} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CardHeader
                                        avatar={<Avatar src={profilePictures[notification.triggeredByUser.userId] || defaultProfile} />}
                                        title={`${notification.triggeredByUser.username} sent you a connection request.`}
                                        titleTypographyProps={{ fontWeight: 'bold' }}
                                        onClick={() => handleUserClick(notification.triggeredByUser.username)}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
                                        <Button
                                            variant="text"
                                            color="success"
                                            sx={{ mr: 1 }}
                                            onClick={() => handleAcceptRequest(notification.triggeredByUser.userId)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="text"
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
                </Box>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Likes and Comments
                    </Typography>
                    {loadingLikesComments ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
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
                                                : `${notification.triggeredByUser.username} commented "${notification.commentMessage}" on your post.`
                                        }
                                        titleTypographyProps={{ fontWeight: 'bold' }}
                                        onClick={() => handleUserClick(notification.triggeredByUser.username)}
                                        sx={{ cursor: 'pointer' }}
                                        action={
                                            notification.type === 'LIKE' ? (
                                                <FavoriteIcon fontSize="large" />
                                            ) : (
                                                <CommentIcon fontSize="large" />
                                            )
                                        }
                                    />
                                    <CardContent>
                                        {renderPostContent(notification.post)}
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
