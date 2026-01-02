import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // ✅ The New Component
import './Global.css'; 
import './About.css';  
import videoBg from '../../background.mp4';

const LandingPage = () => {
    const navigate = useNavigate();
    
    // Mouse Parallax Logic
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        setOffset({ x, y });
    };

    // Scroll Animation Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.about-anim').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-wrapper" onMouseMove={handleMouseMove}>
            
            <video className="global-bg-video" autoPlay muted loop playsInline>
                <source src={videoBg} type="video/mp4" />
            </video>

            <Navbar /> {/* ✅ Replaced Hardcoded Nav */}

            {/* Hero Section */}
            <section className="about-hero about-anim">
                <div className="hero-content" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
                    <div className="matte-badge">
                        <span>The Future of Networking</span>
                    </div>
                    
                    <h1 className="about-title">
                        Your Identity, <br />
                        <span className="about-gradient">Elevated.</span>
                    </h1>
                    
                    <div className="matte-box">
                        <p className="about-desc">
                            In a digital-first world, paper business cards are obsolete. 
                            VizCard 3D offers a professional, always-accessible identity.
                        </p>
                    </div>

                    <div className="about-btn-row">
                        <button className="about-btn-primary" onClick={() => navigate('/dashboard')}>
                            Create My Card
                        </button>
                    </div>
                </div>
            </section>

            {/* Problem & Solution */}
            <section className="about-section about-anim">
                <div className="matte-panel">
                    <div className="panel-content">
                        <h2>The Paper Problem</h2>
                        <p>
                            Every year, billions of business cards are printed, and <strong>88% are discarded</strong> within a week. 
                            They are static and wasteful.
                        </p>
                    </div>
                    <div className="panel-divider"></div>
                    <div className="panel-content">
                        <h2>The Digital Solution</h2>
                        <p>
                            VizCard is purely digital. It costs zero trees to create and lasts forever. 
                            Update instantly, share universally.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="about-features about-anim">
                <h2 className="section-header">Why Professionals Switch</h2>
                <div className="about-grid">
                    <div className="matte-card">
                        <span className="af-icon">⚡</span>
                        <h3>Real-Time Updates</h3>
                        <p>Changed your job title? Update your dashboard once, and every person you have ever met sees the new info immediately.</p>
                    </div>
                    <div className="matte-card">
                        <span className="af-icon">📱</span>
                        <h3>Universal Compatibility</h3>
                        <p>No app required. Your digital card works instantly on iPhone, Android, tablets, and desktop browsers.</p>
                    </div>
                    <div className="matte-card">
                        <span className="af-icon">🎨</span>
                        <h3>Premium Design</h3>
                        <p>Stand out with glass-morphism and 3D aesthetics that leave a lasting impression.</p>
                    </div>
                </div>
            </section>

            {/* Sustainability */}
            <section className="about-section about-anim">
                <div className="matte-wide-panel">
                    <h2>Environmental Impact</h2>
                    <p>
                        By switching to a digital alternative, you actively reduce paper waste and the carbon footprint associated with printing and logistics.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta about-anim">
                <div className="matte-cta">
                    <h2>Ready to Upgrade?</h2>
                    <p>Join the movement towards smarter, sustainable networking.</p>
                    <button className="about-btn-primary" onClick={() => navigate('/dashboard')}>
                        Create My Card Now
                    </button>
                </div>
            </section>

            <footer className="about-footer">
                <p className="copyright">© 2025 VizCard Technologies.</p>
            </footer>
        </div>
    );
};

export default LandingPage;