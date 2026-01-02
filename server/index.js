const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err)); // This will now show in Vercel Logs

// Import Models
const User = require('./models/User');
const Card = require('./models/Card');

// Razorpay Config
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// --- ROUTES ---

app.get('/', (req, res) => {
    res.send("VizCard Server is Running");
});

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

// AUTH - REGISTER (Updated to show REAL errors)
app.post('/register', async (req, res) => { 
    try { 
        const { username, email, password } = req.body;
        const user = await User.create({ name: username, email, password }); 
        res.json({ status: 'ok', user }); 
    } catch (err) { 
        console.error("Register Error:", err); // Log the real error
        res.json({ status: 'error', error: err.message }); // Send real error to frontend
    } 
});

// AUTH - LOGIN (Updated to prevent 500 crashes)
app.post('/login', async (req, res) => { 
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password }); 
        if (user) { 
            res.json({ status: 'ok', userId: user._id }); 
        } else { 
            res.json({ status: 'error', message: "Invalid credentials" }); 
        } 
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// CARD ROUTES
app.post('/create-card', async (req, res) => { 
    try { await Card.create(req.body); res.json({ status: "ok" }); } 
    catch (err) { res.status(500).json({ status: "error" }); } 
});

// UPDATE CARD
app.put('/update-card/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Card.findByIdAndUpdate(id, req.body); 
        res.json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Could not update card" });
    }
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

// PAYMENT
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

app.post('/verify-membership', async (req, res) => {
    const { userId, planType, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        await User.findByIdAndUpdate(userId, { isMember: true, planType: planType });
        res.json({ status: 'ok' });
    } else {
        res.json({ status: 'error' });
    }
});

module.exports = app;