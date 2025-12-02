"use client"

import { memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DollarSign } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "./auth-modal"

interface NavbarProps {
  colors: any
}

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
  { href: "/visualizations", label: "Visualizations" },
]

export const Navbar = memo(function Navbar({ colors }: NavbarProps) {
  const { user, logout, showAuthModal, authModalMode, openAuthModal, closeAuthModal } = useAuth()
  const pathname = usePathname()

  return (
    <>
      <div
        className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
        style={{
          backgroundColor: `${colors.background}95`,
          borderColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: colors.primary }}>
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
                  Iraqi Exchange
                </h1>
                <p style={{ color: colors.textMuted }}>Real-time currency rates</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: isActive ? colors.primary : "transparent",
                      color: isActive ? "white" : colors.text,
                      border: isActive ? "none" : `1px solid transparent`,
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <span
                    className="text-sm px-3 py-2 rounded-xl"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.backgroundElevated,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: colors.backgroundElevated,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal("signin")}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: colors.backgroundElevated,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} initialMode={authModalMode} />
    </>
  )
})

export const DashboardHeader = Navbar
