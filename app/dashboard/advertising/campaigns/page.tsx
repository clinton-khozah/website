"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, TrendingUp, MousePointerClick, Eye, DollarSign, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

interface Campaign {
  id: string
  name: string
  status: string
  cost_per_click: number
  daily_budget: number | null
  total_clicks: number
  total_impressions: number
  total_spent: number
  start_date: string
  end_date: string | null
}

export default function CampaignsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    cost_per_click: "0.50",
    daily_budget: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/")
          return
        }

        const { data: mentorData } = await supabase
          .from("mentors")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (mentorData) {
          setUserData({ ...mentorData, id: mentorData.id })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!userData?.id) return

      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/mentors/ads/campaigns/${userData.id}/`)
        const data = await response.json()

        if (data.success && data.campaigns) {
          setCampaigns(data.campaigns)
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [userData])

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData) return

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/mentors/ads/campaigns/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentor_id: userData.id,
          name: formData.name,
          cost_per_click: parseFloat(formData.cost_per_click),
          daily_budget: formData.daily_budget ? parseFloat(formData.daily_budget) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh campaigns
        const campaignsResponse = await fetch(`${API_BASE_URL}/mentors/ads/campaigns/${userData.id}/`)
        const campaignsData = await campaignsResponse.json()
        if (campaignsData.success) {
          setCampaigns(campaignsData.campaigns)
        }
        
        setShowCreateForm(false)
        setFormData({ name: "", cost_per_click: "0.50", daily_budget: "" })
        alert("Campaign created successfully!")
      } else {
        alert(data.error || "Failed to create campaign")
      }
    } catch (error) {
      console.error("Error creating campaign:", error)
      alert("Failed to create campaign. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      active: { variant: "default", label: "Active" },
      paused: { variant: "secondary", label: "Paused" },
      archived: { variant: "outline", label: "Archived" },
    }
    const config = variants[status] || { variant: "secondary" as const, label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading && !campaigns.length) {
    return (
      <DashboardLayout userData={userData} role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userData={userData} role="mentor">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ad Campaigns</h1>
            <p className="text-gray-600">Create and manage your advertising campaigns</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
                <CardDescription>
                  Set up a new advertising campaign to promote your services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Summer Promotion 2025"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost_per_click">Cost Per Click ($)</Label>
                      <Input
                        id="cost_per_click"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.cost_per_click}
                        onChange={(e) => setFormData({ ...formData, cost_per_click: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="daily_budget">Daily Budget ($) - Optional</Label>
                      <Input
                        id="daily_budget"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.daily_budget}
                        onChange={(e) => setFormData({ ...formData, daily_budget: e.target.value })}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Campaign
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Campaigns List */}
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
              <p className="text-gray-600 mb-6">Create your first campaign to start advertising</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle>{campaign.name}</CardTitle>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <CardDescription>
                      ${campaign.cost_per_click} per click
                      {campaign.daily_budget && ` • $${campaign.daily_budget}/day limit`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Clicks</p>
                        <p className="text-xl font-bold">{campaign.total_clicks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Impressions</p>
                        <p className="text-xl font-bold">{campaign.total_impressions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Spent</p>
                        <p className="text-xl font-bold">${campaign.total_spent.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/advertising/analytics?campaign=${campaign.id}`)}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

