const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(express.json());
// Inside server/index.js
app.use(cors({
    origin: "*",  // ✅ Allow any domain to connect (easiest for setup)
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

// Database Connection
// ⚠️ You MUST set MONGO_URI in Vercel settings (127.0.0.1 won't work on cloud)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// Import Models
const User = require('./models/User');
const Card = require('./models/Card');

// 🔒 RAZORPAY CONFIG (Hardcoded Keys Restored)
const razorpay = new Razorpay({
    key_id: "rzp_test_Ruf0QnWdRTCqcs", 
    key_secret: "n0EjlUB5PjAaW8EGoRYGwvhn"
});

// --- ROUTES ---

app.get('/', (req, res) => {
    res.send("VizCard Server is Running");
});
// ... existing create-card route ...

// ✅ NEW: Update Card Route
app.put('/update-card/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Update the card with new data coming from frontend
        await Card.findByIdAndUpdate(id, req.body); 
        res.json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Could not update card" });
    }
});

// ... existing get-cards route ...
// GET USER
app.get('/get-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            res.json({ status: 'ok', user: { 
                name: user.name, 
                email: user.email, 
                isMember: user.isMember, 
                planType: user.planType 
            }});
        } else {
            res.json({ status: 'error' });
        }
    } catch(err) { res.json({ status: 'error' }); }
});

// AUTH
app.post('/register', async (req, res) => { 
    try { 
        const { username, email, password } = req.body;
        const user = await User.create({ name: username, email, password }); 
        res.json({ status: 'ok', user }); 
    } catch (err) { 
        res.json({ status: 'error', error: "Email already exists" }); 
    } 
});

app.post('/login', async (req, res) => { 
    const user = await User.findOne({ email: req.body.email, password: req.body.password }); 
    if (user) { 
        res.json({ status: 'ok', userId: user._id }); 
    } else { 
        res.json({ status: 'error', message: "Invalid credentials" }); 
    } 
});

// CARD ROUTES
app.post('/create-card', async (req, res) => { 
    try { await Card.create(req.body); res.json({ status: "ok" }); } 
    catch (err) { res.status(500).json({ status: "error" }); } 
});

app.get('/get-cards/:userId', async (req, res) => { 
    try { const cards = await Card.find({ userId: req.params.userId }); res.json({ status: "ok", cards }); } 
    catch (err) { res.status(500).json({ status: "error" }); } 
});

app.get('/get-card-public/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (card) res.json({ status: "ok", card });
        else res.json({ status: "error", message: "Card not found" });
    } catch (err) { res.status(500).json({ status: "error", message: "Server Error" }); }
});

app.delete('/delete-card/:id', async (req, res) => { 
    await Card.findByIdAndDelete(req.params.id); 
    res.json({ status: "ok" }); 
});

// PAYMENT - Create Order
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount, 
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) { res.status(500).send("Error creating order"); }
});

// PAYMENT - Verify (Hardcoded Secret Restored)
app.post('/verify-membership', async (req, res) => {
    const { userId, planType, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Using your hardcoded Secret here:
    const expectedSignature = crypto
        .createHmac('sha256', "n0EjlUB5PjAaW8EGoRYGwvhn") 
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        await User.findByIdAndUpdate(userId, { isMember: true, planType: planType });
        res.json({ status: 'ok' });
    } else {
        res.json({ status: 'error' });
    }
});

// EXPORT FOR VERCEL
module.exports = app;