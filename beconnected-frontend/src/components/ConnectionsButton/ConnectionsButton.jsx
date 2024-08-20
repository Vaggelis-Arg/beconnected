import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getConnections } from "../../api/Api";

const ConnectionsButton = ({ currentUser, profileUser, connectionCount }) => {
    const navigate = useNavigate();
    const [isClickable, setIsClickable] = useState(false);

    useEffect(() => {
        const checkIfClickable = async () => {
            try {
                if (!currentUser || !profileUser) {
                    setIsClickable(false);
                    return;
                }

                const connections = await getConnections(currentUser.userId);

                setIsClickable(
                    currentUser.userId === profileUser.userId ||
                    connections.some(
                        (conn) => conn.userId === profileUser.userId
                    )
                );
            } catch (error) {
                console.error('Failed to check button clickability:', error);
                setIsClickable(false);
            }
        };

        checkIfClickable();
    }, [currentUser, profileUser]);

    const handleNavigate = () => {
        if (isClickable) {
            navigate(`/profile/${profileUser.username}/connections`);
        } else {
            alert("You do not have permission to view this user's connections.");
        }
    };

    return (
        <Button
            variant="text"
            color="primary"
            sx={{ textTransform: "none", mt: 2, fontSize: '1rem' }}
            onClick={handleNavigate}
            disabled={!isClickable}
        >
            {connectionCount} Connection{connectionCount !== 1 && 's'}
        </Button>
    );
};

export default ConnectionsButton;
