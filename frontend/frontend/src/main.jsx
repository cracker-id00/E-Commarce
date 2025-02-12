import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Style/index.css'
import App from './App.jsx'
import axios from 'axios'
import { UserProvider } from './components/UserContext.jsx' 

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <UserProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </UserProvider>,
)
