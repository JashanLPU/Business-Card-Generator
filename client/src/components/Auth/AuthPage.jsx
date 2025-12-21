import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';
import videoBg from '../../background.mp4';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const API_URL = `http://${window.location.hostname}:5000`;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        const endpoint = type === 'register' ? '/register' : '/login';
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, formData);
            if (res.data.status === 'ok') {
                if (type === 'login') {
                    localStorage.setItem('userId', res.data.userId);
                    navigate('/dashboard');
                } else {
                    alert("Account Created! Please Login.");
                    setIsSignUp(false);
                }
            } else {
                alert("Error: " + (res.data.message || res.data.error));
            }
        } catch (err) { alert("Server Connection Failed."); }
    };

    return (
        <div className="auth-wrapper">
            <video className="auth-video" autoPlay muted loop playsInline>
                <source src={videoBg} type="video/mp4" />
            </video>

            {/* Main Container */}
            <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>
                
                {/* SIGN UP FORM */}
                <div className="form-container sign-up-container">
                    <form onSubmit={(e) => handleSubmit(e, 'register')}>
                        <h1>Create Account</h1>
                        <p className="social-text">Join the future of networking</p>
                        <input name="username" type="text" placeholder="Name" onChange={handleChange} required />
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                        <button className="auth-btn">Sign Up</button>
                    </form>
                </div>

                {/* SIGN IN FORM */}
                <div className="form-container sign-in-container">
                    <form onSubmit={(e) => handleSubmit(e, 'login')}>
                        <h1>Sign In</h1>
                        <p className="social-text">Welcome back to VizCard</p>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                        <button className="auth-btn">Sign In</button>
                    </form>
                </div>

                {/* SLIDING OVERLAY */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost-btn" onClick={() => setIsSignUp(false)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost-btn" onClick={() => setIsSignUp(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;