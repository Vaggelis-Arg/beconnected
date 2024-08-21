import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import defaultProfile from '../../assets/default-profile.png';
import {
    getAllUsers,
    exportUsersDataByIds,
    searchUsers,
    getProfilePicture
} from '../../api/Api';
import AdminNavbar from "./AdminNavbar";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingPictures, setLoadingPictures] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setFilteredUsers(response);

                response.forEach(user => {
                    fetchProfilePicture(user.userId);
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();

        return () => {
            Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    useEffect(() => {
        const filteredQuery = filterIgnoredCharacters(searchQuery);
        if (filteredQuery) {
            const fetchSearchResults = async () => {
                try {
                    const response = await searchUsers(filteredQuery);
                    setFilteredUsers(response.data);

                    response.data.forEach(user => {
                        fetchProfilePicture(user.userId);
                    });
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchSearchResults();
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const fetchProfilePicture = async (userId) => {
        setLoadingPictures(prev => ({...prev, [userId]: true}));
        try {
            const pictureData = await getProfilePicture(userId);
            const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
            setProfilePictures(prev => ({...prev, [userId]: pictureUrl}));
        } catch (err) {
            console.error('Failed to get profile picture:', err);
            setProfilePictures(prev => ({...prev, [userId]: defaultProfile}));
        } finally {
            setLoadingPictures(prev => ({...prev, [userId]: false}));
        }
    };

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = async (format) => {
        try {
            if (selectedUserIds.length === 0) {
                alert('Please select at least one user to export.');
                return;
            }

            await exportUsersDataByIds(selectedUserIds, format);
        } catch (err) {
            setError('Failed to export user data.');
        }
    };

    const handleSelectionToggle = (event, userId) => {
        event.stopPropagation();
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const filterIgnoredCharacters = (query) => {
        const ignoredCharacters = /[[\]^$.|?*+()\\]/g;
        return query.replace(ignoredCharacters, '');
    };

    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <div style={{backgroundColor: '#f3f6f8', minHeight: '100vh'}}>
            <AdminNavbar/>
            <Container maxWidth="md" sx={{mt: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>

                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{mb: 4}}
                />

                <Box sx={{mb: 4}}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{mr: 2, fontSize: '1rem', textTransform: 'none', borderRadius: '30px' }}
                        onClick={() => handleExport('json')}
                    >
                        Export as JSON
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{fontSize: '1rem', textTransform: 'none', borderRadius: '30px' }}
                        onClick={() => handleExport('xml')}
                    >
                        Export as XML
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
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
                                        image={profilePictures[user.userId] || defaultProfile}
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
                                    <Box sx={{textAlign: 'center', mt: 1}}>
                                        <Button
                                            variant="outlined"
                                            color={selectedUserIds.includes(user.userId) ? 'secondary' : 'primary'}
                                            onClick={(event) => handleSelectionToggle(event, user.userId)}
                                        >
                                            {selectedUserIds.includes(user.userId) ? 'Deselect' : 'Select'}
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h6" sx={{mt: 2}}>
                                No users found.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
};

export default AdminPage;
