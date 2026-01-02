const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- NEW MEMBERSHIP FIELDS ---
    isMember: { type: Boolean, default: false },
    planType: { type: String, default: 'Free' }, // 'Free', 'Pro', 'Lifetime'
    memberSince: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);