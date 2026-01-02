// Automatically detects if we are on Vercel or Localhost
const isLocal = window.location.hostname === "localhost";

// On Vercel, the backend is available at the same domain via /api
// On Localhost, it is at port 5000
const API = isLocal ? "http://localhost:5000" : "/api";

export default API;