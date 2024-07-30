import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
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