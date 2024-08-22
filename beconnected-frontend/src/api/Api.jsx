import axios from 'axios';

export const API_URL = '/api';

export const login = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {usernameOrEmail, password});
        if (response.data.access_token) {
            sessionStorage.setItem('access_token', response.data.access_token);
            sessionStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return response;
    } catch (error) {
        console.error('Login failed', error);
        throw error;
    }
};

export const register = (formData) => {
    return axios.post(`${API_URL}/register`, formData);
};

export const logout = async () => {
    const accessToken = sessionStorage.getItem('access_token');

    try {
        await axios.post(`${API_URL}/logout`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');

        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed', error);
    }
};

export const refreshToken = async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');
    try {
        const response = await axios.post(`${API_URL}/refresh_token`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });

        if (response.data.access_token) {
            sessionStorage.setItem('access_token', response.data.access_token);
        }
        return response.data.access_token;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

export const getCurrentUserInfo = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        return await axios.get(`${API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw error;
    }
};

export const getUserInfoById = async (userId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
};

export const getUserInfoByUsername = async (username) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/users/username/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
};

export const updateUsername = async (newUsername) => {
    const token = sessionStorage.getItem('access_token');
    try {
        const response = await axios.put(`${API_URL}/users/me/username`, null, {
            params: {newUsername}, headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to update username');
    }
};

export const updateEmail = async (newEmail) => {
    const token = sessionStorage.getItem('access_token');
    try {
        const response = await axios.put(`${API_URL}/users/me/email`, null, {
            params: {newEmail}, headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to update email');
    }
};

export const updatePassword = async (newPassword) => {
    const token = sessionStorage.getItem('access_token');
    try {
        const response = await axios.put(`${API_URL}/users/me/password`, null, {
            params: {newPassword}, headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to update password');
    }
};

export const searchUsers = async (query) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/users/search`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }, params: {
                query: query
            }
        });
        return response;
    } catch (error) {
        console.error('Failed to search users:', error);
        throw error;
    }
};

export const sendMessage = async (receiverId, content) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/messages/send`, null, {
            params: {receiverId, content}, headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
    }
};

export const getConversation = async (userId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch conversation:', error);
        throw error;
    }
};

export const getChattedUsers = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/messages/chattedUsers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch sent messages:', error);
        throw error;
    }
};

export const updateCurrentUserInfo = async (updatedUser) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.put(`${API_URL}/users/me`, updatedUser, {
            headers: {
                Authorization: `Bearer ${token}`, 'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
    }
};

export const updateProfilePicture = async (file) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.put(`${API_URL}/users/me/profile-picture`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update profile picture:', error);
        throw error;
    }
};

export const getProfilePicture = async (userId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/users/${userId}/profile-picture`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }, responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get profile picture:', error);
        throw error;
    }
};

export const deleteProfilePicture = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.delete(`${API_URL}/users/me/profile-picture`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete profile picture:', error);
        throw error;
    }
};

export const requestConnection = async (requestedUserId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/connections/${requestedUserId}/request`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to request connection:', error);
        throw error;
    }
};

export const acceptConnection = async (requestingUserId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/connections/${requestingUserId}/accept`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to accept connection:', error);
        throw error;
    }
};

export const declineConnection = async (requestingUserId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/connections/${requestingUserId}/decline`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to decline connection:', error);
        throw error;
    }
};

export const getConnections = async (userId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/connections/${userId}/connections`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get connections:', error);
        throw error;
    }
};

export const getReceivedPendingRequests = async (userId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/connections/${userId}/received-pending-requests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get pending requests:', error);
        throw error;
    }
};

export const removeConnection = async (userId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/connections/${userId}/remove`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to remove connection:', error);
        throw error;
    }
};

export const createPost = async (textContent, mediaFile) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    const formData = new FormData();
    formData.append('textContent', textContent);
    if (mediaFile) {
        formData.append('mediaFile', mediaFile);
    }

    try {
        const response = await axios.post(`${API_URL}/feed/posts`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
};

export const getFeedForCurrentUser = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/feed/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch feed for current user:', error);
        throw error;
    }
};

export const addComment = async (postId, comment) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/feed/posts/${postId}/comments`, null, {
            params: {comment}, headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add comment:', error);
        throw error;
    }
};

export const likePost = async (postId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/feed/posts/${postId}/like`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to like post:', error);
        throw error;
    }
};

export const getCommentsByPost = async (postId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/feed/posts/${postId}/comments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        throw error;
    }
};

export const getLikesByPost = async (postId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/feed/posts/${postId}/likes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch likes:', error);
        throw error;
    }
};

export const getMediaPost = async (postId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/feed/posts/${postId}/media`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }, responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch media for post:', error);
        throw error;
    }
};

export const removeComment = async (postId, commentId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.delete(`${API_URL}/feed/posts/${postId}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to remove comment:', error);
        throw error;
    }
};

export const removeLike = async (postId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.delete(`${API_URL}/feed/posts/${postId}/like`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to remove like:', error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.delete(`${API_URL}/feed/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw error;
    }
};


export const getUserConnectionNotifications = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/notifications/connections`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch connection notifications:', error);
        throw error;
    }
};


export const getUserLikeAndCommentNotifications = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/notifications/likes-comments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch like and comment notifications:', error);
        throw error;
    }
};

export const createJob = async (title, description) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }
    try {
        const response = await axios.post(`${API_URL}/jobs`, null, {
            headers: { Authorization: `Bearer ${token}` },
            params: { title, description },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create job:', error);
        throw error;
    }
};

export const getJobsForUser = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }
    try {
        const response = await axios.get(`${API_URL}/jobs/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch jobs for user:', error);
        throw error;
    }
};

export const deleteJob = async (jobId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }
    try {
        await axios.delete(`${API_URL}/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Failed to delete job:', error);
        throw error;
    }
};

export const applyForJob = async (jobId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }
    try {
        await axios.post(`${API_URL}/jobs/${jobId}/apply`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Failed to apply for job:', error);
        throw error;
    }
};

export const removeApplication = async (jobId) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }
    try {
        await axios.delete(`${API_URL}/jobs/${jobId}/remove-application`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Failed to remove application:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
};

export const exportUsersDataByIds = async (userIds, format = 'json') => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(`${API_URL}/admin/users/export`, userIds, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { format },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `users.${format === 'json' ? 'json' : 'xml'}`);
        document.body.appendChild(link);
        link.click();

        return response.data;
    } catch (error) {
        console.error('Error exporting users data by IDs:', error);
        throw error;
    }
};



