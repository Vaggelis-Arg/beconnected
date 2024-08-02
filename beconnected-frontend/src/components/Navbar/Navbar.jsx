import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/feed" className="navbar-logo">
                    Beconnected
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/feed" className="navbar-link">
                    Feed
                </Link>
                <Link to="/network" className="navbar-link">
                    Network
                </Link>
            </div>
            <div className="navbar-actions">
                <button onClick={handleLogout} className="navbar-logout">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
