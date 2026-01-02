import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import AuthPage from './components/Auth/AuthPage';
import LandingPage from './components/Home/LandingPage'; 
import HomePage from './components/Home/HomePage';
import ViewCard from './components/Home/ViewCard';
import ContactPage from './components/Home/ContactPage'; 
import Subscription from './components/Home/Subscription'; 

// --- PROTECTED ROUTE COMPONENT ---
// This checks if the user is logged in. 
// If NOT, it redirects to /auth immediately.
const PrivateRoute = ({ children }) => {
    const userId = localStorage.getItem("userId");
    // If no user ID, or it says "undefined", kick them to login
    if (!userId || userId === "undefined") {
        return <Navigate to="/auth" replace />;
    }
    // Otherwise, show the page
    return children;
};

const App = () => {
    return (
        <Router>
            <div className="app-content">
                <Routes>
                    {/* Public Routes (Accessible by anyone) */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/about" element={<LandingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Protected Routes (Requires Login) */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        } 
                    />
                    
                    <Route 
                        path="/subscription" 
                        element={
                            <PrivateRoute>
                                <Subscription />
                            </PrivateRoute>
                        } 
                    />
                    
                    {/* Public Card View (Must be public so others can scan QR codes) */}
                    <Route path="/view/:id" element={<ViewCard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;