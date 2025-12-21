const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os');
const app = express();

app.use(express.json());
// Allow ANY device to connect
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'] }));

mongoose.connect('mongodb://127.0.0.1:27017/vizcard')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// --- SMART IP FINDER (Ignores Virtual Adapters) ---
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    let bestMatch = 'localhost';

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (localhost) and non-IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                
                // IGNORE VirtualBox / VMware IPs (usually 192.168.56.x)
                if (iface.address.startsWith('192.168.56.')) {
                    continue; 
                }

                // PREFER Standard Home Wi-Fi (192.168.1.x or 192.168.0.x)
                if (iface.address.startsWith('192.168.1.') || iface.address.startsWith('192.168.0.')) {
                    return iface.address; // Return immediately if found
                }

                bestMatch = iface.address; // Keep as backup
            }
        }
    }
    return bestMatch;
}

const UserSchema = new mongoose.Schema({ username: String, email: { type: String, unique: true }, password: String });
const User = mongoose.model('User', UserSchema);

const CardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: String, jobTitle: String, company: String, email: String, phone: String, website: String, template: String, cardColor: String, textColor: String
});
const Card = mongoose.model('Card', CardSchema);

// API to send the Correct IP to the Frontend
app.get('/get-network-ip', (req, res) => {
    const ip = getLocalIpAddress();
    console.log("📡 Client requested IP. Sending:", ip);
    res.json({ ip: ip });
});

// PUBLIC VIEW ENDPOINT (Vital for Phone Access)
app.get('/get-card-public/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (card) res.json({ status: "ok", card });
        else res.json({ status: "error", message: "Card not found" });
    } catch (err) { res.status(500).json({ status: "error", message: "Server Error" }); }
});

app.post('/register', async (req, res) => { try { const user = await User.create(req.body); res.json({ status: 'ok', user }); } catch (err) { res.json({ status: 'error', error: "Email already exists" }); } });
app.post('/login', async (req, res) => { const user = await User.findOne({ email: req.body.email, password: req.body.password }); if (user) { res.json({ status: 'ok', userId: user._id }); } else { res.json({ status: 'error', message: "Invalid credentials" }); } });
app.post('/create-card', async (req, res) => { try { await Card.create(req.body); res.json({ status: "ok" }); } catch (err) { res.status(500).json({ status: "error" }); } });
app.get('/get-cards/:userId', async (req, res) => { try { const cards = await Card.find({ userId: req.params.userId }); res.json({ status: "ok", cards }); } catch (err) { res.status(500).json({ status: "error" }); } });
app.delete('/delete-card/:id', async (req, res) => { await Card.findByIdAndDelete(req.params.id); res.json({ status: "ok" }); });

const PORT = 5000;
const networkIP = getLocalIpAddress();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Server Running!`);
    console.log(`👉 Laptop Access:   http://localhost:${PORT}`);
    console.log(`👉 Phone Access:    http://${networkIP}:${PORT}`); // This should now show 192.168.1.58
    console.log(`\nIgnore the 192.168.56.1 if you see it elsewhere.\n`);
});