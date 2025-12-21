import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Global.css'; 
import './Contact.css';  
import videoBg from '../../background.mp4';

const ContactPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    // Mouse Parallax
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        setOffset({ x, y });
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate('/');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    // Animation Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.contact-anim').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="contact-wrapper" onMouseMove={handleMouseMove}>
            
            <video className="global-bg-video" autoPlay muted loop playsInline>
                <source src={videoBg} type="video/mp4" />
            </video>

            {/* UNIFIED NAVBAR */}
            <nav className="contact-navbar">
                <div className="contact-logo">VizCard 3D</div>
                <div className="contact-nav-links">
                    <NavLink to="/about" className="contact-link">About</NavLink>
                    <NavLink to="/dashboard" className="contact-link">Dashboard</NavLink>
                    <NavLink to="/contact" className="contact-link active">Contact</NavLink>
                    <button className="contact-btn-logout" onClick={handleLogout}>Log Out</button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="contact-hero contact-anim">
                <div className="hero-content" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
                    <div className="matte-badge"><span>24/7 Support</span></div>
                    <h1 className="contact-title">Let's Start a <br/><span className="contact-gradient">Conversation.</span></h1>
                    <p className="contact-desc">
                        Have questions about VizCard Enterprise? Need help with your digital identity? 
                        Our team is ready to assist you.
                    </p>
                </div>
            </section>

            {/* CONTACT FORM SECTION */}
            <section className="contact-section contact-anim">
                <div className="contact-grid">
                    
                    {/* INFO CARD */}
                    <div className="info-card">
                        <h3>Contact Info</h3>
                        <div className="info-item">
                            <span className="icon">📍</span>
                            <p><strong>Headquarters</strong><br/>123 Innovation Dr, Tech City, CA</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">📧</span>
                            <p><strong>Email Us</strong><br/>support@vizcard.com</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">📱</span>
                            <p><strong>Phone</strong><br/>+1 (800) 555-0199</p>
                        </div>
                    </div>

                    {/* FORM CARD */}
                    <div className="form-card">
                        {submitted ? (
                            <div className="success-message">
                                <h3>Thank You!</h3>
                                <p>We have received your message and will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        placeholder="Your Name" 
                                        required 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        placeholder="Email Address" 
                                        required 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="input-group">
                                    <textarea 
                                        placeholder="How can we help?" 
                                        rows="5" 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn">Send Message</button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            <footer className="contact-footer">
                <p className="copyright">© 2025 VizCard Technologies.</p>
            </footer>
        </div>
    );
};

export default ContactPage;