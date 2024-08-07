import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getUserInfoByUsername,
    updateProfilePicture,
    deleteProfilePicture,
    getCurrentUserInfo,
    getProfilePicture
} from "../../api/Api";
import "./profile.css";
import defaultProfile from "../../assets/default-profile.png";

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
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

                // Fetch and set the profile picture
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

        fetchUser();


        return () => {
            URL.revokeObjectURL(profilePicture);
        };
    }, [username]);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    console.log(user);

    return (
        <div className="profile-page">
            <h1>{user.username}'s Profile</h1>
            <img
                src={profilePicture}
                alt={`${user.username}'s profile`}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <p>
                Name: {user.firstName} {user.lastName}
            </p>
            <p>Email: {user.email}</p>

            <div className="profile-picture-actions">
                <input type="file" onChange={handleProfilePictureChange} />
                <button onClick={handleProfilePictureDelete}>
                    Delete Profile Picture
                </button>
                {profilePictureLoading && <p>Updating profile picture...</p>}
                {profilePictureError && <p>Error: {profilePictureError}</p>}
            </div>
        </div>
    );
};

export default Profile;
