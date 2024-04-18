import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

axios.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    console.log("Token is invalid, please log in again.");
    localStorage.removeItem('token');
    // Optionally redirect to login or perform any other necessary cleanup
  }
  return Promise.reject(error);
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
