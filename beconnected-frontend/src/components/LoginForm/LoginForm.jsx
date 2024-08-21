import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getUserInfoById, login} from '../../api/Api';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LinkIcon from '@mui/icons-material/Link';
import {Link as RouterLink} from "react-router-dom";

const LoginForm = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(usernameOrEmail, password);
            const userId = response.data.user_id;
            sessionStorage.setItem('user_id', userId);
            sessionStorage.setItem('access_token', response.data.access_token);
            sessionStorage.setItem('refresh_token', response.data.refresh_token);

            const userResponse = await getUserInfoById(userId);
            const user = userResponse.data; // Assuming the API returns user data under 'data'

            if (user.userRole === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/feed');
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('Wrong username/email or password, please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <AppBar
                position="static"
                sx={{
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    alignItems: 'center'
                }}
            >
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#0a66c2',
                            textDecoration: 'none',
                            fontSize: {xs: '1.2rem', md: '1.5rem'},
                            lineHeight: '1.2',
                        }}
                    >
                        Be
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '20%',
                                bgcolor: '#0a66c2',
                                width: '2.5rem',
                                height: '2.5rem',
                                mr: 0.5,
                                ml: 0.5,
                            }}
                        >
                            <LinkIcon
                                sx={{
                                    fontSize: {md: '1.8rem'},
                                    color: 'white',
                                }}
                            />
                        </Box>
                        Connected
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign In and Elevate Your Network
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="usernameOrEmail"
                        label="Username or Email"
                        name="usernameOrEmail"
                        autoComplete="username"
                        autoFocus
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#0a66c2',
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderRadius: '30px',
                            '&:hover': {
                                backgroundColor: '#004182',
                            }
                        }}
                    >
                        Login
                    </Button>
                    {error && (
                        <Typography variant="body2" color="error" align="center">
                            {error}
                        </Typography>
                    )}
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Typography variant="body1" sx={{textAlign: 'center', mt: 1}}>
                                Don't have an account?
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    style={{
                                        color: '#0a66c2',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        transition: 'color 0.3s, text-decoration 0.3s',
                                        marginLeft: '0.3rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#004182';
                                        e.target.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '#0a66c2';
                                        e.target.style.textDecoration = 'none';
                                    }}
                                >
                                    Join now
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
