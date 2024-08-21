import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Avatar,
    CircularProgress,
    IconButton,
    Input,
    TextField,
    Button,
    Stack,
    Card,
    CardContent,
    Snackbar,
    Alert
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import {
    getUserInfoByUsername,
    updateProfilePicture,
    deleteProfilePicture,
    getCurrentUserInfo,
    getProfilePicture,
    updateCurrentUserInfo,
    getConnections,
    requestConnection,
    removeConnection
} from "../../api/Api";
import defaultProfile from "../../assets/default-profile.png";
import Navbar from "../Navbar/Navbar";
import AdminNavbar from "../AdminPage/AdminNavbar";
import ConnectionsButton from "../ConnectionsButton/ConnectionsButton";

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePictureLoading, setProfilePictureLoading] = useState(false);
    const [profilePictureError, setProfilePictureError] = useState(null);
    const [profilePicture, setProfilePicture] = useState(defaultProfile);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [connectionCount, setConnectionCount] = useState(0);

    const [bio, setBio] = useState("");
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserInfoByUsername(username);
                setUser(response.data);

                setBio(response.data.bio || "");
                setExperience(response.data.experience || []);
                setEducation(response.data.education || []);
                setSkills(response.data.skills || []);

                if (response.data.userId) {
                    try {
                        const pictureData = await getProfilePicture(response.data.userId);
                        const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
                        setProfilePicture(pictureUrl);
                    } catch (err) {
                        console.error('Failed to get profile picture:', err);
                        setProfilePicture(defaultProfile);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUserInfo();
                setCurrentUser(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
        fetchCurrentUser();

        return () => {
            URL.revokeObjectURL(profilePicture);
        };
    }, [username]);

    useEffect(() => {
        const updateConnectionStatus = async () => {
            if (currentUser && user) {
                if (currentUser.userId !== user.userId) {
                    try {
                        const connections = await getConnections(currentUser.userId);
                        const profileUserConnections = await getConnections(user.userId);
                        setConnectionCount(profileUserConnections.length);
                        const isConnected = connections.some(conn => conn.userId === user.userId);
                        setConnectionStatus(isConnected ? 'connected' : 'not_connected');
                    } catch (err) {
                        console.error('Failed to get connections:', err);
                    }
                } else {
                    try {
                        const connections = await getConnections(user.userId);
                        setConnectionCount(connections.length);
                    } catch (err) {
                        console.error('Failed to get connections:', err);
                    }
                }
            }
        };

        updateConnectionStatus();
    }, [currentUser, user]);

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePictureLoading(true);
            try {
                await updateProfilePicture(file);
                const response = await getCurrentUserInfo();
                setUser((prevUser) => ({
                    ...prevUser,
                    profilePicture: response.data.profilePicture,
                }));

                try {
                    const pictureData = await getProfilePicture(response.data.userId);
                    const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
                    setProfilePicture(pictureUrl);
                } catch (err) {
                    console.error('Failed to get updated profile picture:', err);
                    setProfilePicture(defaultProfile);
                }
                setSnackbarMessage("Profile picture updated successfully!");
                setSnackbarSeverity("success");
            } catch (err) {
                setProfilePictureError(err.message);
                setSnackbarMessage(`Failed to update profile picture: ${err.message}`);
                setSnackbarSeverity("error");
            } finally {
                setProfilePictureLoading(false);
                setSnackbarOpen(true);
            }
        }
    };

    const handleProfilePictureDelete = async () => {
        setProfilePictureLoading(true);
        try {
            await deleteProfilePicture();
            const response = await getUserInfoByUsername(username);
            setUser(response.data);
            setProfilePicture(defaultProfile);
            setSnackbarMessage("Profile picture deleted successfully!");
            setSnackbarSeverity("success");
        } catch (err) {
            setProfilePictureError(err.message);
            setSnackbarMessage(`Failed to delete profile picture: ${err.message}`);
            setSnackbarSeverity("error");
        } finally {
            setProfilePictureLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleRequestConnection = async () => {
        try {
            await requestConnection(user.userId);
            setConnectionStatus('pending');
            setSnackbarMessage("Connection request sent!");
            setSnackbarSeverity("success");
        } catch (err) {
            console.error('Failed to request connection:', err);
            setSnackbarMessage(`Failed to send connection request: ${err.message}`);
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSendMessage = () => {
        if (user && user.userId) {
            navigate('/messages', { state: { userId: user.userId } });
        }
    };

    const handleUpdateProfile = async () => {
        if (isOwnProfile) {
            try {
                const updatedData = {
                    userId: user.userId,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    bio,
                    experience,
                    education,
                    skills,
                };

                await updateCurrentUserInfo(updatedData);
                setSnackbarMessage("Profile updated successfully!");
                setSnackbarSeverity("success");
            } catch (err) {
                console.error('Failed to update profile:', err.response ? err.response.data : err.message);
                setSnackbarMessage(`Failed to update profile: ${err.message}`);
                setSnackbarSeverity("error");
            } finally {
                setSnackbarOpen(true);
            }
        }
    };

    const handleAddExperience = () => {
        setExperience([...experience, ""]);
    };

    const handleAddEducation = () => {
        setEducation([...education, ""]);
    };

    const handleAddSkill = () => {
        setSkills([...skills, ""]);
    };

    const handleExperienceChange = (index, value) => {
        const newExperience = [...experience];
        newExperience[index] = value;
        setExperience(newExperience);
    };

    const handleEducationChange = (index, value) => {
        const newEducation = [...education];
        newEducation[index] = value;
        setEducation(newEducation);
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const handleRemoveConnection = async () => {
        if (user && user.userId) {
            try {
                await removeConnection(user.userId);
                setConnectionStatus('not_connected');
                setSnackbarMessage('Connection removed successfully!');
                setSnackbarSeverity("success");
            } catch (err) {
                console.error('Failed to remove connection:', err);
                setSnackbarMessage(`Failed to remove connection: ${err.message}`);
                setSnackbarSeverity("error");
            } finally {
                setSnackbarOpen(true);
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const isOwnProfile = currentUser && user && currentUser.username === user.username;

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ backgroundColor: '#f3f6f8', minHeight: '100vh' }}>
            {currentUser.userRole !== 'ADMIN' ? <Navbar /> : <AdminNavbar/>}
            <Box sx={{ padding: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Avatar
                        src={profilePicture}
                        alt={`${user.username}'s profile`}
                        sx={{ width: 150, height: 150, margin: 'auto', mb: 2, objectFit: 'cover' }}
                    />
                    {isOwnProfile && (
                        <Box>
                            <Input
                                type="file"
                                onChange={handleProfilePictureChange}
                                sx={{ display: 'none' }}
                                id="upload-profile-picture"
                            />
                            <label htmlFor="upload-profile-picture">
                                <IconButton color="primary" component="span" sx={{ mr: 1 }}>
                                    <EditIcon />
                                </IconButton>
                            </label>
                            <IconButton color="error" onClick={handleProfilePictureDelete}>
                                <DeleteIcon />
                            </IconButton>
                            {profilePictureLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                            {profilePictureError && <Typography color="error">{profilePictureError}</Typography>}
                        </Box>
                    )}
                    <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
                    <Typography variant="subtitle1">Username: {user.username}</Typography>
                    <Typography variant="body1">Email: {user.email}</Typography>

                    {!isOwnProfile && currentUser.userRole !== 'ADMIN' && (
                        <Box sx={{ mt: 2 }}>
                            {connectionStatus === 'not_connected' && (
                                <Button variant="contained" color="primary" sx={{textTransform : 'none', borderRadius : '30px'}} onClick={handleRequestConnection}>
                                    Connect
                                </Button>
                            )}
                            {connectionStatus === 'pending' && (
                                <Button variant="contained" sx={{textTransform : 'none', borderRadius : '30px'}} disabled>
                                    Pending
                                </Button>
                            )}
                            {connectionStatus === 'connected' && (
                                <>
                                    <Button variant="contained" color="primary" sx={{textTransform : 'none', borderRadius : '30px', marginRight : '10px'}} onClick={handleSendMessage}>
                                        Message
                                    </Button>
                                    <Button variant="outlined" color="error" sx={{textTransform : 'none', borderRadius : '30px'}} onClick={handleRemoveConnection}>
                                        Remove Connection
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <ConnectionsButton
                        currentUser={currentUser}
                        profileUser={user}
                        connectionCount={connectionCount}
                    />
                </Box>

                <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1 }}>
                            Bio
                        </Typography>
                        {isOwnProfile ? (
                            <TextField
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                placeholder="Enter your bio"
                                sx={{ mt: 1 }}
                            />
                        ) : (
                            <Typography variant="body1" sx={{ marginTop: '10px', whiteSpace: 'pre-line' }}>{bio}</Typography>
                        )}
                    </CardContent>
                </Card>


                <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1 }}>
                            Experience
                        </Typography>
                        {isOwnProfile ? (
                            <>
                                <Stack spacing={2}>
                                    {experience.map((exp, index) => (
                                        <TextField
                                            key={index}
                                            value={exp}
                                            onChange={(e) => handleExperienceChange(index, e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Add experience"
                                        />
                                    ))}
                                </Stack>
                                <Button onClick={handleAddExperience} startIcon={<AddIcon />}>Add Experience</Button>
                            </>
                        ) : (
                            <Stack spacing={2}>
                                {experience.map((exp, index) => (
                                    <Box key={index} sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 1 }}>
                                        <Typography variant="body1">{exp}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1 }}>
                            Education
                        </Typography>
                        {isOwnProfile ? (
                            <>
                                <Stack spacing={2}>
                                    {education.map((edu, index) => (
                                        <TextField
                                            key={index}
                                            value={edu}
                                            onChange={(e) => handleEducationChange(index, e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Add education"
                                        />
                                    ))}
                                </Stack>
                                <Button onClick={handleAddEducation} startIcon={<AddIcon />}>Add Education</Button>
                            </>
                        ) : (
                            <Stack spacing={2}>
                                {education.map((edu, index) => (
                                    <Box key={index} sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 1 }}>
                                        <Typography variant="body1">{edu}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, borderBottom: '1px solid #ddd', pb: 1 }}>
                            Skills
                        </Typography>
                        {isOwnProfile ? (
                            <>
                                <Stack spacing={2}>
                                    {skills.map((skill, index) => (
                                        <TextField
                                            key={index}
                                            value={skill}
                                            onChange={(e) => handleSkillChange(index, e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Add skill"
                                        />
                                    ))}
                                </Stack>
                                <Button onClick={handleAddSkill} startIcon={<AddIcon />}>Add Skill</Button>
                            </>
                        ) : (
                            <Stack spacing={2}>
                                {skills.map((skill, index) => (
                                    <Box key={index} sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 1 }}>
                                        <Typography variant="body1">{skill}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {isOwnProfile && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" sx={{ fontSize: '1rem', textTransform: 'none', borderRadius: '30px' }} onClick={handleUpdateProfile}>
                            Save Changes
                        </Button>
                    </Box>
                )}

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default Profile;
