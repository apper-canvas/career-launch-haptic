import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { RecruiterProvider } from './context/RecruiterContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
      <RecruiterProvider>
        <App />
      </RecruiterProvider>
)