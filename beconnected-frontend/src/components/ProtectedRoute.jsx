// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
    const isAuthenticated = !!sessionStorage.getItem('access_token');

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
