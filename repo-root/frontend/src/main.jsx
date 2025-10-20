import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './pages/ErrorBoundary'

localStorage.clear();
sessionStorage.clear();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
<ErrorBoundary>
<AuthProvider>
        <App />
      </AuthProvider>
</ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
