"use client"

import type React from "react"
import { useState } from "react"

import { CheckCircle, Zap, Crown, Code } from "lucide-react"

import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/globals/navbar"

import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"

export default function Pricing() {
  const { colors, loading: themeLoading } = useTheme()
  const { user, openAuthModal } = useAuth()
  const [activeTab, setActiveTab] = useState<"user" | "api">("user")
  const [apiFormData, setApiFormData] = useState({ name: "", email: "", company: "", useCase: "" })
  const [submitted, setSubmitted] = useState(false)

  if (themeLoading || !colors) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors?.background }}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const userTiers = [
    {
      name: "Free",
      icon: Zap,
      price: "0 IQD",
      period: "Forever",
      description: "Get started with essential features",
      features: [
        "Price updates every 2 hours",
        "No historical data",
        "All Iraqi cities",
        "Current rates only",
        "Community support",
      ],
      highlighted: user?.tier == "free" || false
    },
    {
      name: "Gold",
      icon: Crown,
      price: "1000 IQD",
      period: "/month",
      description: "Advanced tracking and insights",
      features: [
        "Price updates every hour",
        "Historical data (30 days)",
        "All Iraqi cities",
        "Rate change notifications",
        "Email support",
      ],
      highlighted: user?.tier == "gold" || false
    },
    {
      name: "Premium",
      icon: Crown,
      price: "2500 IQD",
      period: "/month",
      description: "Professional-grade access",
      features: [
        "Real-time price updates",
        "Full historical data",
        "All Iraqi cities",
        "Advanced analytics",
        "Priority support",
        "API access (limited)",
      ],
      highlighted: user?.tier == "premium" || false
    },
  ]

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg" style={{ color: colors.textMuted }}>
              Choose the perfect plan for your needs
            </p>
          </div>

          {/* Tab Selector - styled like city buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab("user")}
              className="px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: activeTab === "user" ? colors.primary : colors.backgroundElevated,
                color: activeTab === "user" ? "white" : colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              User Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className="px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: activeTab === "api" ? colors.primary : colors.backgroundElevated,
                color: activeTab === "api" ? "white" : colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              API Subscription
            </button>
          </div>

          {/* User Subscriptions */}
          {activeTab === "user" && (
            <div className="grid md:grid-cols-3 gap-6">
              {userTiers.map((tier) => {
                const Icon = tier.icon
                return (
                  <Card
                    key={tier.name}
                    className="p-8 flex flex-col transition-all duration-300 hover:scale-105 rounded-3xl"
                    style={{
                      borderColor: tier.highlighted ? colors.primary : colors.border,
                      backgroundColor: colors.card,
                      borderWidth: tier.highlighted ? "2px" : "1px",
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl" style={{ backgroundColor: `${colors.primary}20` }}>
                          <Icon className="h-6 w-6" style={{ color: colors.primary }} />
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
                          {tier.name}
                        </h3>
                      </div>

                      <p style={{ color: colors.textMuted }}>{tier.description}</p>

                      <div className="space-y-1">
                        <div className="text-4xl font-bold" style={{ color: colors.primary }}>
                          {tier.price}
                        </div>
                        <p style={{ color: colors.textMuted }}>{tier.period}</p>
                      </div>

                      <div className="space-y-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                        {tier.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: colors.primary }} />
                            <span style={{ color: colors.text }}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="w-full mt-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: tier.highlighted ? colors.primary : colors.backgroundElevated,
                        color: tier.highlighted ? "white" : colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                      onClick={() => {
                        if (!user && !tier.highlighted) {
                          openAuthModal();
                        }
                      }}
                    >
                      {user ? tier.highlighted ? "Current Plan" : "Select Plan" : "Sign Up"}
                    </button>
                  </Card>
                )
              })}
            </div>
          )}

          {/* API Subscription */}
          {activeTab === "api" && (
            <div className="max-w-2xl mx-auto">
              <Card
                className="p-8 rounded-3xl"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl" style={{ backgroundColor: `${colors.primary}20` }}>
                      <Code className="h-8 w-8" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
                      API Subscription
                    </h3>
                  </div>

                  <p style={{ color: colors.textMuted }}>
                    Request API access for unlimited real-time exchange rate data integration
                  </p>

                  {!user ? (
                    <div
                      className="p-6 rounded-2xl text-center space-y-4"
                      style={{ backgroundColor: colors.backgroundElevated, border: `1px solid ${colors.border}` }}
                    >
                      <p style={{ color: colors.text }}>Sign in to request API access</p>
                      <Link href="/sign-in">
                        <button
                          className="px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: colors.primary,
                            color: "white",
                          }}
                        >
                          Sign In Now
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleApiSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: colors.text }}>
                          Full Name
                        </label>
                        <Input
                          required
                          value={apiFormData.name}
                          onChange={(e) => setApiFormData({ ...apiFormData, name: e.target.value })}
                          className="rounded-xl"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.backgroundElevated,
                            color: colors.text,
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: colors.text }}>
                          Email
                        </label>
                        <Input
                          type="email"
                          required
                          defaultValue={user.email}
                          onChange={(e) => setApiFormData({ ...apiFormData, email: e.target.value })}
                          className="rounded-xl"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.backgroundElevated,
                            color: colors.text,
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: colors.text }}>
                          Company/Organization
                        </label>
                        <Input
                          required
                          value={apiFormData.company}
                          onChange={(e) => setApiFormData({ ...apiFormData, company: e.target.value })}
                          className="rounded-xl"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.backgroundElevated,
                            color: colors.text,
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: colors.text }}>
                          Use Case
                        </label>
                        <textarea
                          required
                          value={apiFormData.useCase}
                          onChange={(e) => setApiFormData({ ...apiFormData, useCase: e.target.value })}
                          className="w-full p-3 rounded-xl border min-h-[120px] resize-none"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.backgroundElevated,
                            color: colors.text,
                          }}
                          placeholder="Describe how you plan to use the API..."
                        />
                      </div>

                      {submitted && (
                        <div
                          className="p-4 rounded-xl flex items-center gap-2"
                          style={{ backgroundColor: `rgb(34, 197, 94, 0.1)` }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span style={{ color: "rgb(34, 197, 94)" }}>
                            Request submitted! We'll review and get back to you soon.
                          </span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: colors.primary,
                          color: "white",
                        }}
                      >
                        Submit Request
                      </button>
                    </form>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
