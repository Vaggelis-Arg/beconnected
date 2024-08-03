import axios from 'axios';

export const API_URL = 'http://localhost:8080';

export const login = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {usernameOrEmail, password});
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
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

export const getFeed = async () => {
    const token = localStorage.getItem('access_token');
    try {
        return await axios.get(`${API_URL}/feed`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Failed to fetch feed:', error);
        throw error;
    }
};


export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
}

export const getAccessToken = () => {
    return localStorage.getItem('access_token');
}


export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
        const response = await axios.post(`${API_URL}/refresh_token`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });

        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
        }
        return response.data.access_token;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

export const getCurrentUserInfo = async () => {
    const token = localStorage.getItem('access_token');
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
    const token = localStorage.getItem('access_token');
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
    const token = localStorage.getItem('access_token');
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


export const getConnections = async () => {
    const {data: user} = await getCurrentUserInfo();
    const token = localStorage.getItem('access_token');
    if (!token || !user?.userId) {
        throw new Error('User ID not found');
    }
    try {
        return await axios.get(`${API_URL}/users/${user.userId}/connections`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Failed to fetch mutual followers:', error);
        throw error;
    }
};

export const searchUsers = async (query) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.get(`${API_URL}/users/search`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                query: query
            }
        });
        return response;
    } catch (error) {
        console.error('Failed to search users:', error);
        throw error;
    }
};
