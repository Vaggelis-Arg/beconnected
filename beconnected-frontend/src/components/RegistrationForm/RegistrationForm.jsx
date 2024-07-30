import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { register } from '../../api/Api';
import './registrationform.css'

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData);
            if (response.data.message === "User already exists") {
                setMessage("User already registered");
            } else {
                setMessage("Registration successful!");
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/feed');
            }
        } catch (error) {
            console.error('Registration failed', error);
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="registration-container">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Expand Your Professional Network</h2>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required/>
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </div>
                <button type="submit">Register</button>
                {message && <p>{message}</p>}
                <div className="form-footer">
                    <p>
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
