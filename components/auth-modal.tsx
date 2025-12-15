"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, X, Clock, Database, Zap } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
}

const benefits = [
  { icon: Clock, text: "Real-time exchange rate updates" },
  { icon: Database, text: "Access to historical data" },
  { icon: Zap, text: "Advanced visualizations & charts" },
]

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const { signup, signin } = useAuth()
  const { colors } = useTheme()
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setErrors([])
    }
  }, [isOpen, initialMode])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen || !colors) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!email) {
      setErrors(prev => [...prev, "Email is required"]);
      return
    }
    if (!password) {
      setErrors(prev => [...prev, "Password is required"]);
      return
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        setErrors(prev => [...prev, "Please confirm your password"]);
        return
      }
      if (password !== confirmPassword) {
        setErrors(prev => [...prev, "Passwords do not match"]);
        return
      }
      if (password.length < 6) {
        setErrors(prev => [...prev, "Password must be at least 6 characters"]);
        return
      }
    }

    try {
      setLoading(true)
      if (mode === "signup") {
        const data = await signup(email, password, confirmPassword)
        if (data?.error) throw data;
      } else {
        await signin(email, password)
      }
      onClose()
    } catch (err: any) {
      console.log(err);
      setErrors(err.error || ["An unexpected error occurred"]);
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setErrors([]);
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-all duration-300"
        style={{ backgroundColor: `${colors.background}90` }}
        onClick={onClose}
      />
      {/* Custom Scrollbar Styles - Adapted from CityTrendChart */}
      <style jsx global>{`
        .error-scrollbar::-webkit-scrollbar {
          width: 4px; /* Thin vertical width */
        }
        .error-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .error-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ef4444; /* Tailwind red-500 */
          border-radius: 9999px; /* Pill shape */
        }
        .error-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 transparent;
        }
      `}</style>

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:opacity-70 z-20"
          style={{ color: colors.textMuted }}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Benefits Section - HIDDEN ON MOBILE (hidden md:block) */}
          <div
            className="hidden md:block p-8 md:w-2/5"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
            }}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              {mode === "signin" ? "Welcome Back" : "Join Iraqi Exchange"}
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <benefit.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">{benefit.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-white/70">
                {mode === "signin"
                  ? "Sign in to access your personalized dashboard and saved preferences."
                  : "Create a free account to unlock premium features and historical data."}
              </p>
            </div>
          </div>

          {/* Form Section - Full width on mobile */}
          <div className="p-6 md:p-8 w-full md:w-3/5 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                {mode === "signin" ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                {mode === "signin" ? "Enter your credentials to continue" : "Fill in your details to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: colors.text }}>
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl h-11"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundElevated,
                    color: colors.text,
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: colors.text }}>
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-11"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundElevated,
                    color: colors.text,
                  }}
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl h-11"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.backgroundElevated,
                      color: colors.text,
                    }}
                  />
                </div>
              )}

              {errors.length > 0 && (
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 max-h-[70px] overflow-y-auto error-scrollbar">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 shrink-0">
                      {/* shrink-0 prevents the icon from squishing if text is long */}
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <p className="text-sm leading-tight">
                        {error}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl h-11 font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: colors.primary, color: "white" }}
              >
                {loading
                  ? mode === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: colors.textMuted }}>
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={switchMode} className="font-medium hover:underline" style={{ color: colors.primary }}>
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
