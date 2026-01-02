import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 
import './Global.css'; 
import './Subscription.css'; // ✅ New CSS
import videoBg from '../../background.mp4';
import API from "../../config/api"; 

const Subscription = () => {
    const navigate = useNavigate();

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount, planName) => {
        const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) return alert("Razorpay failed to load");

        const userId = localStorage.getItem("userId");

        // 1. Create Order
        try {
            const order = await axios.post(`${API}/create-order`, { amount: amount * 100 });

            const options = {
                key: "rzp_test_Ruf0QnWdRTCqcs", // Use your Key
                amount: order.data.amount,
                currency: "INR",
                name: "VizCard Pro",
                description: `Upgrade to ${planName}`,
                order_id: order.data.id,
                handler: async function (response) {
                    // 2. Verify & Upgrade
                    const result = await axios.post(`${API}/verify-membership`, {
                        userId,
                        planType: planName,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (result.data.status === "ok") {
                        alert(`Welcome to ${planName}!`);
                        navigate('/dashboard');
                        window.location.reload();
                    } else {
                        alert("Verification Failed");
                    }
                },
                theme: { color: "#FFD700" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Payment Error. Check console.");
        }
    };

    return (
        <div className="page-container">
            {/* 1. Global Background */}
            <video className="global-bg-video" autoPlay muted loop playsInline>
                <source src={videoBg} type="video/mp4" />
            </video>

            {/* 2. Navbar */}
            <Navbar />

            {/* 3. Pricing Content */}
            <div className="sub-header">
                <h1 className="sub-title">Upgrade Your Identity</h1>
                <p className="sub-desc">Unlock premium templates and unlimited customization.</p>
            </div>

            <div className="pricing-container">
                
                {/* STANDARD PLAN */}
                <div className="price-card">
                    <h3 className="plan-name">Monthly</h3>
                    <h2 className="price">₹200<span>/mo</span></h2>
                    
                    <ul className="features">
                        <li><span>✔</span> Unlock Custom Colors</li>
                        <li><span>✔</span> Premium 3D Templates</li>
                        <li><span>✔</span> Remove Branding</li>
                        <li><span>✔</span> Priority Support</li>
                    </ul>

                    <button className="sub-btn standard" onClick={() => handlePayment(200, 'Monthly')}>
                        Subscribe
                    </button>
                </div>

                {/* PREMIUM PLAN */}
                <div className="price-card premium">
                    <div className="best-value">BEST VALUE</div>
                    <h3 className="plan-name" style={{color:'#FFD700'}}>Lifetime</h3>
                    <h2 className="price">₹1500<span>/once</span></h2>
                    
                    <ul className="features">
                        <li><span>✔</span> <strong>Everything in Monthly</strong></li>
                        <li><span>✔</span> Pay Once, Own Forever</li>
                        <li><span>✔</span> "Pro" Gold Badge</li>
                        <li><span>✔</span> Early Access to New Features</li>
                    </ul>

                    <button className="sub-btn gold" onClick={() => handlePayment(1500, 'Lifetime')}>
                        Get Lifetime Access
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Subscription;