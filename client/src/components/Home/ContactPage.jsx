import React, { useState } from 'react';
import Navbar from './Navbar'; // ✅ The New Component
import './Global.css'; 
import './Contact.css';  
import videoBg from '../../background.mp4';
import axios from 'axios';
import API from "../../config/api";

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleMouseMove = (e) => {
        const content = document.querySelector('.hero-content');
        if(content) {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            content.style.transform = `translate(${x}px, ${y}px)`;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Optional: Backend Call
            // await axios.post(`${API}/contact`, formData);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            alert("Error sending message");
        }
    };

    return (
        <div className="contact-wrapper" onMouseMove={handleMouseMove}>
            
            <video className="global-bg-video" autoPlay muted loop playsInline>
                <source src={videoBg} type="video/mp4" />
            </video>

            <Navbar /> {/* ✅ Replaced Hardcoded Nav */}

            {/* HERO SECTION */}
            <section className="contact-hero contact-anim visible">
                <div className="hero-content">
                    <div className="matte-badge"><span>24/7 Support</span></div>
                    <h1 className="contact-title">Let's Start a <br/><span className="contact-gradient">Conversation.</span></h1>
                    <p className="contact-desc">
                        Have questions about VizCard Enterprise? Need help with your digital identity? 
                        Our team is ready to assist you.
                    </p>
                </div>
            </section>

            {/* CONTACT FORM SECTION */}
            <section className="contact-section contact-anim visible">
                <div className="contact-grid">
                    
                   {/* INFO CARD */}
                    <div className="info-card">
                        <h3>Contact Info</h3>
                        <div className="info-item">
                            <span className="icon">📍</span>
                            <p><strong>Location</strong><br />Punjab, India</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">📧</span>
                            <p><strong>Email Us</strong><br />support@vizcard.com</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">📱</span>
                            <p><strong>Phone</strong><br />+91 98765-43210</p>
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