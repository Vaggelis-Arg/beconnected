import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfoByUsername, getConnections } from "../../api/Api";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText } from "@mui/material";

const ConnectionsPage = () => {
    const { username } = useParams();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const userInfoResponse = await getUserInfoByUsername(username);

                const connectionsResponse = await getConnections(userInfoResponse.data.userId);
                setConnections(connectionsResponse);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, [username]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5">{username}'s Connections</Typography>
            <List>
                {connections.map((connection) => (
                    <ListItem key={connection.userId}>
                        <ListItemText primary={`${connection.firstName} ${connection.lastName}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ConnectionsPage;
