import React from 'react';
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
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';

const Navbar = () => {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        BeConnected
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem component={Link} to="/feed" onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" sx={{ color: 'grey', '&:hover': { color: 'black' } }}>Feed</Typography>
                            </MenuItem>
                            <MenuItem component={Link} to="/network" onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" sx={{ color: 'grey', '&:hover': { color: 'black' } }}>Network</Typography>
                            </MenuItem>
                            <MenuItem component={Link} to="/messages" onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" sx={{ color: 'grey', '&:hover': { color: 'black' } }}>Messages</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/feed"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        Beconnected
                    </Typography>

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
                            <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
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
            </Container>
        </AppBar>
    );
};

export default Navbar;
