import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API from "../../config/api"; // ✅ Import the smart config
import './Global.css'; 
import './Dashboard.css'; 

const ViewCard = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Uses the correct API URL (works on Vercel & Localhost)
        axios.get(`${API}/get-card-public/${id}`)
            .then(res => {
                if (res.data.status === 'ok') {
                    setCard(res.data.card);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // ... (Keep the rest of your getCardStyle and return JSX exactly as it was) ...
    // Copy the rest of the file from your previous version below this line
    
    const getCardStyle = (template, color, textColor) => {
        let style = { 
            color: textColor, 
            borderColor: 'rgba(255,255,255,0.2)',
            maxWidth: '400px', 
            margin: '0 auto',
            minHeight: '220px' 
        };
        
        switch (template) {
            case 'modern': style.background = color; break;
            case 'glass': style.background = `${color}40`; style.backdropFilter = 'blur(12px)'; style.border = `1px solid ${color}88`; break;
            case 'cyber': style.background = '#050505'; style.border = `2px solid ${color}`; style.boxShadow = `0 0 15px ${color}, inset 0 0 10px ${color}22`; break;
            case 'gradient': style.background = `linear-gradient(135deg, ${color} 0%, #000000 100%)`; break;
            default: style.background = color;
        }
        return style;
    };

    if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Loading Identity...</div>;
    if (!card) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Card not found.</div>;

    return (
        <div className="page-container" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'20px'}}>
            <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'#050505', zIndex:-1}}></div>
            <div className="viz-card" style={getCardStyle(card.template, card.cardColor, card.textColor)}>
                <div className="card-top">
                    <div className="chip" style={{width:'45px', height:'30px'}}></div>
                    <span className="card-company" style={{color: card.textColor, fontSize:'0.7rem'}}>{card.company}</span>
                </div>
                <div className="card-body" style={{marginTop:'30px'}}>
                    <h3 style={{color: card.textColor, fontSize:'1.8rem', margin:'0 0 5px'}}>{card.fullName}</h3>
                    <p className="job-title" style={{color: card.textColor, fontSize:'0.8rem', opacity:0.8}}>{card.jobTitle}</p>
                    <div className="card-contact" style={{marginTop:'20px', fontSize:'0.9rem'}}>
                        <div style={{marginBottom:'5px'}}>📧 <a href={`mailto:${card.email}`} style={{color:card.textColor, textDecoration:'none'}}>{card.email}</a></div>
                        <div style={{marginBottom:'5px'}}>📞 <a href={`tel:${card.phone}`} style={{color:card.textColor, textDecoration:'none'}}>{card.phone}</a></div>
                        {card.website && <div>🌐 <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" style={{color:card.textColor, textDecoration:'none'}}>{card.website}</a></div>}
                    </div>
                </div>
                <div style={{marginTop:'30px', textAlign:'center', opacity:0.5, fontSize:'0.7rem', color: card.textColor}}>
                    POWERED BY VIZCARD
                </div>
            </div>
        </div>
    );
};

export default ViewCard;