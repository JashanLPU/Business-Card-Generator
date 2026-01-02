// client/src/config/api.js

const isLocal = window.location.hostname === "localhost";

// ❌ OLD/WRONG: "http://business-card-generator...:5000"
// ✅ NEW/CORRECT: Paste your ACTUAL Server URL from Vercel below (without :5000)
const API = isLocal 
    ? "http://localhost:5000" 
    : "https://business-card-generator-psi-one.vercel.app/"; 

export default API;