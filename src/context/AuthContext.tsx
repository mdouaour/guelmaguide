'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  email: string
  role: 'visitor' | 'organizer' | 'admin'
  organizer_verified: boolean
}

interface AuthContextValue {
  user: User | null
  profile: AuthUser | null
  isAuthLoading: boolean
  loginUser: (email: string, password: string) => Promise<void>
  registerUser: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        
        if (currentUser) {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()
          
          if (profileData) {
            setProfile({
              id: profileData.id,
              email: profileData.email,
              role: profileData.role,
              organizer_verified: profileData.organizer_verified,
            })
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsAuthLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          // Fetch profile on auth change
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()

          if (profileData) {
            setProfile({
              id: profileData.id,
              email: profileData.email,
              role: profileData.role,
              organizer_verified: profileData.organizer_verified,
            })
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const loginUser = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const registerUser = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
    setUser(null)
    setProfile(null)
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthLoading,
      loginUser,
      registerUser,
      logout,
    }),
    [user, profile, isAuthLoading],
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
