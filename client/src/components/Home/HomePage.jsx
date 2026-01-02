import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 
import './Global.css';
import './Dashboard.css';
import videoBg from '../../background.mp4';
import API from "../../config/api"; 

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
    const [user, setUser] = useState({ name: 'User', isMember: false, planType: 'Free' });

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    
    // ✅ EDIT STATE
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '', jobTitle: '', company: '', email: '', phone: '', website: '', template: 'modern', cardColor: '#111111', textColor: '#ffffff'
    });

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) { navigate('/auth'); return; }

        axios.get(`${API}/get-cards/${userId}`)
            .then(res => { if(res.data.status === 'ok') setCards(res.data.cards); })
            .catch(err => console.error(err));

        axios.get(`${API}/get-user/${userId}`)
            .then(res => { if (res.data.status === 'ok') setUser(res.data.user); });

    }, []);

    // ✅ NEW: Handle Form Submit (Create OR Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        try {
            let res;
            if (isEditing) {
                // UPDATE EXISTING CARD
                res = await axios.put(`${API}/update-card/${editId}`, { ...formData, userId });
            } else {
                // CREATE NEW CARD
                res = await axios.post(`${API}/create-card`, { ...formData, userId });
            }

            if (res.data.status === "ok") window.location.reload();
            else alert("Error: " + res.data.message);
        } catch (error) { alert("Network Error"); }
    };

    // ✅ NEW: Open Modal in Edit Mode
    const openEditModal = (card) => {
        setIsEditing(true);
        setEditId(card._id);
        setFormData({
            fullName: card.fullName,
            jobTitle: card.jobTitle,
            company: card.company,
            email: card.email,
            phone: card.phone,
            website: card.website || '',
            template: card.template,
            cardColor: card.cardColor,
            textColor: card.textColor
        });
        setShowCreateModal(true);
    };

    // ✅ Reset Modal for Create Mode
    const openCreateModal = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ fullName: '', jobTitle: '', company: '', email: '', phone: '', website: '', template: 'modern', cardColor: '#111111', textColor: '#ffffff' });
        setShowCreateModal(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this card?")) {
            await axios.delete(`${API}/delete-card/${id}`);
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

    // ✅ PUBLIC QR LOGIC (Works on Localhost AND Vercel)
    // window.location.origin gets "https://your-app.vercel.app" or "http://localhost:5173" automatically
    const qrCodeLink = selectedCard ? `${window.location.origin}/view/${selectedCard._id}` : "";

    return (
        <div className="page-container">
            <video className="global-bg-video" autoPlay muted loop playsInline><source src={videoBg} type="video/mp4" /></video>
            
            <Navbar /> 

            <div className="dashboard-header">
                <h1 className="dash-title">Design Studio</h1>
                <p className="dash-subtitle">Select a template to mint your identity.</p>
            </div>

            <div className="glass-section-container">
                <h2 className="section-label">✦ Select a Template</h2>
                <div className="template-grid-display">
                    {PREMADE_TEMPLATES.map((tmpl) => (
                        <div key={tmpl.id} className="template-preview-card" 
                             onClick={() => {
                                 openCreateModal(); // Reset form
                                 setFormData(prev => ({ ...prev, template: tmpl.template, cardColor: tmpl.cardColor, textColor: tmpl.textColor })); 
                             }} 
                             style={getCardStyle(tmpl.template, tmpl.cardColor, tmpl.textColor)}>
                            <div className="card-top"><div className="chip"></div><span className="card-company" style={{color: tmpl.textColor}}>VIZCARD</span></div>
                            <div className="card-body"><h3 style={{color: tmpl.textColor}}>{tmpl.name}</h3></div>
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
                                <div className="card-body"><h3 style={{color: card.textColor}}>{card.fullName}</h3><p className="job-title" style={{color: card.textColor}}>{card.jobTitle}</p></div>
                                
                                <div className="card-actions">
                                    <button className="share-btn" onClick={() => { setSelectedCard(card); setShowShareModal(true); }}>📷 SHARE</button>
                                    
                                    {/* ✅ EDIT BUTTON */}
                                    <button className="share-btn" style={{background: 'rgba(255,255,255,0.2)', color: card.textColor}} onClick={() => openEditModal(card)}>✏️</button>
                                    
                                    <button className="delete-btn" onClick={() => handleDelete(card._id)}>🗑</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-glass">
                        <h2 className="modal-title">{isEditing ? "Update Identity" : "Customize Identity"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><input placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required /><input placeholder="Job Title" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} required /></div>
                            <div className="form-group"><input placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required /><input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
                            <div className="form-group"><input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /><input placeholder="Website" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} /></div>
                            
                            <div className="color-section">
                                <label className="color-label" style={{opacity: user.isMember ? 1 : 0.5}}>
                                    <span>Background {user.isMember ? "" : "🔒"}</span>
                                    <input type="color" className="color-input" value={formData.cardColor} onChange={e => setFormData({...formData, cardColor: e.target.value})} disabled={!user.isMember} />
                                </label>
                                <label className="color-label" style={{opacity: user.isMember ? 1 : 0.5}}>
                                    <span>Text Color {user.isMember ? "" : "🔒"}</span>
                                    <input type="color" className="color-input" value={formData.textColor} onChange={e => setFormData({...formData, textColor: e.target.value})} disabled={!user.isMember} />
                                </label>
                            </div>
                            {!user.isMember && <p style={{color:'#FFD700', fontSize:'0.8rem', textAlign:'center'}}>Upgrade to Pro to unlock custom colors.</p>}

                            <div className="modal-buttons"><button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button><button type="submit" className="submit-btn">{isEditing ? "Save Changes" : "Mint Card"}</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showShareModal && selectedCard && (
                <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
                    <div className="modal-glass" style={{width:'450px', textAlign:'center'}} onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Scan to Connect</h2>
                        
                        <div style={{background:'white', padding:'20px', borderRadius:'20px', display:'inline-block', marginBottom:'20px'}}>
                            
                            {/* ✅ QR CODE NOW USES PUBLIC DOMAIN */}
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeLink)}`} 
                                alt="QR Code" 
                                style={{display:'block', width:'220px'}}
                            />
                            
                        </div>
                        
                        <p style={{color:'#888', fontSize:'0.8rem', marginTop:'10px'}}>
                            Link: <a href={qrCodeLink} target="_blank" style={{color:'#4ade80'}}>{qrCodeLink}</a>
                        </p>

                        <button className="cancel-btn" style={{width:'100%', borderColor:'#fff', color:'#fff', marginTop:'20px'}} onClick={() => setShowShareModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default HomePage;