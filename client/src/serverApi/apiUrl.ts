const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://epiapp-server.onrender.com';

export default API_URL;
