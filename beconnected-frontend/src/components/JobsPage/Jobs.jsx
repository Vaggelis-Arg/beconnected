import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Avatar,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getJobsForUser, createJob, deleteJob, applyForJob, removeApplication, getProfilePicture, getCurrentUserInfo } from '../../api/Api';
import Navbar from '../Navbar/Navbar';
import defaultProfile from '../../assets/default-profile.png';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobDescription, setNewJobDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingPictures, setLoadingPictures] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const [allJobs, currentUser] = await Promise.all([
                    getJobsForUser(),
                    getCurrentUserInfo()
                ]);

                setJobs(allJobs);
                setCurrentUserId(currentUser.data.userId);

                allJobs.forEach(job => {
                    if (!profilePictures[job.userMadeBy.userId]) {
                        fetchProfilePicture(job.userMadeBy.userId);
                    }
                });
            } catch (err) {
                console.error('Failed to fetch jobs:', err.message || err);
                setError('Failed to load jobs.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [profilePictures]);

    const fetchProfilePicture = async (userId) => {
        setLoadingPictures(prev => ({ ...prev, [userId]: true }));
        try {
            const pictureData = await getProfilePicture(userId);
            const pictureUrl = URL.createObjectURL(new Blob([pictureData]));
            setProfilePictures(prev => ({ ...prev, [userId]: pictureUrl }));
        } catch (err) {
            console.error('Failed to get profile picture:', err);
            setProfilePictures(prev => ({ ...prev, [userId]: defaultProfile }));
        } finally {
            setLoadingPictures(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleCreateJob = async () => {
        if (!newJobTitle.trim() || !newJobDescription.trim()) return;

        try {
            await createJob(newJobTitle, newJobDescription);
            setNewJobTitle('');
            setNewJobDescription('');
            const allJobs = await getJobsForUser();
            setJobs(allJobs);
        } catch (err) {
            console.error('Failed to create job:', err.message || err);
            setError('Failed to create job.');
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await deleteJob(jobId);
            setJobs(jobs.filter(job => job.jobId !== jobId));
        } catch (err) {
            console.error('Failed to delete job:', err.message || err);
            setError('Failed to delete job.');
        }
    };

    const handleApplyForJob = async (jobId) => {
        try {
            await applyForJob(jobId);
            const updatedJobs = jobs.map(job =>
                job.jobId === jobId ? { ...job, applicants: [...job.applicants, { userId: currentUserId }] } : job
            );
            setJobs(updatedJobs);
        } catch (err) {
            console.error('Failed to apply for job:', err.message || err);
            setError('Failed to apply for job.');
        }
    };

    const handleRemoveApplication = async (jobId) => {
        try {
            await removeApplication(jobId);
            const updatedJobs = jobs.map(job =>
                job.jobId === jobId ? { ...job, applicants: job.applicants.filter(applicant => applicant.userId !== currentUserId) } : job
            );
            setJobs(updatedJobs);
        } catch (err) {
            console.error('Failed to remove application:', err.message || err);
            setError('Failed to remove application.');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f3f6f8', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                            <Card sx={{ p: 2 }}>
                                <Typography variant="h5" gutterBottom>
                                    Create a New Job
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    variant="outlined"
                                    value={newJobTitle}
                                    onChange={(e) => setNewJobTitle(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Job Description"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={newJobDescription}
                                    onChange={(e) => setNewJobDescription(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ fontSize: '1rem', textTransform: 'none', borderRadius: '30px' }}
                                    onClick={handleCreateJob}
                                >
                                    <AddIcon />
                                    Create Job
                                </Button>
                            </Card>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            All Jobs
                        </Typography>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Typography color="error" align="center">{error}</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {jobs.length === 0 ? (
                                    <Typography variant="body1" align="center">
                                        No jobs available.
                                    </Typography>
                                ) : (
                                    jobs.map((job) => (
                                        <Grid item xs={12} md={6} key={job.jobId}>
                                            <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '250px' }}>
                                                <CardHeader
                                                    title={job.title}
                                                    subheader={`Created by: ${job.userMadeBy.username} | ${new Date(job.createdAt).toLocaleDateString()}`}
                                                    avatar={
                                                        <Avatar
                                                            src={profilePictures[job.userMadeBy.userId] || defaultProfile}
                                                            alt={`${job.userMadeBy.username}'s profile`}
                                                            sx={{ width: 60, height: 60 }}
                                                        >
                                                            {loadingPictures[job.userMadeBy.userId] && <CircularProgress size={24} />}
                                                        </Avatar>
                                                    }
                                                />
                                                <CardContent>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {job.description}
                                                    </Typography>
                                                </CardContent>
                                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Applicants: {job.applicants.length}
                                                    </Typography>
                                                    {job.userMadeBy.userId !== currentUserId && (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            sx={{ fontSize: '1rem', textTransform: 'none', borderRadius: '30px', ml: 'auto' }}
                                                            onClick={() =>
                                                                job.applicants.some(applicant => applicant.userId === currentUserId)
                                                                    ? handleRemoveApplication(job.jobId)
                                                                    : handleApplyForJob(job.jobId)
                                                            }
                                                        >
                                                            {job.applicants.some(applicant => applicant.userId === currentUserId)
                                                                ? ''
                                                                : <AddIcon />}
                                                            {job.applicants.some(applicant => applicant.userId === currentUserId)
                                                                ? 'Remove application'
                                                                : 'Apply'}
                                                        </Button>
                                                    )}
                                                </Box>
                                                {job.userMadeBy.userId === currentUserId && (
                                                    <IconButton
                                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                                        onClick={() => handleDeleteJob(job.jobId)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Card>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default JobsPage;
