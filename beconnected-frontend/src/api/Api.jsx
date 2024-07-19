import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const login = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password} );
};


export const register = (formData) => {
    return axios.post(`${API_URL}/register`, formData );
};