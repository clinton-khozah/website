"use client"

import * as React from "react"
import { X, Save, Loader2, CheckCircle2, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MentorSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userData: any
  onUpdate?: () => void
}

export function MentorSettingsModal({
  isOpen,
  onClose,
  userData,
  onUpdate,
}: MentorSettingsModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    availability: userData?.availability || "Available now",
    hourly_rate: userData?.hourly_rate || 0,
    title: userData?.title || "",
    description: userData?.description || "",
    experience: userData?.experience || "",
    specialization: Array.isArray(userData?.specialization)
      ? userData.specialization.join(", ")
      : typeof userData?.specialization === "string"
      ? userData.specialization.replace(/[\[\]"]/g, "") || ""
      : "",
    languages: Array.isArray(userData?.languages)
      ? userData.languages.join(", ")
      : typeof userData?.languages === "string"
      ? userData.languages.replace(/[\[\]"]/g, "") || ""
      : "",
  })

  React.useEffect(() => {
    if (userData) {
      setFormData({
        availability: userData?.availability || "Available now",
        hourly_rate: userData?.hourly_rate || 0,
        title: userData?.title || "",
        description: userData?.description || "",
        experience: userData?.experience || "",
        specialization: Array.isArray(userData?.specialization)
          ? userData.specialization.join(", ")
          : typeof userData?.specialization === "string"
          ? userData.specialization.replace(/[\[\]"]/g, "") || ""
          : "",
        languages: Array.isArray(userData?.languages)
          ? userData.languages.join(", ")
          : typeof userData?.languages === "string"
          ? userData.languages.replace(/[\[\]"]/g, "") || ""
          : "",
      })
    }
  }, [userData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData) return

    try {
      setIsLoading(true)

      const updates: Record<string, any> = {
        availability: formData.availability,
        hourly_rate: parseFloat(formData.hourly_rate.toString()) || 0,
        title: formData.title.trim(),
        description: formData.description.trim(),
        experience: formData.experience.toString(),
        specialization: formData.specialization.trim()
          ? formData.specialization.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        languages: formData.languages.trim()
          ? formData.languages.split(",").map((l) => l.trim()).filter(Boolean)
          : [],
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("mentors")
        .update(updates)
        .eq("user_id", userData.id)

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        if (onUpdate) onUpdate()
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error updating settings:", error)
      alert("Failed to update settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Profile Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your professional information and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Availability Status */}
                  <div>
                    <Label htmlFor="availability" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Availability Status
                    </Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData({ ...formData, availability: value })}
                    >
                      <SelectTrigger id="availability" className="w-full">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available now">Available now</SelectItem>
                        <SelectItem value="Available soon">Available soon</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="Away">Away</SelectItem>
                        <SelectItem value="Not available">Not available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Professional Title */}
                  <div>
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Professional Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Full Stack Developer, Business Analyst"
                      className="w-full"
                    />
                  </div>

                  {/* Description/Bio */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Description / Bio
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell students about your experience and expertise..."
                      rows={4}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>
                    Your experience, rates, and specializations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Hourly Rate */}
                    <div>
                      <Label htmlFor="hourly_rate" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Hourly Rate ($)
                      </Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.hourly_rate}
                        onChange={(e) =>
                          setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="Enter hourly rate"
                        className="w-full"
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Enter years of experience"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <Label htmlFor="specialization" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Specializations
                    </Label>
                    <Input
                      id="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g., Python, React, AWS"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple specializations with commas
                    </p>
                  </div>

                  {/* Languages */}
                  <div>
                    <Label htmlFor="languages" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Languages Spoken
                    </Label>
                    <Input
                      id="languages"
                      type="text"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      placeholder="e.g., English, Spanish, French"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple languages with commas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Settings updated successfully!</span>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

