import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LinkIcon from '@mui/icons-material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Homepage = () => {
    return (
        <div>
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
                            to="/"
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
                        <Button component={Link} to="/register" sx={{ color: 'grey', mr: 2, textTransform: 'capitalize', borderRadius: '20px' }}>
                            Join now
                        </Button>
                        <Button component={Link} to="/login" variant="outlined" sx={{ color: '#0a66c2', borderColor: '#0a66c2', textTransform: 'capitalize', borderRadius: '20px' }}>
                            Sign in
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" gutterBottom>
                            Welcome to Be Connected
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Join us to explore more opportunities and connect with professionals.
                        </Typography>
                        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#0a66c2', textTransform: 'capitalize', borderRadius: '20px' }}>
                            Sign in
                        </Button>
                        <Typography variant="body1">
                            New to BeConnected? <Link to="/register" style={{ color: '#0a66c2', textDecoration: 'none' }}>Join now</Link>
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Explore
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Find articles, job postings, and much more.
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};

export default Homepage;
