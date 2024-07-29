import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const Homepage = () => {
    return (
        <div className="homepage-container">
            <h1>Welcome to Be Connected</h1>
            <p>Join us to explore more opportunities and connect with professionals.</p>
            <div className="button-group">
                <Link to="/login" className="button-link">
                    Login
                </Link>
                <Link to="/register" className="button-link">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Homepage;
