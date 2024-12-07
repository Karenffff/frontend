import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-five-wine-57.vercel.app', // Use an environment variable or default to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
