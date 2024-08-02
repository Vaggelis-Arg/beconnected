import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfoByUsername } from "../../api/Api";

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserInfoByUsername(username);
                setUser(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="profile-page">
            <h1>{user.username}'s Profile</h1>
            <img
                src={user.profilePicture || "../../assets/default-profile.jpg"}
                alt={`${user.username}'s profile`}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Profile;