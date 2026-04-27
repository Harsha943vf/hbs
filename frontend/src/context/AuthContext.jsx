import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function normalizeUser(userData) {
  if (!userData) return null

  const id = userData.id ?? userData.userId ?? null
  return {
    ...userData,
    id,
    userId: userData.userId ?? id,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(normalizeUser(JSON.parse(storedUser)))
    }
    setLoading(false)
  }, [])

  const login = (tokenValue, userData) => {
    const normalizedUser = normalizeUser(userData)
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setToken(tokenValue)
    setUser(normalizedUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'ROLE_ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
