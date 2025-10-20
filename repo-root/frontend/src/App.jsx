import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import AdminTokens from './pages/AdminTokens'

export default function App(){
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow p-4 flex justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold">Appointments</Link>
          {user && <Link to="/appointments">My Appointments</Link>}
          {user && user.roles?.includes('ROLE_ADMIN') && <Link to="/admin">Admin</Link>}
        </div>
        <div>
          {user ? (
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-green-500 text-white rounded">Register</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/appointments" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/appointments" /> : <Register />} />

          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }/>
          <Route path="/admin" element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <AdminTokens />
            </ProtectedRoute>
          }/>
        </Routes>
      </main>
    </div>
  );
}
