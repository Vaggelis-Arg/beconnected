import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Avatar, CircularProgress, IconButton, Input } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
    getUserInfoByUsername,
    updateProfilePicture,
    deleteProfilePicture,
    getCurrentUserInfo,
    getProfilePicture
} from "../../api/Api";
import defaultProfile from "../../assets/default-profile.png";
import Navbar from "../Navbar/Navbar";  // Assuming you have a Navbar component

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePictureLoading, setProfilePictureLoading] = useState(false);
    const [profilePictureError, setProfilePictureError] = useState(null);
    const [profilePicture, setProfilePicture] = useState(defaultProfile);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserInfoByUsername(username);
                setUser(response.data);

                if (response.data.profilePicture) {
                    const pictureData = await getProfilePicture();
                    const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
                    setProfilePicture(pictureUrl);
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

        // Cleanup URL object on component unmount to avoid memory leaks
        return () => {
            URL.revokeObjectURL(profilePicture);
        };
    }, [username, profilePicture]);

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

                const pictureData = await getProfilePicture();
                const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
                setProfilePicture(pictureUrl);
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
            setProfilePicture(defaultProfile);
        } catch (err) {
            setProfilePictureError(err.message);
        } finally {
            setProfilePictureLoading(false);
        }
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
                </Box>
            </Box>
        </Box>
    );
};

export default Profile;
