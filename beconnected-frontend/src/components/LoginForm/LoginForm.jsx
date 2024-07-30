import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/Api';
import './loginform.css';

const LoginForm = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(usernameOrEmail, password);
            console.log(response.data);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            navigate('/feed');
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid username/email or password'); // Updated error message
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Sign in</h2>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Username or Email:</label>
                    <input
                        type="text"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
