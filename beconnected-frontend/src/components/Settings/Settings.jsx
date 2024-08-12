import React, { useState } from 'react';
import {
    Container, Typography, TextField, Button, Grid, Box, Alert, Snackbar
} from '@mui/material';
import { updateUsername, updateEmail, updatePassword } from '../../api/Api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Settings = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarType, setSnackbarType] = useState('success');
    const navigate = useNavigate();

    const handleUpdateUsername = async () => {
        try {
            const response = await updateUsername(username);
            setMessage(response);
            setSnackbarType('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setMessage(error.message);
            setSnackbarType('error');
            setOpenSnackbar(true);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            const response = await updateEmail(email);
            setMessage(response);
            setSnackbarType('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setMessage(error.message);
            setSnackbarType('error');
            setOpenSnackbar(true);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const response = await updatePassword(password);
            setMessage(response);
            setSnackbarType('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setMessage(error.message);
            setSnackbarType('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box mt={5}>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Settings</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateUsername}
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Update username
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateEmail}
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Update email
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdatePassword}
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Update password
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
};

export default Settings;
