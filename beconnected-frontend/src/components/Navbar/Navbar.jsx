import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
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
import { getCurrentUserInfo } from '../../api/Api';

const Navbar = () => {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getCurrentUserInfo();
                setUsername(response.data.username); // Set the username from the response data
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        navigate('/login');
        handleCloseUserMenu();
    };

    const handleProfileNavigation = () => {
        navigate(`/profile/${username}`); // Navigate to the user's profile using their username
        handleCloseUserMenu();
    };

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'transparent',
                boxShadow: 'none',
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
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: '#004aad',
                            textDecoration: 'none',
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                            lineHeight: '1.2',
                        }}
                    >
                        Be
                        <LinkIcon
                            sx={{
                                ml: 0.5,
                                mr: 0.5,
                                verticalAlign: 'baseline',
                                position: 'relative',
                                fontSize: { xs: '1.2rem', md: '1.8rem' },
                                top: '0.1em',
                                color: '#ad004a',
                            }}
                        />
                        Connected
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center' }}>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
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
                                '&:hover': { color: 'black' },
                            }}
                        >
                            <HomeIcon sx={{ mb: 0.5, color: 'inherit', fontSize: '1.5rem' }} />
                            Feed
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
                                '&:hover': { color: 'black' },
                            }}
                        >
                            <PeopleIcon sx={{ mb: 0.5, color: 'inherit', fontSize: '1.5rem' }} />
                            Network
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
                                '&:hover': { color: 'black' },
                            }}
                        >
                            <MessageIcon sx={{ mb: 0.5, color: 'inherit', fontSize: '1.5rem' }} />
                            Messages
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
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

                {/* Menu items on a separate line for small screens */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 1 }}>
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
                            '&:hover': { color: 'black' },
                        }}
                    >
                        <HomeIcon sx={{ mb: 0.5, color: 'inherit', fontSize: '1.2rem' }} />
                        Feed
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
                            '&:hover': { color: 'black' },
                        }}
                    >
                        <PeopleIcon sx={{ mb: 0.5, color: 'inherit', fontSize: '1.2rem' }} />
                        Network
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
                            '&:hover': { color: 'black' },
                        }}
                    >
                        <MessageIcon sx={{ mb: 0.5, color: 'inherit', fontSize: '1.2rem' }} />
                        Messages
                    </Button>
                </Box>
            </Container>
        </AppBar>
    );
};

export default Navbar;
