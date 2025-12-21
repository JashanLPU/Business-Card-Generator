const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Content
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },

    // Design Customization
    template: { type: String, default: 'modern' }, // modern, classic, cyber
    cardColor: { type: String, default: '#111111' }, // Background
    textColor: { type: String, default: '#ffffff' }, // Text Color
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', CardSchema);