import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import { logout } from "../../api/Api";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
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
                        to="/admin"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#0a66c2',
                            textDecoration: 'none',
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
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
                                    fontSize: { md: '1.8rem' },
                                    color: 'white',
                                }}
                            />
                        </Box>
                        Connected
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="text"
                        onClick={handleLogout}
                        sx={{
                            my: 1,
                            mx: 1,
                            color: 'black',
                            fontSize: '1rem',
                            textTransform: 'none',
                            '&:hover': { color: 'black' },
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
