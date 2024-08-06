import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LinkIcon from '@mui/icons-material/Link';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArticleIcon from '@mui/icons-material/Article';
import StarRateIcon from '@mui/icons-material/StarRate';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const Homepage = () => {
    return (
        <div style={{backgroundColor: 'white', minHeight: '100vh'}}>
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
                        <Box sx={{flexGrow: 1}}/>
                        <Button
                            component={Link}
                            to="/register"
                            sx={{
                                color: '#333333',
                                fontWeight: 'bold',
                                mr: 2,
                                textTransform: 'none',
                                borderRadius: '30px',
                                padding: '10px 20px',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            Join now
                        </Button>
                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            sx={{
                                color: '#0a66c2',
                                fontWeight: 'bold',
                                borderColor: '#0a66c2',
                                textTransform: 'none',
                                borderRadius: '30px',
                                padding: '10px 20px',
                                fontSize: '0.875rem',
                                '&:hover': {
                                    bgcolor: '#0a66c2',
                                    color: 'white',
                                },
                            }}
                        >
                            Sign in
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{mt: 4, alignItems: 'center', justifyContent: 'center'}}>
                    <Grid item xs={12} md={6} sx={{textAlign: 'center'}}>
                        <Typography variant="h3" gutterBottom sx={{color: '#c20a0a'}}>
                            Welcome to BeConnected
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Join us to explore more opportunities and connect with professionals.
                        </Typography>
                        <Box sx={{mt: 3}}>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '30px',
                                    fontSize: '1rem',
                                    padding: '10px 24px',
                                    color: '#333333',
                                    fontWeight: 'bold',
                                    borderColor: 'black',
                                    mb: 3
                                }}
                            >
                                Sign in with email or username
                            </Button>
                            <Typography variant="body2" sx={{mb: 3, textAlign: 'center'}}>
                                By clicking Continue to join or sign in, you agree to BeConnected’s
                                <Link to="#" style={{color: '#0a66c2', textDecoration: 'none'}}> User Agreement</Link>,
                                <Link to="#" style={{color: '#0a66c2', textDecoration: 'none'}}> Privacy Policy</Link>,
                                and
                                <Link to="#" style={{color: '#0a66c2', textDecoration: 'none'}}> Cookie Policy</Link>.
                            </Typography>
                            <Typography variant="body1" sx={{textAlign: 'center', mt: 1}}>
                                New to BeConnected?
                                <Link
                                    to="/register"
                                    style={{
                                        color: '#0a66c2',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        transition: 'color 0.3s, text-decoration 0.3s',
                                        marginLeft: '0.3rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#0a66c2';
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
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Container maxWidth="lg">
                <Box sx={{mt: 8}}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Discover What We Offer
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{textAlign: 'center', p: 3, border: '1px solid #ddd', borderRadius: '10px'}}>
                                <AccessTimeIcon sx={{fontSize: 40, color: '#0a66c2'}}/>
                                <Typography variant="h6" gutterBottom>
                                    <strong>Time Efficiency</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Streamline your networking with our intuitive tools that save you time and effort.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{textAlign: 'center', p: 3, border: '1px solid #ddd', borderRadius: '10px'}}>
                                <PeopleAltIcon sx={{fontSize: 40, color: '#0a66c2'}}/>
                                <Typography variant="h6" gutterBottom>
                                    <strong>Build Your Network</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Connect with professionals, industry leaders, and peers to grow your network.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{textAlign: 'center', p: 3, border: '1px solid #ddd', borderRadius: '10px'}}>
                                <ArticleIcon sx={{fontSize: 40, color: '#0a66c2'}}/>
                                <Typography variant="h6" gutterBottom>
                                    <strong>Latest Insights</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Access articles, trends, and updates tailored to your professional interests.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Container maxWidth="lg">
                <Box sx={{mt: 8, textAlign: 'center'}}>
                    <Typography variant="h4" gutterBottom>
                        What Our Users Say
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{p: 3, border: '1px solid #ddd', borderRadius: '10px'}}>
                                <FormatQuoteIcon sx={{fontSize: 50, color: '#0a66c2'}}/>
                                <Typography variant="body1" gutterBottom>
                                    "BeConnected has transformed how I network. It's simple, effective, and invaluable."
                                </Typography>
                                <Typography variant="body2">
                                    - Alex R., Marketing Specialist
                                </Typography>
                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{p: 3, border: '1px solid #ddd', borderRadius: '10px'}}>
                                <FormatQuoteIcon sx={{fontSize: 50, color: '#0a66c2'}}/>
                                <Typography variant="body1" gutterBottom>
                                    "The platform's insights and networking opportunities are second to none."
                                </Typography>
                                <Typography variant="body2">
                                    - Jessica L., Software Engineer
                                </Typography>
                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                    <StarRateIcon sx={{color: '#fbc02d'}}/>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Box sx={{mt: 8, bgcolor: '#0a66c2', color: 'white', p: 4}}>
                <Container maxWidth="lg" textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Join our community today and start connecting with professionals in your industry.
                    </Typography>
                    <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        sx={{
                            bgcolor: 'white',
                            color: '#0a66c2',
                            textTransform: 'none',
                            borderRadius: '30px',
                            padding: '10px 24px',
                            fontWeight: 'bold',
                            '&:hover': {bgcolor: '#e0e0e0'}
                        }}
                    >
                        Join now
                    </Button>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'transparent', p: 4, mt: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                About Us
                            </Typography>
                            <Typography variant="body2">
                                Learn more about our mission and values.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Quick Links
                            </Typography>
                            <Typography variant="body2">
                                <Link to="/about" style={{ textDecoration: 'none', color: '#0a66c2' }}>About</Link><br />
                                <Link to="/contact" style={{ textDecoration: 'none', color: '#0a66c2' }}>Contact</Link><br />
                                <Link to="/terms" style={{ textDecoration: 'none', color: '#0a66c2' }}>Terms of Service</Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Meet the Creators
                            </Typography>
                            <Typography variant="body2">
                                <strong>Evangelos Argyropoulos</strong><br />
                                <strong>Dimitris Boutzounis</strong><br />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                Follow Us
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link to="#" style={{ color: '#0a66c2' }}><FacebookIcon /></Link>
                                <Link to="#" style={{ color: '#0a66c2' }}><TwitterIcon /></Link>
                                <Link to="#" style={{ color: '#0a66c2' }}><InstagramIcon /></Link>
                                <Link to="#" style={{ color: '#0a66c2' }}><GitHubIcon /></Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default Homepage;
