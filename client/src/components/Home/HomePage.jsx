import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import './Global.css';
import './Dashboard.css';
import videoBg from '../../background.mp4';

const PREMADE_TEMPLATES = [
    { id: 1, name: 'Royal Gold', template: 'gradient', cardColor: '#D4AF37', textColor: '#FFFFFF' },
    { id: 2, name: 'Cyber Blue', template: 'cyber', cardColor: '#00F3FF', textColor: '#00F3FF' },
    { id: 3, name: 'Crimson Glass', template: 'glass', cardColor: '#DC143C', textColor: '#FFFFFF' },
    { id: 4, name: 'Hacker Green', template: 'cyber', cardColor: '#00FF41', textColor: '#00FF41' },
    { id: 5, name: 'Deep Ocean', template: 'gradient', cardColor: '#006994', textColor: '#FFFFFF' },
    { id: 6, name: 'Arctic Glass', template: 'glass', cardColor: '#E0FFFF', textColor: '#000000' },
    { id: 7, name: 'Ghost White', template: 'modern', cardColor: '#F8F8FF', textColor: '#111111' },
    { id: 8, name: 'Sunset Blvd', template: 'gradient', cardColor: '#FF4500', textColor: '#FFFFFF' },
    { id: 9, name: 'Obsidian Matte', template: 'modern', cardColor: '#121212', textColor: '#E0E0E0' },
    { id: 10, name: 'Midnight Steel', template: 'modern', cardColor: '#434B4D', textColor: '#FFFFFF' },
];

const HomePage = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [networkIP, setNetworkIP] = useState(window.location.hostname); // Default to current
    
    // Scroll Animation States
    const [showNav, setShowNav] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY.current && window.scrollY > 80) {
                    setShowNav(false);
                } else {
                    setShowNav(true);
                }
                lastScrollY.current = window.scrollY;
            }
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [sessionValid, setSessionValid] = useState(true);

    const [formData, setFormData] = useState({
        fullName: '', jobTitle: '', company: '', email: '', phone: '', website: '', template: 'modern', cardColor: '#111111', textColor: '#ffffff'
    });

    const API_URL = `http://${window.location.hostname}:5000`;

    // --- AUTO-DETECT NETWORK IP ---
    useEffect(() => {
        // Ask the backend for the real Wi-Fi IP address
        axios.get(`${API_URL}/get-network-ip`)
            .then(res => {
                if (res.data.ip) {
                    setNetworkIP(res.data.ip);
                    console.log("✅ Auto-Detected Network IP:", res.data.ip);
                }
            })
            .catch(err => console.log("Could not auto-detect IP, using localhost"));
            
        const userId = localStorage.getItem("userId");
        if (!userId || userId === "undefined") {
            setSessionValid(false);
            return;
        }
        setSessionValid(true);
        axios.get(`${API_URL}/get-cards/${userId}`)
            .then(res => { if(res.data.status === 'ok') setCards(res.data.cards); })
            .catch(err => console.error(err));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        try {
            const res = await axios.post(`${API_URL}/create-card`, { ...formData, userId });
            if (res.data.status === "ok") {
                window.location.reload();
            } else {
                alert("Server Error: " + res.data.message);
            }
        } catch (error) {
            alert("Network Error");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this card?")) {
            await axios.delete(`${API_URL}/delete-card/${id}`);
            window.location.reload();
        }
    };

    const getCardStyle = (template, color, textColor) => {
        let style = { color: textColor, borderColor: 'rgba(255,255,255,0.2)' };
        switch (template) {
            case 'modern': style.background = color; break;
            case 'glass': style.background = `${color}40`; style.backdropFilter = 'blur(12px)'; style.border = `1px solid ${color}88`; break;
            case 'cyber': style.background = '#050505'; style.border = `2px solid ${color}`; style.boxShadow = `0 0 15px ${color}, inset 0 0 10px ${color}22`; break;
            case 'gradient': style.background = `linear-gradient(135deg, ${color} 0%, #000000 100%)`; break;
            default: style.background = color;
        }
        return style;
    };

    const openShare = (card) => { setSelectedCard(card); setShowShareModal(true); };
    const selectTemplate = (tmpl) => { 
        setFormData({ ...formData, template: tmpl.template, cardColor: tmpl.cardColor, textColor: tmpl.textColor }); 
        setShowCreateModal(true); 
    };

    if (!sessionValid) return <div>Session Expired</div>;

    return (
        <div className="page-container">
            <video className="global-bg-video" autoPlay muted loop playsInline><source src={videoBg} type="video/mp4" /></video>
            
        
<nav className="navbar">
    <div className="nav-logo">VizCard 3D</div>
    <div className="nav-links">
        <NavLink to="/about" className="nav-link-item">About</NavLink>
        <NavLink to="/dashboard" className="nav-link-item active">Dashboard</NavLink>
        <NavLink to="/contact" className="nav-link-item">Contact</NavLink> {/* NEW */}
        <button className="action-btn" onClick={() => { localStorage.clear(); navigate('/'); }}>Log Out</button>
    </div>
</nav>


            <div className="dashboard-header">
                <h1 className="dash-title">Design Studio</h1>
                <p className="dash-subtitle">Select a template to mint your identity.</p>
            </div>

            <div className="glass-section-container">
                <h2 className="section-label">✦ Select a Template</h2>
                <div className="template-grid-display">
                    {PREMADE_TEMPLATES.map((tmpl) => (
                        <div key={tmpl.id} className="template-preview-card" onClick={() => selectTemplate(tmpl)} style={getCardStyle(tmpl.template, tmpl.cardColor, tmpl.textColor)}>
                            <div className="card-top"><div className="chip"></div><span className="card-company" style={{color: tmpl.textColor}}>VIZCARD</span></div>
                            <div className="card-body"><h3 style={{color: tmpl.textColor}}>{tmpl.name}</h3><p className="job-title" style={{color: tmpl.textColor, margin:0, opacity: 0.8}}>{tmpl.template.toUpperCase()}</p></div>
                        </div>
                    ))}
                </div>
            </div>

            {cards.length > 0 && (
                <div id="my-stack" className="glass-section-container">
                    <h2 className="section-label">✦ My Identity Stack</h2>
                    <div className="card-grid">
                        {cards.map((card) => (
                            <div className="viz-card" key={card._id} style={getCardStyle(card.template, card.cardColor, card.textColor)}>
                                <div className="card-top"><div className="chip"></div><span className="card-company" style={{color: card.textColor}}>{card.company}</span></div>
                                <div className="card-body"><h3 style={{color: card.textColor}}>{card.fullName}</h3><p className="job-title" style={{color: card.textColor}}>{card.jobTitle}</p><div className="card-contact" style={{color: card.textColor}}><span>📧 {card.email}</span></div></div>
                                <div className="card-actions"><button className="share-btn" onClick={() => openShare(card)}>📷 SHARE QR</button><button className="delete-btn" onClick={() => handleDelete(card._id)}>🗑</button></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-glass">
                        <h2 className="modal-title">Customize Identity</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group"><input placeholder="Full Name" onChange={e => setFormData({...formData, fullName: e.target.value})} required /><input placeholder="Job Title" onChange={e => setFormData({...formData, jobTitle: e.target.value})} required /></div>
                            <div className="form-group"><input placeholder="Company" onChange={e => setFormData({...formData, company: e.target.value})} required /><input placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
                            <div className="form-group"><input placeholder="Phone" onChange={e => setFormData({...formData, phone: e.target.value})} required /><input placeholder="Website" onChange={e => setFormData({...formData, website: e.target.value})} /></div>
                            <div className="color-section">
                                <label className="color-label"><span>Background</span><input type="color" className="color-input" value={formData.cardColor} onChange={e => setFormData({...formData, cardColor: e.target.value})} /></label>
                                <label className="color-label"><span>Text Color</span><input type="color" className="color-input" value={formData.textColor} onChange={e => setFormData({...formData, textColor: e.target.value})} /></label>
                            </div>
                            <div className="modal-buttons"><button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button><button type="submit" className="submit-btn">Mint Card</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* SHARE MODAL - Uses Auto-Detected IP */}
            {showShareModal && selectedCard && (
                <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
                    <div className="modal-glass" style={{width:'450px', textAlign:'center'}}>
                        <h2 className="modal-title">Scan to Connect</h2>
                        <div style={{background:'white', padding:'20px', borderRadius:'20px', display:'inline-block', marginBottom:'20px'}}>
                            
                            {/* Uses networkIP instead of window.location.hostname */}
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://${networkIP}:5173/view/${selectedCard._id}`} 
                                alt="QR Code" 
                                style={{display:'block', width:'220px'}}
                            />
                            
                        </div>
                        <button className="cancel-btn" style={{width:'100%', borderColor:'#fff', color:'#fff'}} onClick={() => setShowShareModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default HomePage;