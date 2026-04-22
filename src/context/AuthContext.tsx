'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, login, register, type AuthUser } from '@/lib/api'

const TOKEN_STORAGE_KEY = 'guelmaguide:access-token'

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  isAuthLoading: boolean
  loginUser: (email: string, password: string) => Promise<void>
  registerUser: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!storedToken) {
      Promise.resolve().then(() => setIsAuthLoading(false))
      return
    }

    getMe(storedToken)
      .then((me) => {
        setToken(storedToken)
        setUser(me)
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY)
        setToken(null)
      })
      .finally(() => setIsAuthLoading(false))
  }, [])

  const loginUser = async (email: string, password: string) => {
    const response = await login({ email, password })
    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token)
    setToken(response.access_token)
    const me = await getMe(response.access_token)
    setUser(me)
  }

  const registerUser = async (email: string, password: string) => {
    const response = await register({ email, password })
    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token)
    setToken(response.access_token)
    setUser(response.user)
  }

  const logout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthLoading,
      loginUser,
      registerUser,
      logout,
    }),
    [token, user, isAuthLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
