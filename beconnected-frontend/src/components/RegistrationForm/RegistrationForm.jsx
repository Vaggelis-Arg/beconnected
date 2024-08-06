import React, {useState} from 'react';
import {useNavigate, Link as RouterLink} from "react-router-dom";
import {register} from '../../api/Api';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) errors.username = "Username is required";
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Email is not valid";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";
        if (!/^\d+$/.test(formData.phone)) errors.phone = "Phone number is not valid";
        if (!formData.password.trim()) errors.password = "Password is required";
        if (formData.password.length < 6) errors.password = "Password must be at least 6 characters long";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await register(formData);
            if (response.data.message === "Username or Email already exists") {
                setMessage("User already registered");
            } else {
                setMessage("Registration successful!");
                sessionStorage.setItem('user_id', response.data.user_id);
                sessionStorage.setItem('access_token', response.data.access_token);
                navigate('/feed');
            }
        } catch (error) {
            if (error.response && error.response.data.message === "Username or Email already exists") {
                setMessage("User already registered");
            } else {
                console.error('Registration failed', error);
                setMessage('Registration failed. Please try again.');
            }
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
                    Expand Your Professional Network
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!formErrors.username}
                                helperText={formErrors.username}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!formErrors.firstName}
                                helperText={formErrors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!formErrors.lastName}
                                helperText={formErrors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="phone"
                                label="Phone Number"
                                name="phone"
                                autoComplete="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!formErrors.phone}
                                helperText={formErrors.phone}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!formErrors.password}
                                helperText={formErrors.password}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                autoComplete="confirm-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!formErrors.confirmPassword}
                                helperText={formErrors.confirmPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
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
                        Register
                    </Button>
                    {message && (
                        <Typography variant="body2" color="error" align="center">
                            {message}
                        </Typography>
                    )}
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Typography variant="body1" sx={{textAlign: 'center', mt: 1}}>
                                Already on BeConnected?
                                <Link
                                    component={RouterLink}
                                    to="/login"
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
                                    Sign in
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default RegistrationForm;
