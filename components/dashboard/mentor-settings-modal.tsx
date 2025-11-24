"use client"

import * as React from "react"
import { 
  X, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Settings,
  User,
  Bell,
  Shield,
  HelpCircle,
  ArrowLeft,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Trash2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

// Bank data by country
const BANKS_BY_COUNTRY: Record<string, Array<{ name: string; logo?: string; code?: string }>> = {
  'south africa': [
    { name: 'First National Bank (FNB)', code: 'FNB' },
    { name: 'Standard Bank', code: 'STD' },
    { name: 'Absa Bank', code: 'ABSA' },
    { name: 'Nedbank', code: 'NED' },
    { name: 'Capitec Bank', code: 'CAP' },
    { name: 'Investec', code: 'INV' },
  ],
  'za': [
    { name: 'First National Bank (FNB)', code: 'FNB' },
    { name: 'Standard Bank', code: 'STD' },
    { name: 'Absa Bank', code: 'ABSA' },
    { name: 'Nedbank', code: 'NED' },
    { name: 'Capitec Bank', code: 'CAP' },
    { name: 'Investec', code: 'INV' },
  ],
  'united states': [
    { name: 'Chase Bank', code: 'CHASE' },
    { name: 'Bank of America', code: 'BOA' },
    { name: 'Wells Fargo', code: 'WF' },
    { name: 'Citibank', code: 'CITI' },
    { name: 'US Bank', code: 'USB' },
    { name: 'PNC Bank', code: 'PNC' },
    { name: 'Capital One', code: 'CO' },
    { name: 'TD Bank', code: 'TD' },
  ],
  'us': [
    { name: 'Chase Bank', code: 'CHASE' },
    { name: 'Bank of America', code: 'BOA' },
    { name: 'Wells Fargo', code: 'WF' },
    { name: 'Citibank', code: 'CITI' },
    { name: 'US Bank', code: 'USB' },
    { name: 'PNC Bank', code: 'PNC' },
    { name: 'Capital One', code: 'CO' },
    { name: 'TD Bank', code: 'TD' },
  ],
  'united kingdom': [
    { name: 'Barclays', code: 'BARCLAYS' },
    { name: 'HSBC', code: 'HSBC' },
    { name: 'Lloyds Bank', code: 'LLOYDS' },
    { name: 'NatWest', code: 'NATWEST' },
    { name: 'Santander UK', code: 'SANTANDER' },
    { name: 'Royal Bank of Scotland', code: 'RBS' },
  ],
  'uk': [
    { name: 'Barclays', code: 'BARCLAYS' },
    { name: 'HSBC', code: 'HSBC' },
    { name: 'Lloyds Bank', code: 'LLOYDS' },
    { name: 'NatWest', code: 'NATWEST' },
    { name: 'Santander UK', code: 'SANTANDER' },
    { name: 'Royal Bank of Scotland', code: 'RBS' },
  ],
  'canada': [
    { name: 'Royal Bank of Canada (RBC)', code: 'RBC' },
    { name: 'TD Canada Trust', code: 'TD' },
    { name: 'Scotiabank', code: 'SCOTIA' },
    { name: 'Bank of Montreal (BMO)', code: 'BMO' },
    { name: 'CIBC', code: 'CIBC' },
    { name: 'National Bank of Canada', code: 'NBC' },
  ],
  'ca': [
    { name: 'Royal Bank of Canada (RBC)', code: 'RBC' },
    { name: 'TD Canada Trust', code: 'TD' },
    { name: 'Scotiabank', code: 'SCOTIA' },
    { name: 'Bank of Montreal (BMO)', code: 'BMO' },
    { name: 'CIBC', code: 'CIBC' },
    { name: 'National Bank of Canada', code: 'NBC' },
  ],
  'australia': [
    { name: 'Commonwealth Bank', code: 'CBA' },
    { name: 'Westpac', code: 'WESTPAC' },
    { name: 'ANZ', code: 'ANZ' },
    { name: 'National Australia Bank (NAB)', code: 'NAB' },
  ],
  'au': [
    { name: 'Commonwealth Bank', code: 'CBA' },
    { name: 'Westpac', code: 'WESTPAC' },
    { name: 'ANZ', code: 'ANZ' },
    { name: 'National Australia Bank (NAB)', code: 'NAB' },
  ],
  'nigeria': [
    { name: 'Access Bank', code: 'ACCESS' },
    { name: 'GTBank', code: 'GTB' },
    { name: 'First Bank of Nigeria', code: 'FBN' },
    { name: 'Zenith Bank', code: 'ZENITH' },
    { name: 'United Bank for Africa (UBA)', code: 'UBA' },
  ],
  'ng': [
    { name: 'Access Bank', code: 'ACCESS' },
    { name: 'GTBank', code: 'GTB' },
    { name: 'First Bank of Nigeria', code: 'FBN' },
    { name: 'Zenith Bank', code: 'ZENITH' },
    { name: 'United Bank for Africa (UBA)', code: 'UBA' },
  ],
  'kenya': [
    { name: 'Equity Bank', code: 'EQUITY' },
    { name: 'KCB Bank', code: 'KCB' },
    { name: 'Cooperative Bank', code: 'COOP' },
    { name: 'Standard Chartered Kenya', code: 'SCK' },
  ],
  'ke': [
    { name: 'Equity Bank', code: 'EQUITY' },
    { name: 'KCB Bank', code: 'KCB' },
    { name: 'Cooperative Bank', code: 'COOP' },
    { name: 'Standard Chartered Kenya', code: 'SCK' },
  ],
}

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
  const [activeTab, setActiveTab] = React.useState("profile")
  
  // Profile form state
  const [profileData, setProfileData] = React.useState({
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
    country: userData?.country || "",
  })

  // Account settings
  const [accountSettings, setAccountSettings] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    marketingEmails: false,
  })

  // Payment method settings
  const [paymentMethod, setPaymentMethod] = React.useState<string>(userData?.payment_method || '')
  const [paymentAccountDetails, setPaymentAccountDetails] = React.useState<any>(() => {
    try {
      const details = userData?.payment_account_details
      if (details) {
        return typeof details === 'string' ? JSON.parse(details) : details
      }
    } catch (e) {
      console.error('Error parsing payment account details:', e)
    }
    return {}
  })
  
  // Payment form state
  const [paymentFormData, setPaymentFormData] = React.useState({
    // Bank transfer
    bank_name: paymentAccountDetails?.bank_name || '',
    bank_name_other: paymentAccountDetails?.bank_name_other || '',
    account_holder: paymentAccountDetails?.account_holder || '',
    account_number: paymentAccountDetails?.account_number || '',
    routing_number: paymentAccountDetails?.routing_number || '',
    swift_code: paymentAccountDetails?.swift_code || '',
    iban: paymentAccountDetails?.iban || '',
    // PayPal/Stripe
    payment_email: paymentAccountDetails?.email || '',
    // Crypto
    wallet_address: paymentAccountDetails?.wallet_address || '',
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    sessionBookings: true,
    paymentNotifications: true,
    messageNotifications: true,
    studentReviews: true,
    weeklyReports: true,
    monthlyReports: false,
  })

  // Detect user location for country
  React.useEffect(() => {
    if (!profileData.country && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            )
            const data = await response.json()
            if (data.countryName) {
              setProfileData(prev => ({ ...prev, country: data.countryName }))
            }
          } catch (error) {
            console.error('Error fetching location:', error)
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }, [profileData.country])

  React.useEffect(() => {
    if (userData) {
      setProfileData({
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
        country: userData?.country || "",
      })

      // Update payment method and details
      setPaymentMethod(userData.payment_method || '')
      try {
        const details = userData.payment_account_details
        if (details) {
          const parsed = typeof details === 'string' ? JSON.parse(details) : details
          setPaymentAccountDetails(parsed)
          setPaymentFormData({
            bank_name: parsed.bank_name || '',
            bank_name_other: parsed.bank_name_other || '',
            account_holder: parsed.account_holder || '',
            account_number: parsed.account_number || '',
            routing_number: parsed.routing_number || '',
            swift_code: parsed.swift_code || '',
            iban: parsed.iban || '',
            payment_email: parsed.email || '',
            wallet_address: parsed.wallet_address || '',
          })
        }
      } catch (e) {
        console.error('Error parsing payment account details:', e)
      }
    }
  }, [userData])

  const handleSaveProfile = async () => {
    if (!userData) return

    try {
      setIsLoading(true)

      const updates: Record<string, any> = {
        availability: profileData.availability,
        hourly_rate: parseFloat(profileData.hourly_rate.toString()) || 0,
        title: profileData.title.trim(),
        description: profileData.description.trim(),
        experience: profileData.experience.toString(),
        specialization: profileData.specialization.trim()
          ? profileData.specialization.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        languages: profileData.languages.trim()
          ? profileData.languages.split(",").map((l) => l.trim()).filter(Boolean)
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
      }, 2000)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAccount = async () => {
    try {
      setIsLoading(true)

      if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
        alert("New passwords don't match")
        return
      }

      if (accountSettings.newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: accountSettings.newPassword
        })
        if (error) throw error
      }

      setAccountSettings(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error updating account:", error)
      alert("Error updating account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      setIsLoading(true)
      // Save notification preferences (you can store these in a user_settings table)
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error saving notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      // Implement account deletion logic here
      alert("Account deletion is not yet implemented. Please contact support.")
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("Error deleting account. Please try again.")
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
          initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
          animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "90%",
            maxWidth: "72rem",
            maxHeight: "90vh",
          }}
          className="overflow-hidden bg-white rounded-xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-sm text-gray-600">Manage your account settings, preferences, and get support</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Settings saved successfully!</span>
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Support
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your professional information and availability</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Availability Status */}
                    <div>
                      <Label htmlFor="availability" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Availability Status
                      </Label>
                      <Select
                        value={profileData.availability}
                        onValueChange={(value) => setProfileData({ ...profileData, availability: value })}
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
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
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
                        value={profileData.description}
                        onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                        placeholder="Tell students about your experience and expertise..."
                        rows={4}
                        className="w-full"
                      />
                    </div>

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
                          value={profileData.hourly_rate}
                          onChange={(e) =>
                            setProfileData({ ...profileData, hourly_rate: parseFloat(e.target.value) || 0 })
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
                          value={profileData.experience}
                          onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
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
                        value={profileData.specialization}
                        onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                        placeholder="e.g., Python, React, AWS (comma-separated)"
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
                        value={profileData.languages}
                        onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
                        placeholder="e.g., English, Spanish, French (comma-separated)"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate multiple languages with commas
                      </p>
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        placeholder="e.g., South Africa, United States"
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
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
                  </CardContent>
                </Card>

                {/* Payment Method Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Configure how you want to receive your earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900">Bank Account Details</h4>
                        <div>
                          <Label htmlFor="bank_name">Bank Name</Label>
                          {(() => {
                            const countryKey = profileData.country?.toLowerCase() || ''
                            const banks = BANKS_BY_COUNTRY[countryKey] || []
                            
                            if (banks.length > 0) {
                              return (
                                <Select
                                  value={paymentFormData.bank_name}
                                  onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, bank_name: value }))}
                                >
                                  <SelectTrigger id="bank_name">
                                    <SelectValue placeholder="Select your bank" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {banks.map((bank) => (
                                      <SelectItem key={bank.code || bank.name} value={bank.name}>
                                        <div className="flex items-center gap-2 py-1">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                            {bank.code || bank.name.charAt(0)}
                                          </div>
                                          <span>{bank.name}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="other">
                                      <div className="flex items-center gap-2 py-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                                          +
                                        </div>
                                        <span>Other Bank</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )
                            } else {
                              return (
                                <Input
                                  id="bank_name"
                                  value={paymentFormData.bank_name}
                                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                                  placeholder="Enter bank name"
                                />
                              )
                            }
                          })()}
                          {paymentFormData.bank_name === 'other' && (
                            <Input
                              id="bank_name_other"
                              value={paymentFormData.bank_name_other || ''}
                              onChange={(e) => setPaymentFormData(prev => ({ ...prev, bank_name_other: e.target.value }))}
                              placeholder="Enter bank name"
                              className="mt-2"
                            />
                          )}
                          {profileData.country && !BANKS_BY_COUNTRY[profileData.country.toLowerCase()] && (
                            <p className="text-xs text-gray-500 mt-1">
                              Bank list not available for {profileData.country}. Please enter manually.
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="account_holder">Account Holder Name</Label>
                          <Input
                            id="account_holder"
                            value={paymentFormData.account_holder}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, account_holder: e.target.value }))}
                            placeholder="Full name on account"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="account_number">Account Number</Label>
                            <Input
                              id="account_number"
                              type="text"
                              value={paymentFormData.account_number}
                              onChange={(e) => setPaymentFormData(prev => ({ ...prev, account_number: e.target.value }))}
                              placeholder="Account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="routing_number">
                              {profileData.country?.toLowerCase().includes('south africa') || profileData.country?.toLowerCase().includes('za') 
                                ? 'Branch Code' 
                                : profileData.country?.toLowerCase().includes('uk') || profileData.country?.toLowerCase().includes('united kingdom')
                                ? 'Sort Code'
                                : profileData.country?.toLowerCase().includes('canada') || profileData.country?.toLowerCase().includes('ca')
                                ? 'Transit Number'
                                : 'Routing Number'}
                            </Label>
                            <Input
                              id="routing_number"
                              type="text"
                              value={paymentFormData.routing_number}
                              onChange={(e) => setPaymentFormData(prev => ({ ...prev, routing_number: e.target.value }))}
                              placeholder={
                                profileData.country?.toLowerCase().includes('south africa') || profileData.country?.toLowerCase().includes('za')
                                  ? 'Branch code (e.g., 250655)'
                                  : profileData.country?.toLowerCase().includes('uk') || profileData.country?.toLowerCase().includes('united kingdom')
                                  ? 'Sort code (e.g., 12-34-56)'
                                  : profileData.country?.toLowerCase().includes('canada') || profileData.country?.toLowerCase().includes('ca')
                                  ? 'Transit number'
                                  : 'Routing number'
                              }
                            />
                          </div>
                        </div>
                        {/* SWIFT/IBAN for international transfers */}
                        {(profileData.country && !['united states', 'us', 'south africa', 'za'].includes(profileData.country.toLowerCase())) && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="swift_code">SWIFT/BIC Code</Label>
                              <Input
                                id="swift_code"
                                type="text"
                                value={paymentFormData.swift_code || ''}
                                onChange={(e) => setPaymentFormData(prev => ({ ...prev, swift_code: e.target.value }))}
                                placeholder="e.g., CHASUS33"
                              />
                            </div>
                            {(profileData.country?.toLowerCase().includes('europe') || 
                              ['germany', 'france', 'spain', 'italy', 'netherlands', 'belgium'].some(c => profileData.country?.toLowerCase().includes(c))) && (
                              <div>
                                <Label htmlFor="iban">IBAN</Label>
                                <Input
                                  id="iban"
                                  type="text"
                                  value={paymentFormData.iban || ''}
                                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, iban: e.target.value }))}
                                  placeholder="e.g., GB82 WEST 1234 5698 7654 32"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {(paymentMethod === 'paypal' || paymentMethod === 'stripe') && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900">{paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'} Email</h4>
                        <div>
                          <Label htmlFor="payment_email">Email Address</Label>
                          <Input
                            id="payment_email"
                            type="email"
                            value={paymentFormData.payment_email}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, payment_email: e.target.value }))}
                            placeholder={`Your ${paymentMethod} email`}
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'crypto' && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900">Cryptocurrency Wallet</h4>
                        <div>
                          <Label htmlFor="wallet_address">Wallet Address</Label>
                          <Input
                            id="wallet_address"
                            value={paymentFormData.wallet_address}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, wallet_address: e.target.value }))}
                            placeholder="0x..."
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod && (
                      <div className="flex justify-end">
                        <Button 
                          onClick={async () => {
                            try {
                              setIsLoading(true)
                              
                              // Build payment account details based on method
                              let accountDetails: any = {}
                              if (paymentMethod === 'bank_transfer') {
                                accountDetails = {
                                  type: 'bank_transfer',
                                  bank_name: paymentFormData.bank_name === 'other' 
                                    ? paymentFormData.bank_name_other 
                                    : paymentFormData.bank_name,
                                  account_holder: paymentFormData.account_holder,
                                  account_number: paymentFormData.account_number,
                                  routing_number: paymentFormData.routing_number,
                                }
                                if (paymentFormData.swift_code) {
                                  accountDetails.swift_code = paymentFormData.swift_code
                                }
                                if (paymentFormData.iban) {
                                  accountDetails.iban = paymentFormData.iban
                                }
                              } else if (paymentMethod === 'paypal' || paymentMethod === 'stripe') {
                                accountDetails = {
                                  type: paymentMethod,
                                  email: paymentFormData.payment_email,
                                }
                              } else if (paymentMethod === 'crypto') {
                                accountDetails = {
                                  type: 'crypto',
                                  wallet_address: paymentFormData.wallet_address,
                                }
                              }

                              // Update mentor record - use user_id to match Supabase Auth user
                              const { error } = await supabase
                                .from('mentors')
                                .update({
                                  payment_method: paymentMethod,
                                  payment_account_details: accountDetails,
                                })
                                .eq('user_id', userData.id)

                              if (error) throw error

                              setShowSuccess(true)
                              setTimeout(() => setShowSuccess(false), 2000)
                              
                              if (onUpdate) onUpdate()
                            } catch (error) {
                              console.error('Error saving payment method:', error)
                              alert('Error saving payment method. Please try again.')
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Payment Method
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={accountSettings.currentPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveAccount} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Configure how you want to receive your earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900">Bank Account Details</h4>
                        <div>
                          <Label htmlFor="bank_name">Bank Name</Label>
                          <Input
                            id="bank_name"
                            value={paymentFormData.bank_name}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                            placeholder="e.g., Chase Bank"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account_holder">Account Holder Name</Label>
                          <Input
                            id="account_holder"
                            value={paymentFormData.account_holder}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, account_holder: e.target.value }))}
                            placeholder="Full name on account"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account_number">Account Number</Label>
                          <Input
                            id="account_number"
                            type="text"
                            value={paymentFormData.account_number}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, account_number: e.target.value }))}
                            placeholder="Account number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="routing_number">Routing Number</Label>
                          <Input
                            id="routing_number"
                            type="text"
                            value={paymentFormData.routing_number}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, routing_number: e.target.value }))}
                            placeholder="Routing number"
                          />
                        </div>
                      </div>
                    )}

                    {(paymentMethod === 'paypal' || paymentMethod === 'stripe') && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900">{paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'} Email</h4>
                        <div>
                          <Label htmlFor="payment_email">Email Address</Label>
                          <Input
                            id="payment_email"
                            type="email"
                            value={paymentFormData.payment_email}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, payment_email: e.target.value }))}
                            placeholder={`Your ${paymentMethod} email`}
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'crypto' && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900">Cryptocurrency Wallet</h4>
                        <div>
                          <Label htmlFor="wallet_address">Wallet Address</Label>
                          <Input
                            id="wallet_address"
                            value={paymentFormData.wallet_address}
                            onChange={(e) => setPaymentFormData(prev => ({ ...prev, wallet_address: e.target.value }))}
                            placeholder="0x..."
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod && (
                      <div className="flex justify-end">
                        <Button 
                          onClick={async () => {
                            try {
                              setIsLoading(true)
                              
                              // Build payment account details based on method
                              let accountDetails: any = {}
                              if (paymentMethod === 'bank_transfer') {
                                accountDetails = {
                                  type: 'bank_transfer',
                                  bank_name: paymentFormData.bank_name === 'other' 
                                    ? paymentFormData.bank_name_other 
                                    : paymentFormData.bank_name,
                                  account_holder: paymentFormData.account_holder,
                                  account_number: paymentFormData.account_number,
                                  routing_number: paymentFormData.routing_number,
                                }
                              } else if (paymentMethod === 'paypal' || paymentMethod === 'stripe') {
                                accountDetails = {
                                  type: paymentMethod,
                                  email: paymentFormData.payment_email,
                                }
                              } else if (paymentMethod === 'crypto') {
                                accountDetails = {
                                  type: 'crypto',
                                  wallet_address: paymentFormData.wallet_address,
                                }
                              }

                              // Update mentor record - use user_id to match Supabase Auth user
                              const { error } = await supabase
                                .from('mentors')
                                .update({
                                  payment_method: paymentMethod,
                                  payment_account_details: accountDetails,
                                })
                                .eq('user_id', userData.id)

                              if (error) throw error

                              setShowSuccess(true)
                              setTimeout(() => setShowSuccess(false), 2000)
                              
                              if (onUpdate) onUpdate()
                            } catch (error) {
                              console.error('Error saving payment method:', error)
                              alert('Error saving payment method. Please try again.')
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Payment Method
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Preferences</CardTitle>
                    <CardDescription>Manage your email notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive email notifications about your account</p>
                      </div>
                      <Switch
                        checked={accountSettings.emailNotifications}
                        onCheckedChange={(checked) => setAccountSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                      </div>
                      <Switch
                        checked={accountSettings.marketingEmails}
                        onCheckedChange={(checked) => setAccountSettings(prev => ({ ...prev, marketingEmails: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Session Bookings</Label>
                          <p className="text-sm text-gray-500">Get notified when students book your sessions</p>
                        </div>
                        <Switch
                          checked={notificationSettings.sessionBookings}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, sessionBookings: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Payment Notifications</Label>
                          <p className="text-sm text-gray-500">Receive alerts about payments and earnings</p>
                        </div>
                        <Switch
                          checked={notificationSettings.paymentNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Message Notifications</Label>
                          <p className="text-sm text-gray-500">Receive alerts for new messages</p>
                        </div>
                        <Switch
                          checked={notificationSettings.messageNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, messageNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Student Reviews</Label>
                          <p className="text-sm text-gray-500">Get notified when students leave reviews</p>
                        </div>
                        <Switch
                          checked={notificationSettings.studentReviews}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, studentReviews: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                        </div>
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Monthly Reports</Label>
                          <p className="text-sm text-gray-500">Receive monthly performance summaries</p>
                        </div>
                        <Switch
                          checked={notificationSettings.monthlyReports}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, monthlyReports: checked }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotifications} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and privacy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Two-Factor Authentication</h4>
                          <p className="text-sm text-blue-700 mb-3">Add an extra layer of security to your account</p>
                          <Button variant="outline" size="sm">Enable 2FA</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 mb-1">Active Sessions</h4>
                          <p className="text-sm text-yellow-700 mb-2">You are currently logged in on this device</p>
                          <p className="text-xs text-yellow-600">Last active: Just now</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Danger Zone</h4>
                      <div className="space-y-4">
                        <div className="p-4 border border-red-200 rounded-lg">
                          <h5 className="font-medium text-red-900 mb-2">Delete Account</h5>
                          <p className="text-sm text-gray-600 mb-3">Permanently delete your account and all associated data</p>
                          <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={isLoading}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Support Tab */}
              <TabsContent value="support" className="space-y-6">
                <div className="grid md:grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Get in Touch</CardTitle>
                      <CardDescription>Other ways to reach us</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Email</h4>
                          <p className="text-sm text-gray-600">support@brightbyt.com</p>
                          <p className="text-sm text-gray-600">help@brightbyt.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Phone</h4>
                          <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                          <p className="text-xs text-gray-500">Mon-Fri, 9am-6pm EST</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Address</h4>
                          <p className="text-sm text-gray-600">
                            123 Business Street<br />
                            New York, NY 10001<br />
                            United States
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>Quick answers to common questions about tutoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>How do I create a session?</AccordionTrigger>
                          <AccordionContent>
                            Go to your dashboard and click "Create Session". Fill in the session details including title, date, time, duration, and meeting link. You can set the session as public or private.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>How do I get paid for sessions?</AccordionTrigger>
                          <AccordionContent>
                            Payments are processed automatically when students book and pay for your sessions. You can view your earnings and payment history in your dashboard. Payments are typically processed within 24-48 hours after a session is completed.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Can I cancel or reschedule a session?</AccordionTrigger>
                          <AccordionContent>
                            Yes, you can cancel or reschedule sessions from your dashboard. Please notify students as soon as possible if you need to make changes. Cancellation policies may affect refunds for students.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger>How do I update my profile?</AccordionTrigger>
                          <AccordionContent>
                            You can update your profile information, availability, rates, and specializations in the Settings section. Changes are saved immediately and will be reflected on your public profile.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                          <AccordionTrigger>How do I manage my availability?</AccordionTrigger>
                          <AccordionContent>
                            Update your availability status in the Settings > Profile section. You can set your status to "Available now", "Available soon", "Busy", "Away", or "Not available" to let students know when you're ready to teach.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Help Resources</CardTitle>
                    <CardDescription>Learn more about using our tutoring platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="font-semibold mb-1">Getting Started Guide</h4>
                        <p className="text-sm text-gray-600">Learn how to set up your profile and start teaching</p>
                      </div>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <BookOpen className="w-6 h-6 text-green-600 mb-2" />
                        <h4 className="font-semibold mb-1">Creating Sessions</h4>
                        <p className="text-sm text-gray-600">Tips for creating and managing your teaching sessions</p>
                      </div>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
                        <h4 className="font-semibold mb-1">Payment & Earnings</h4>
                        <p className="text-sm text-gray-600">Understanding payments, earnings, and payouts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
