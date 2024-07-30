// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Use Navigate and Outlet

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to={redirectPath} replace />;
    }

    // Render the protected component
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
