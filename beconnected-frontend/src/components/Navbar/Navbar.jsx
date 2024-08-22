import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';
import NotificationIcon from '@mui/icons-material/Notifications';
import JobIcon from '@mui/icons-material/Work';
import { getCurrentUserInfo, getProfilePicture, logout } from '../../api/Api';
import defaultProfile from '../../assets/default-profile.png'; // Add a default profile picture

const Navbar = () => {
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(defaultProfile); // Default profile picture

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getCurrentUserInfo();
                setUsername(response.data.username);

                // Fetch profile picture
                if (response.data.userId) {
                    try {
                        const pictureData = await getProfilePicture(response.data.userId);
                        const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
                        setProfilePicture(pictureUrl);
                    } catch (err) {
                        // If there is an error, use the default profile picture
                        console.error('Failed to get profile picture:', err);
                        setProfilePicture(defaultProfile);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();

        return () => {
            URL.revokeObjectURL(profilePicture); // Clean up URL object
        };
    }, [profilePicture]);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
        handleCloseUserMenu();
    };

    const handleProfileNavigation = () => {
        navigate(`/profile/${username}`);
        handleCloseUserMenu();
    };

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'white',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/feed"
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

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, justifyContent: 'center'}}>
                        <Button
                            component={Link}
                            to="/feed"
                            sx={{
                                my: 1,
                                mx: 1,
                                color: 'grey',
                                fontSize: '0.8rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textTransform: 'none',
                                '&:hover': {color: 'black'},
                            }}
                        >
                            <HomeIcon sx={{color: 'inherit', fontSize: '1.5rem'}}/>
                            Home
                        </Button>
                        <Button
                            component={Link}
                            to="/network"
                            sx={{
                                my: 1,
                                mx: 1,
                                color: 'grey',
                                fontSize: '0.8rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textTransform: 'none',
                                '&:hover': {color: 'black'},
                            }}
                        >
                            <PeopleIcon sx={{color: 'inherit', fontSize: '1.5rem'}}/>
                            Network
                        </Button>
                        <Button
                            component={Link}
                            to="/jobs"
                            sx={{
                                my: 1,
                                mx: 1,
                                color: 'grey',
                                fontSize: '0.8rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textTransform: 'none',
                                '&:hover': {color: 'black'},
                            }}
                        >
                            <JobIcon sx={{color: 'inherit', fontSize: '1.5rem'}}/>
                            Jobs
                        </Button>
                        <Button
                            component={Link}
                            to="/messages"
                            sx={{
                                my: 1,
                                mx: 1,
                                color: 'grey',
                                fontSize: '0.8rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textTransform: 'none',
                                '&:hover': {color: 'black'},
                            }}
                        >
                            <MessageIcon sx={{color: 'inherit', fontSize: '1.5rem'}}/>
                            Messages
                        </Button>
                        <Button
                            component={Link}
                            to="/notifications"
                            sx={{
                                my: 1,
                                mx: 1,
                                color: 'grey',
                                fontSize: '0.8rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textTransform: 'none',
                                '&:hover': {color: 'black'},
                            }}
                        >
                            <NotificationIcon sx={{color: 'inherit', fontSize: '1.5rem'}}/>
                            Notifications
                        </Button>
                    </Box>

                    <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center', ml: 'auto'}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar src={profilePicture} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleProfileNavigation}>
                                <Typography textAlign="center">Profile</Typography>
                            </MenuItem>
                            <MenuItem component={Link} to="/settings" onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Settings</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>

                <Box sx={{display: {xs: 'flex', md: 'none'}, justifyContent: 'center', mt: 1}}>
                    <Button
                        component={Link}
                        to="/feed"
                        sx={{
                            mx: 1,
                            color: 'grey',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textTransform: 'none',
                            '&:hover': {color: 'black'},
                        }}
                    >
                        <HomeIcon sx={{color: 'inherit', fontSize: '1.2rem'}}/>
                        Home
                    </Button>
                    <Button
                        component={Link}
                        to="/network"
                        sx={{
                            mx: 1,
                            color: 'grey',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textTransform: 'none',
                            '&:hover': {color: 'black'},
                        }}
                    >
                        <PeopleIcon sx={{color: 'inherit', fontSize: '1.2rem'}}/>
                        Network
                    </Button>
                    <Button
                        component={Link}
                        to="/jobs"
                        sx={{
                            mx: 1,
                            color: 'grey',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textTransform: 'none',
                            '&:hover': {color: 'black'},
                        }}
                    >
                        <JobIcon sx={{color: 'inherit', fontSize: '1.2rem'}}/>
                        Jobs
                    </Button>
                    <Button
                        component={Link}
                        to="/messages"
                        sx={{
                            mx: 1,
                            color: 'grey',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textTransform: 'none',
                            '&:hover': {color: 'black'},
                        }}
                    >
                        <MessageIcon sx={{color: 'inherit', fontSize: '1.2rem'}}/>
                        Messages
                    </Button>
                    <Button
                        component={Link}
                        to="/notifications"
                        sx={{
                            mx: 1,
                            color: 'grey',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textTransform: 'none',
                            '&:hover': {color: 'black'},
                        }}
                    >
                        <NotificationIcon sx={{color: 'inherit', fontSize: '1.2rem'}}/>
                        Notifications
                    </Button>
                </Box>
            </Container>
        </AppBar>
    );
};

export default Navbar;
