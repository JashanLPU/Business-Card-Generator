import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthPage from './components/Auth/AuthPage';
import LandingPage from './components/Home/LandingPage'; 
import HomePage from './components/Home/HomePage';
import ViewCard from './components/Home/ViewCard';
import ContactPage from './components/Home/ContactPage'; // NEW

const App = () => {
    return (
        <Router>
            <div className="app-content">
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/about" element={<LandingPage />} />
                    <Route path="/contact" element={<ContactPage />} /> {/* NEW ROUTE */}
                    <Route path="/dashboard" element={<HomePage />} />
                    <Route path="/view/:id" element={<ViewCard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;