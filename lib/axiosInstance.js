import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.newbethelfcreditunion.com', // Use an environment variable or default to localhost
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000', // Use an environment variable or default to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
