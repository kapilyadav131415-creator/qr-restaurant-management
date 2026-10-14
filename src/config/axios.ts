import axios from 'axios';

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', // Aapka backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

 
api.interceptors.request.use(
  (config) => {
    // LocalStorage se token get karo (Jo login ke time save kiya tha)
    const token = localStorage.getItem('token');

    if (token) {
       
      if (token.startsWith('Bearer ')) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
api.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    // Agar Backend ne 401 Unauthorized bheja (matlab token missing ya expire ho gaya)
    if (error.response && error.response.status === 401) {
      console.error("Token Expired or Invalid. Redirecting to Login...");
      
      // Token delete karo
      localStorage.removeItem('token');
      
      // User ko login page pe bhej do
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;