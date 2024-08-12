import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, CircularProgress, IconButton, Input, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import {
    getUserInfoByUsername,
    updateProfilePicture,
    deleteProfilePicture,
    getCurrentUserInfo,
    getProfilePicture,
    updateCurrentUserInfo, getConnections, requestConnection
} from "../../api/Api";
import defaultProfile from "../../assets/default-profile.png";
import Navbar from "../Navbar/Navbar";

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

    const [bio, setBio] = useState("");
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);

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
                        const isConnected = connections.some(conn => conn.userId === user.userId);
                        setConnectionStatus(isConnected ? 'connected' : 'not_connected');
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
            } catch (err) {
                setProfilePictureError(err.message);
            } finally {
                setProfilePictureLoading(false);
            }
        }
    };

    const handleProfilePictureDelete = async () => {
        setProfilePictureLoading(true);
        try {
            await deleteProfilePicture();
            const response = await getUserInfoByUsername(username);
            setUser(response.data);
            setProfilePicture(defaultProfile); // Set to default profile picture
        } catch (err) {
            setProfilePictureError(err.message);
        } finally {
            setProfilePictureLoading(false);
        }
    };

    const handleRequestConnection = async () => {
        try {
            await requestConnection(user.userId);
            setConnectionStatus('pending');
        } catch (err) {
            console.error('Failed to request connection:', err);
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

                console.log('Updating profile with data:', updatedData); // Debugging line

                await updateCurrentUserInfo(updatedData); // Call the API to update user info
                alert("Profile updated successfully!");
            } catch (err) {
                console.error('Failed to update profile:', err.response ? err.response.data : err.message); // Improved error logging
                alert("Failed to update profile: " + err.message);
            }
        }
    };

    const handleAddExperience = () => {
        setExperience([...experience, ""]); // Add an empty experience entry
    };

    const handleAddEducation = () => {
        setEducation([...education, ""]); // Add an empty education entry
    };

    const handleAddSkill = () => {
        setSkills([...skills, ""]); // Add an empty skill entry
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const isOwnProfile = currentUser && user && currentUser.username === user.username;

    return (
        <Box>
            <Navbar />
            <Box sx={{ padding: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
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

                    {!isOwnProfile && (
                        <Box sx={{ mt: 2 }}>
                            {connectionStatus === 'not_connected' && (
                                <Button variant="contained" color="primary" onClick={handleRequestConnection}>
                                    Connect
                                </Button>
                            )}
                            {connectionStatus === 'pending' && (
                                <Button variant="contained" disabled>
                                    Pending
                                </Button>
                            )}
                            {connectionStatus === 'connected' && (
                                <Button variant="contained" color="secondary" onClick={handleSendMessage}>
                                    Message
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Bio</Typography>
                    {isOwnProfile ? (
                        <TextField
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            placeholder="Enter your bio"
                        />
                    ) : (
                        <Typography variant="body1">{bio}</Typography>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Experience</Typography>
                    {isOwnProfile ? (
                        <>
                            {experience.map((exp, index) => (
                                <TextField
                                    key={index}
                                    value={exp}
                                    onChange={(e) => handleExperienceChange(index, e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Add experience"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                            <Button onClick={handleAddExperience} startIcon={<AddIcon />}>Add Experience</Button>
                        </>
                    ) : (
                        <List>
                            {experience.map((exp, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={exp} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Education</Typography>
                    {isOwnProfile ? (
                        <>
                            {education.map((edu, index) => (
                                <TextField
                                    key={index}
                                    value={edu}
                                    onChange={(e) => handleEducationChange(index, e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Add education"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                            <Button onClick={handleAddEducation} startIcon={<AddIcon />}>Add Education</Button>
                        </>
                    ) : (
                        <List>
                            {education.map((edu, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={edu} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Skills</Typography>
                    {isOwnProfile ? (
                        <>
                            {skills.map((skill, index) => (
                                <TextField
                                    key={index}
                                    value={skill}
                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Add skill"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                            <Button onClick={handleAddSkill} startIcon={<AddIcon />}>Add Skill</Button>
                        </>
                    ) : (
                        <List>
                            {skills.map((skill, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={skill} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                {isOwnProfile && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Profile;
