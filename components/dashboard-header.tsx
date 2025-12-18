"use client"

import { memo, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DollarSign, Menu, X } from "lucide-react"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
                  Iraqi Exchange
                </h1>
                <p className="text-xs md:text-sm" style={{ color: colors.textMuted }}>Real-time currency rates</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
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

            {/* Actions Section */}
            <div className="flex items-center gap-3">
              {/* Desktop Auth Buttons (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Theme Toggle (Always Visible) */}
              <ThemeToggle />

              {/* Mobile Menu Toggle Button (Visible only on Mobile) */}
              <button
                className="md:hidden p-2 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  backgroundColor: colors.backgroundElevated,
                  color: colors.text,
                }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t px-6 py-4 space-y-4 animate-in slide-in-from-top-5 fade-in duration-200 shadow-xl"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? colors.primary : colors.backgroundElevated,
                      color: isActive ? "white" : colors.text,
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: colors.text }}>
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors"
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
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      openAuthModal("signin")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-center"
                    style={{
                      backgroundColor: colors.backgroundElevated,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal("signup")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-center"
                    style={{
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} initialMode={authModalMode} />
    </>
  )
})

export const DashboardHeader = Navbar
