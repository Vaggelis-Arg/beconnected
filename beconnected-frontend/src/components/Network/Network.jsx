import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import {getConnections, searchUsers, followUser} from '../../api/Api';
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
    Box
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const Network = () => {
    const [connections, setConnections] = useState([]);
    const [filteredConnections, setFilteredConnections] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [followedStatus, setFollowedStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await getConnections();
                setConnections(response.data);
                setFilteredConnections(response.data);
                const storedFollowedStatus = JSON.parse(localStorage.getItem('followedStatus')) || {};
                setFollowedStatus(storedFollowedStatus);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchConnections();

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const filteredQuery = filterIgnoredCharacters(searchQuery);
        if (filteredQuery) {
            const fetchSearchResults = async () => {
                try {
                    const response = await searchUsers(filteredQuery);
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

    const handleFollowClick = async (userId) => {
        try {
            await followUser(userId);
            const updatedFollowedStatus = {...followedStatus, [userId]: true};
            setFollowedStatus(updatedFollowedStatus);
            localStorage.setItem('followedStatus', JSON.stringify(updatedFollowedStatus));
        } catch (err) {
            console.error('Failed to follow user:', err);
            setError('Failed to follow user');
        }
    };

    const handleStorageChange = (event) => {
        if (event.storageArea === localStorage) {
            const updatedFollowedStatus = JSON.parse(localStorage.getItem('followedStatus')) || {};
            setFollowedStatus(updatedFollowedStatus);
        }
    };

    const filterIgnoredCharacters = (query) => {
        const ignoredCharacters = /[[\]^$.|?*+()\\]/g;
        return query.replace(ignoredCharacters, '');
    };

    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
            <Navbar/>
            <Container maxWidth="md" sx={{mt: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search People and Grow Your Network
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{mb: 4}}
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
                                        sx={{width: 100, height: 100, borderRadius: '50%'}}
                                        image={user.profilePicture || defaultProfile}
                                        alt={`${user.username}'s profile`}
                                    />
                                    <CardContent sx={{textAlign: 'center'}}>
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
                                            backgroundColor: followedStatus[user.userId] ? '#a0a0a0' : '#0a66c2',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            borderRadius: '30px',
                                            '&:hover': {
                                                backgroundColor: followedStatus[user.userId] ? '#a0a0a0' : '#004182',
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!followedStatus[user.userId]) {
                                                handleFollowClick(user.userId);
                                            }
                                        }}
                                        disabled={followedStatus[user.userId]}
                                    >
                                        {followedStatus[user.userId] ? 'Following' : 'Connect'}
                                    </Button>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Box textAlign="center">
                                <PeopleOutlineIcon sx={{fontSize: 80, color: '#0a66c2'}}/>
                                <Typography variant="h6" sx={{mt: 2}}>
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
