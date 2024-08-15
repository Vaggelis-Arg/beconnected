import React, { useState, useEffect } from 'react';
import { Grid, Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, TextField, Button, CircularProgress, Box, Container } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Collections from "@mui/icons-material/Collections";
import SendIcon from '@mui/icons-material/Send';
import Navbar from '../Navbar/Navbar';
import { getFeedForCurrentUser, likePost, removeLike, addComment, createPost, getProfilePicture, getMediaPost, getCommentsByPost, getLikesByPost, getCurrentUserInfo } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [newPostMediaName, setNewPostMediaName] = useState('');
    const [newPostMedia, setNewPostMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePictures, setProfilePictures] = useState({});
    const [commentText, setCommentText] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUserInfo();
                setCurrentUser(response.data); // Set current user info
            } catch (err) {
                console.error('Failed to fetch current user info:', err);
                setError('Failed to fetch current user info.');
            }
        };

        fetchCurrentUser();
    }, []);


    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await getFeedForCurrentUser();

                const postsWithMedia = await Promise.all(response.map(async (post) => {
                    if (post.mediaContent) {
                        try {
                            const mediaBlob = await getMediaPost(post.postId);
                            const mediaUrl = URL.createObjectURL(mediaBlob);
                            return { ...post, mediaUrl };
                        } catch (error) {
                            console.error(`Failed to fetch media for post ${post.postId}:`, error);
                            return { ...post };
                        }
                    }
                    return post;
                }));

                const postsWithLikesAndComments = await Promise.all(postsWithMedia.map(async (post) => {
                    try {
                        const [likes, comments] = await Promise.all([
                            getLikesByPost(post.postId),
                            getCommentsByPost(post.postId)
                        ]);
                        return { ...post, likes, comments };
                    } catch (error) {
                        console.error(`Failed to fetch likes or comments for post ${post.postId}:`, error);
                        return post;
                    }
                }));

                setPosts(postsWithLikesAndComments);

                response.forEach(post => {
                    fetchProfilePicture(post.author.userId);
                });
            } catch (err) {
                console.error('Failed to fetch feed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();

        return () => {
            posts.forEach(post => {
                if (post.mediaUrl) {
                    URL.revokeObjectURL(post.mediaUrl);
                }
            });
            Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
        };
    }, [posts, profilePictures]);

    const fetchProfilePicture = async (userId) => {
        try {
            const pictureData = await getProfilePicture(userId);
            const pictureBlob = new Blob([pictureData]);
            const pictureUrl = URL.createObjectURL(pictureBlob);
            setProfilePictures(prev => ({ ...prev, [userId]: pictureUrl }));
        } catch (err) {
            console.error('Failed to get profile picture:', err);
            setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
        }
    };

    const handleLikePost = async (postId) => {
        if (!currentUser) return; // Ensure currentUser is fetched

        try {
            const post = posts.find(post => post.postId === postId);
            const isLiked = post.likes.includes(currentUser);

            if (isLiked) {
                await removeLike(postId);
                setPosts(posts.map(post =>
                    post.postId === postId
                        ? { ...post, likes: post.likes.filter(user => user !== currentUser) }
                        : post
                ));
            } else {
                await likePost(postId);
                setPosts(posts.map(post =>
                    post.postId === postId
                        ? { ...post, likes: [...post.likes, currentUser] }
                        : post
                ));
            }
        } catch (err) {
            console.error('Failed to toggle like on post:', err);
            setError('Failed to toggle like on post.');
        }
    };


    const handleComment = async (postId) => {
        const comment = commentText[postId];
        if (!comment || !comment.trim()) return;

        try {
            await addComment(postId, comment);
            setPosts(posts.map(post =>
                post.postId === postId
                    ? { ...post, comments: [...post.comments, { text: comment, username: currentUser.username, date: new Date().toLocaleDateString() }] }
                    : post
            ));
            setCommentText(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Failed to add comment:', err);
            setError('Failed to add comment.');
        }
    };

    const handleCreatePost = async () => {
        if (!newPostText.trim()) return;

        try {
            await createPost(newPostText, newPostMedia);
            setNewPostText('');
            setNewPostMedia(null);
            setNewPostMediaName('');

            const response = await getFeedForCurrentUser();
            const postsWithMedia = await Promise.all(response.map(async (post) => {
                if (post.mediaContent) {
                    try {
                        const mediaBlob = await getMediaPost(post.postId);
                        const mediaUrl = URL.createObjectURL(mediaBlob);
                        return { ...post, mediaUrl };
                    } catch (error) {
                        console.error(`Failed to fetch media for post ${post.postId}:`, error);
                        return { ...post };
                    }
                }
                return post;
            }));

            const postsWithLikesAndComments = await Promise.all(postsWithMedia.map(async (post) => {
                try {
                    const [likes, comments] = await Promise.all([
                        getLikesByPost(post.postId),
                        getCommentsByPost(post.postId)
                    ]);
                    return { ...post, likes, comments };
                } catch (error) {
                    console.error(`Failed to fetch likes or comments for post ${post.postId}:`, error);
                    return post;
                }
            }));

            setPosts(postsWithLikesAndComments);

            response.forEach(post => {
                fetchProfilePicture(post.author.userId);
            });
        } catch (err) {
            console.error('Failed to create post:', err);
            setError('Failed to create post.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPostMedia(file);
            setNewPostMediaName(file.name);
        }
    };

    const handleCommentTextChange = (postId, text) => {
        setCommentText(prev => ({ ...prev, [postId]: text }));
    };

    const renderMedia = (post) => {
        if (!post.mediaUrl) return null;

        switch (post.mediaType) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                return <img src={post.mediaUrl} alt="Post media" style={{ width: '100%', borderRadius: 8 }} />;
            case 'video/mp4':
            case 'video/webm':
                return (
                    <video controls style={{ width: '100%', borderRadius: 8 }}>
                        <source src={post.mediaUrl} type={post.mediaType} />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'audio/mpeg':
            case 'audio/ogg':
                return (
                    <audio controls style={{ width: '100%' }}>
                        <source src={post.mediaUrl} type={post.mediaType} />
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
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Card sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="What's on your mind?"
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton color="primary" component="label">
                                    <Collections />
                                    <Typography variant="body2" color="primary" sx={{ marginLeft: '5px' }}>
                                        Media
                                    </Typography>
                                    <input type="file" hidden onChange={handleFileChange} />
                                </IconButton>
                                {newPostMediaName && (
                                    <Typography variant="body2" color="textSecondary" sx={{ marginLeft: '10px' }}>
                                        {newPostMediaName}
                                    </Typography>
                                )}
                            </Box>
                            <Button variant="contained" color="primary" sx={{ fontSize: '1rem', textTransform: 'none', borderRadius: '30px' }} onClick={handleCreatePost}>
                                Post
                            </Button>
                        </Box>
                    </Card>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {posts.map(post => (
                            <Grid item xs={12} key={post.postId}>
                                <Card>
                                    <CardHeader
                                        avatar={<Avatar src={profilePictures[post.author.userId] || defaultProfile} />}
                                        title={post.author.username}
                                        subheader={new Date(post.createdAt).toLocaleDateString()}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary">
                                            {post.textContent}
                                        </Typography>
                                        {renderMedia(post)}
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <IconButton onClick={() => handleLikePost(post.postId)}>
                                            <FavoriteIcon color={post.likes.includes('You') ? 'error' : 'default'} />
                                        </IconButton>
                                        <Typography variant="body2" color="textSecondary">
                                            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                                        </Typography>
                                        <IconButton>
                                            <CommentIcon />
                                        </IconButton>
                                        <Typography variant="body2" color="textSecondary">
                                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                                        </Typography>
                                    </CardActions>
                                    <Box px={2} pb={2}>
                                        {post.comments.length > 0 ? (
                                            post.comments.map((comment, index) => (
                                                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9', borderRadius: 2, p: 1, mb: 1 }}>
                                                    <Typography variant="body2" color="textPrimary">
                                                        {comment.user?.username || 'Unknown User'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {comment.commentText}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {new Date(comment.commentedAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No comments yet.
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <TextField
                                                fullWidth
                                                placeholder="Add a comment..."
                                                variant="outlined"
                                                value={commentText[post.postId] || ''}
                                                onChange={(e) => handleCommentTextChange(post.postId, e.target.value)}
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <IconButton
                                                color="primary"
                                                sx={{ ml: 1 }}
                                                onClick={() => handleComment(post.postId)}
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default FeedPage;
