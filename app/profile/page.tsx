"use client"

import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Zap, Crown, TrendingUp, Clock, BarChart3,
  User as UserIcon, Mail, Calendar, Edit2, Save, X, FileText, ArrowLeft, AlertCircle
} from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { user, loading, openAuthModal, updateProfile } = useAuth()
  const { colors, loading: themeLoading } = useTheme()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    date_of_birth: "",
  })

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/");
      openAuthModal();
    } else if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        bio: user.bio || "",
        date_of_birth: user.date_of_birth || "",
      })
    }
  }, [user, loading, router])

  const handleSave = async () => {
    if (!user) return;

    setErrors([]);
    setIsSaving(true);

    const toUpdate: any = {}
    Object.keys(formData).forEach(item => {
      // @ts-ignore
      if (user[item] !== formData[item]) {
        // @ts-ignore
        toUpdate[item] = formData[item];
      }
    });

    if (Object.keys(toUpdate).length === 0) {
      setIsSaving(false);
      setIsEditing(false);
      return;
    }

    const result = await updateProfile(toUpdate);
    setIsSaving(false);

    if (result?.error) {
      setErrors(Array.isArray(result.error) ? result.error : [result.error]);
    } else {
      setIsEditing(false);
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        bio: user.bio || "",
        date_of_birth: user.date_of_birth || "",
      })
    }
    setErrors([]);
    setIsEditing(false);
  }

  if (loading || themeLoading || !colors || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors?.background }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors?.primary }}></div>
      </div>
    )
  }

  const subscriptionBenefits = {
    free: { updateFrequency: "Every 2 hours", historicalData: "None", cities: "All", support: "Community" },
    gold: { updateFrequency: "Every hour", historicalData: "30 days", cities: "All", support: "Email" },
    premium: { updateFrequency: "Real-time", historicalData: "Unlimited", cities: "All", support: "Priority" },
    api: { updateFrequency: "Real-time", historicalData: "Unlimited", cities: "All", support: "Dedicated" },
  }

  const benefits = subscriptionBenefits[user.tier as keyof typeof subscriptionBenefits] || subscriptionBenefits.free

  return (
    <div className="min-h-screen pt-12 pb-12 py-1" style={{ backgroundColor: colors.background }}>
      {/* Custom Scrollbar Styles for Error Box */}
      <style jsx global>{`
        .error-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .error-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .error-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ef4444;
          border-radius: 9999px;
        }
        .error-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 transparent;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 space-y-8">

        {/* Header Section with Return Button */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
              Welcome, {user.first_name ? user.first_name : user.email.split('@')[0]}!
            </h1>
            <p style={{ color: colors.textMuted }}>Manage your profile, subscription, and preferences</p>
          </div>

          {/* Return Button */}
          <Button
            onClick={() => router.push('/')}
            className="rounded-xl gap-2 shadow-sm hover:opacity-80 transition-all"
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* PERSONAL INFORMATION CARD */}
          <Card
            className="p-8 space-y-6"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
              boxShadow: colors.shadow
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: colors.text }}>
                <UserIcon className="h-6 w-6" style={{ color: colors.primary }} />
                Personal Details
              </h2>
              {!isEditing ? (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-9 w-9 p-0 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Edit2 className="h-4 w-4" style={{ color: colors.textMuted }} />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="h-9 w-9 p-0 rounded-full hover:bg-red-500/10"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleSave}
                    className="h-9 w-9 p-0 rounded-full hover:bg-green-500/10"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 text-green-500" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">

              {/* Error Display Section */}
              {isEditing && errors.length > 0 && (
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 max-h-30 overflow-y-auto error-scrollbar animate-in slide-in-from-top-2 fade-in duration-200">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 shrink-0">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <p className="text-sm leading-tight">
                        {error}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>First Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="h-9"
                      style={{ backgroundColor: colors.backgroundElevated, color: colors.text, borderColor: colors.border }}
                    />
                  ) : (
                    <p className="font-medium h-9 flex items-center" style={{ color: colors.text }}>{user.first_name || "-"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>Last Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="h-9"
                      style={{ backgroundColor: colors.backgroundElevated, color: colors.text, borderColor: colors.border }}
                    />
                  ) : (
                    <p className="font-medium h-9 flex items-center" style={{ color: colors.text }}>{user.last_name || "-"}</p>
                  )}
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: colors.textMuted }}>
                  <Mail className="h-3 w-3" /> Email Address
                </label>
                <p className="font-medium h-9 flex items-center opacity-70" style={{ color: colors.text }}>{user.email}</p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>Username</label>
                {isEditing ? (
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-9"
                    style={{ backgroundColor: colors.backgroundElevated, color: colors.text, borderColor: colors.border }}
                  />
                ) : (
                  <p className="font-medium h-9 flex items-center" style={{ color: colors.text }}>{user.username ? `@${user.username}` : "-"}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: colors.textMuted }}>
                  <Calendar className="h-3 w-3" /> Date of Birth
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="h-9"
                    style={{ backgroundColor: colors.backgroundElevated, color: colors.text, borderColor: colors.border }}
                  />
                ) : (
                  <p className="font-medium h-9 flex items-center" style={{ color: colors.text }}>{user.date_of_birth || "-"}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: colors.textMuted }}>
                  <FileText className="h-3 w-3" /> Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: colors.backgroundElevated,
                      color: colors.text,
                      borderColor: colors.border
                    }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                    {user.bio || "No bio added yet."}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* SUBSCRIPTION CARD */}
          <div className="space-y-6">
            <Card
              className="p-8 space-y-6 relative overflow-hidden"
              style={{
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}08`, // Very slight tint
                borderWidth: "1px",
              }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ backgroundColor: colors.primary }}></div>

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1">
                    Current Plan
                  </p>
                  <h2 className="text-4xl font-bold capitalize flex items-center gap-3" style={{ color: colors.text }}>
                    {user.tier}
                    {user.tier === 'gold' && <Crown className="h-8 w-8 text-yellow-500 fill-yellow-500" />}
                    {user.tier === 'premium' && <Zap className="h-8 w-8 text-blue-500 fill-blue-500" />}
                  </h2>
                </div>
                {
                  user.tier !== "premium" &&
                  <Link href="/pricing">
                    <Button
                      className="rounded-xl px-6 font-medium shadow-lg hover:opacity-90 transition-all"
                      style={{
                        backgroundColor: colors.primary,
                        color: "white",
                      }}
                    >
                      Upgrade Plan
                    </Button>
                  </Link>
                }
              </div>

              {/* Quick Stats Mini-Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-6 border-t" style={{ borderColor: `${colors.primary}30` }}>
                <div>
                  <p className="text-xs opacity-70" style={{ color: colors.text }}>Member Since</p>
                  <p className="font-medium" style={{ color: colors.text }}>
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-70" style={{ color: colors.text }}>Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <p className="font-medium" style={{ color: colors.text }}>Active</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Benefits Summary List (Fixed Visibility) */}
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="p-4 flex items-center gap-3"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="p-2.5 rounded-xl bg-blue-500/10 shrink-0">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate" style={{ color: colors.textMuted }}>
                    Updates
                  </p>
                  <p className="font-bold text-sm truncate" style={{ color: colors.text }}>
                    {benefits.updateFrequency}
                  </p>
                </div>
              </Card>

              <Card
                className="p-4 flex items-center gap-3"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="p-2.5 rounded-xl bg-purple-500/10 shrink-0">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate" style={{ color: colors.textMuted }}>
                    History
                  </p>
                  <p className="font-bold text-sm truncate" style={{ color: colors.text }}>
                    {benefits.historicalData}
                  </p>
                </div>
              </Card>

              <Card
                className="p-4 flex items-center gap-3"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="p-2.5 rounded-xl bg-green-500/10 shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate" style={{ color: colors.textMuted }}>
                    Tracking
                  </p>
                  <p className="font-bold text-sm truncate" style={{ color: colors.text }}>
                    {benefits.cities}
                  </p>
                </div>
              </Card>

              <Card
                className="p-4 flex items-center gap-3"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate" style={{ color: colors.textMuted }}>
                    Support
                  </p>
                  <p className="font-bold text-sm truncate" style={{ color: colors.text }}>
                    {benefits.support}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t" style={{ borderColor: colors.border }}>
          <Link href="/">
            <Card
              className="p-4 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${colors.primary}15` }}>
                <TrendingUp className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.text }}>Dashboard</h3>
                <p className="text-xs" style={{ color: colors.textMuted }}>View live rates</p>
              </div>
            </Card>
          </Link>

          <Link href="/visualizations">
            <Card
              className="p-4 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${colors.primary}15` }}>
                <BarChart3 className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.text }}>Analytics</h3>
                <p className="text-xs" style={{ color: colors.textMuted }}>Deep dive data</p>
              </div>
            </Card>
          </Link>

          <Link href="/pricing">
            <Card
              className="p-4 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${colors.primary}15` }}>
                <Crown className="h-6 w-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.text }}>Upgrade</h3>
                <p className="text-xs" style={{ color: colors.textMuted }}>Compare plans</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
