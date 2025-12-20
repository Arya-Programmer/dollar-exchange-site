"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  subscription: "free" | "gold" | "platinum" | "api"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, subscription?: string) => Promise<void>
  signin: (email: string, password: string) => Promise<void>
  logout: () => void
  showAuthModal: boolean
  authModalMode: "signin" | "signup"
  openAuthModal: (mode?: "signin" | "signup") => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin")

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const signup = async (email: string, password: string, subscription = "free") => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      subscription: (subscription as any) || "free",
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const signin = async (email: string, password: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      subscription: "free",
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        signin,
        logout,
        showAuthModal,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

