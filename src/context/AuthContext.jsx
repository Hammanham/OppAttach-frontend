import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — try to restore session from backend (skip request if no token to avoid 401 redirect loop)
  useEffect(() => {
    const token = localStorage.getItem('ias_token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    authService.me()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    if (res.data.token) localStorage.setItem('ias_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (data) => {
    const res = await authService.register(data)
    if (res.data.token) localStorage.setItem('ias_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const loginWithGoogle = async (idToken) => {
    const res = await authService.loginGoogle(idToken)
    if (res.data.token) localStorage.setItem('ias_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await authService.logout().catch(() => {})
    localStorage.removeItem('ias_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
