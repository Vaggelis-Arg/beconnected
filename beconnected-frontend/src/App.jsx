import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import FeedPage from './pages/FeedPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from "./pages/HomePage";
import NetworkPage from "./pages/NetworkPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import ConnectionsPage from "./pages/ConnectionsPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route
                    path="/feed"
                    element={
                        <ProtectedRoute>
                            <FeedPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/network"
                    element={
                        <ProtectedRoute>
                            <NetworkPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username/connections"
                    element={
                        <ProtectedRoute>
                            <ConnectionsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
