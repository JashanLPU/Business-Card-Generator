import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from "../../config/api";
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            axios.get(`${API}/get-user/${userId}`)
                .then(res => { if (res.data.status === 'ok') setUser(res.data.user); })
                .catch(err => console.error(err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'; 
    };

    return (
        <nav className="navbar">
            <div className="nav-logo" onClick={() => navigate('/')}>VizCard 3D</div>
            
            <div className="nav-links">
                <NavLink to="/" className="nav-link-item">Home</NavLink>
                {user && <NavLink to="/dashboard" className="nav-link-item">Dashboard</NavLink>}
                <NavLink to="/contact" className="nav-link-item">Contact</NavLink>

                {user ? (
                    <div className="user-menu-container">
                        <div className="user-name-btn">
                            👤 {user.name} {user.isMember && <span>👑</span>}
                        </div>
                        
                        <div className="user-dropdown">
                            <div className="dropdown-item">
                                <span>Status:</span>
                                <span style={{color: user.isMember ? '#FFD700' : '#aaa'}}>
                                    {user.isMember ? "Pro" : "Free"}
                                </span>
                            </div>
                            {!user.isMember && (
                                <button className="dropdown-btn" onClick={() => navigate('/subscription')}>
                                    ⚡ Upgrade
                                </button>
                            )}
                            <button className="dropdown-btn logout-btn" onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                ) : (
                    <button className="dropdown-btn" onClick={() => navigate('/auth')}>Sign In</button>
                )}
            </div>
        </nav>
    );
};
export default Navbar;