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
  signup: (email: string, password: string, confirmPassword: string, subscription?: string) => Promise<void>
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
      setLoading(false)
    }
  }, [])

  const signup = async (email: string, password: string, confirmPassword: string) => {
    try {
      setLoading(true)

      const apiUrl = "api/auth/sign-up";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        credentials: "include",
        body: JSON.stringify({ email, password1: password, password2: confirmPassword })
      })

      const raw = await response.text();
      console.log("AUTH CONT RAW: ", raw);
      if (response.ok) {
        try {
          const data = JSON.parse(raw);
          setUser(data.user);
          console.log("This is the response we got", data);
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          if (response) {
            console.log("WE DIDN'T GET JSON", raw);
          }
        }
      } else {
        const data = JSON.parse(raw);
        console.log("AUTH CONT DATA: ", data);
        if (data?.error) return data
      }
    } catch (error) {
      console.warn("⚠️ Login failed due to error:", error);
    } finally {
      setLoading(false);
    }
  }

  const signin = async (email: string, password: string) => {
    try {
      setLoading(true)

      const apiUrl = "api/auth/sign-in";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      })

      const raw = await response.text();
      console.log("AUTH CONT RAW: ", raw);
      if (response.ok) {
        try {
          const data = JSON.parse(raw);
          setUser(data.user);
          console.log("This is the response we got", data);
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          if (response) {
            console.log("WE DIDN'T GET JSON", raw);
          }
        }
      }
    } catch (error) {
      console.warn("⚠️ Login failed due to error:", error);
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    console.log("SOMEONE CALLED LOGOUT");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  }

  const closeAuthModal = () => {
    setShowAuthModal(false);
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

