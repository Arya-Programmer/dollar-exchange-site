"use client"

import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, Crown, TrendingUp, Clock, BarChart3 } from "lucide-react"
import { useEffect } from "react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { colors, loading: themeLoading } = useTheme()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in")
    }
  }, [user, loading, router])

  if (loading || themeLoading || !colors || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors?.background }}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const subscriptionBenefits = {
    free: {
      updateFrequency: "Every 2 hours",
      historicalData: "None",
      cities: "All",
      support: "Community",
    },
    gold: {
      updateFrequency: "Every hour",
      historicalData: "30 days",
      cities: "All",
      support: "Email",
    },
    platinum: {
      updateFrequency: "Real-time",
      historicalData: "Unlimited",
      cities: "All",
      support: "Priority",
    },
    api: {
      updateFrequency: "Real-time",
      historicalData: "Unlimited",
      cities: "All",
      support: "Dedicated",
    },
  }

  const benefits =
    subscriptionBenefits[user.subscription as keyof typeof subscriptionBenefits] || subscriptionBenefits.free

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
            Welcome, {user.email}!
          </h1>
          <p style={{ color: colors.textMuted }}>Manage your subscription and access real-time exchange rates</p>
        </div>

        {/* Current Subscription */}
        <Card
          className="p-8 space-y-6"
          style={{
            borderColor: colors.primary,
            backgroundColor: `${colors.primary}10`,
            borderWidth: "2px",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: colors.textMuted }} className="text-sm">
                Current Subscription
              </p>
              <h2 className="text-3xl font-bold capitalize" style={{ color: colors.text }}>
                {user.subscription}
              </h2>
            </div>
            <Link href="/pricing">
              <Button
                className="rounded-lg font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: "white",
                }}
              >
                Manage Plan
              </Button>
            </Link>
          </div>
        </Card>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-6 space-y-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6" style={{ color: colors.primary }} />
              <div>
                <p style={{ color: colors.textMuted }} className="text-sm">
                  Update Frequency
                </p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>
                  {benefits.updateFrequency}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 space-y-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" style={{ color: colors.primary }} />
              <div>
                <p style={{ color: colors.textMuted }} className="text-sm">
                  Historical Data
                </p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>
                  {benefits.historicalData}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 space-y-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6" style={{ color: colors.primary }} />
              <div>
                <p style={{ color: colors.textMuted }} className="text-sm">
                  Cities Tracked
                </p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>
                  {benefits.cities}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 space-y-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6" style={{ color: colors.primary }} />
              <div>
                <p style={{ color: colors.textMuted }} className="text-sm">
                  Support Level
                </p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>
                  {benefits.support}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/">
            <Card
              className="p-6 text-center cursor-pointer hover:scale-105 transition-transform space-y-3"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <TrendingUp className="h-8 w-8 mx-auto" style={{ color: colors.primary }} />
              <h3 className="font-bold" style={{ color: colors.text }}>
                View Dashboard
              </h3>
              <p style={{ color: colors.textMuted }} className="text-sm">
                Check live rates
              </p>
            </Card>
          </Link>

          <Link href="/visualizations">
            <Card
              className="p-6 text-center cursor-pointer hover:scale-105 transition-transform space-y-3"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <BarChart3 className="h-8 w-8 mx-auto" style={{ color: colors.primary }} />
              <h3 className="font-bold" style={{ color: colors.text }}>
                Analytics
              </h3>
              <p style={{ color: colors.textMuted }} className="text-sm">
                Explore visualizations
              </p>
            </Card>
          </Link>

          <Link href="/pricing">
            <Card
              className="p-6 text-center cursor-pointer hover:scale-105 transition-transform space-y-3"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <Crown className="h-8 w-8 mx-auto" style={{ color: colors.primary }} />
              <h3 className="font-bold" style={{ color: colors.text }}>
                Upgrade
              </h3>
              <p style={{ color: colors.textMuted }} className="text-sm">
                Explore plans
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
