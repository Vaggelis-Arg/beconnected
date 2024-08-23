import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import FeedPage from './components/FeedPage/FeedPage';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from "./components/WelcomePage/WelcomePage";
import Network from "./components/Network/Network";
import Profile from "./components/Profile/Profile";
import ChatPage from "./components/Message/ChatPage";
import Settings from "./components/Settings/Settings";
import Connections from "./components/ConnectionsPage/Connnections";
import Notifications from "./components/NotificationsPage/Notifications";
import Jobs from "./components/JobsPage/Jobs";
import Admin from "./components/AdminPage/Admin";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
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
                            <Network />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        <ProtectedRoute>
                            <Profile />
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
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username/connections"
                    element={
                        <ProtectedRoute>
                            <Connections />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
