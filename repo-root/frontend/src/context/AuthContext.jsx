import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import api from '../lib/api'
import { getExpiry } from '../lib/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  const refreshTimerRef = useRef(null)

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem('user', JSON.stringify(user))
      scheduleRefreshLogout(user.token)
    } else {
      localStorage.removeItem('user')
      clearScheduled()
    }
  }, [user])

  useEffect(() => {
    // On mount, restore user from localStorage
    const stored = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    if (stored && stored.token) {
      setUser(stored)
      scheduleRefreshLogout(stored.token)

      // Optional: fetch /me to get roles (disable if backend blocks it)
      const fetchRoles = false // <-- set to false to disable /auth/me
      if (fetchRoles) {
        (async () => {
          try {
            const resp = await api.get('/auth/me')
            const merged = { ...stored, roles: Array.from(resp.data.roles || []) }
            setUser(merged)
            localStorage.setItem('user', JSON.stringify(merged))
          } catch (e) {
            console.warn('Skipping /auth/me fetch:', e)
          }
        })()
      }
    }
  }, [])

  function clearScheduled() {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  function scheduleRefreshLogout(token) {
    clearScheduled()
    const expMs = getExpiry(token)
    if (!expMs) return
    const now = Date.now()
    const msLeft = expMs - now
    const refreshAt = Math.max(0, msLeft - 55000)
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const stored = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
        if (stored && stored.refreshToken) {
          const resp = await api.post('/auth/refresh', { refreshToken: stored.refreshToken })
          const data = resp.data
          const newUser = { ...stored, token: data.token, refreshToken: data.refreshToken || stored.refreshToken }

          // Skip /auth/me if backend disabled
          newUser.roles = stored.roles || []

          setUser(newUser)
          localStorage.setItem('user', JSON.stringify(newUser))
          scheduleRefreshLogout(newUser.token)
        } else {
          logout()
        }
      } catch (e) {
        logout()
      }
    }, refreshAt)

    setTimeout(() => {
      const current = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      const currentExp = current && current.token ? getExpiry(current.token) : null
      if (!currentExp || Date.now() >= currentExp + 5000) {
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }, Math.max(0, msLeft + 5000))
  }

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password })
      const data = res.data

      const u = {
        username: data.username || username,
        token: data.token,
        refreshToken: data.refreshToken
      }

      // Skip /auth/me fetch if backend blocks it
      u.roles = []

      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
      scheduleRefreshLogout(u.token)
      return u
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  const register = async (username, password) => {
    const res = await api.post('/auth/register', { username, password })
    return res.data
  }

  const logout = async () => {
    try {
      const stored = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      if (stored && stored.refreshToken) {
        await api.post('/auth/logout', { refreshToken: stored.refreshToken })
      }
    } catch (e) {
      // ignore
    } finally {
      clearScheduled()
      setUser(null)
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
