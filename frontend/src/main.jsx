import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set up Axios Interceptor for JWT Authentication globally
axios.interceptors.request.use((config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
