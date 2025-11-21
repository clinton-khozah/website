"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  BookOpen,
  Search
} from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdvertiserSettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    bio: "",
    website: "",
    company_name: "",
    country: "",
    city: "",
  })

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    marketingEmails: false,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    campaignUpdates: true,
    paymentNotifications: true,
    requestNotifications: true,
    messageNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
  })


  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          console.error('Auth error:', authError)
          router.push('/')
          return
        }

        // Fetch user data from students or mentors table
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single()

        if (studentData && !studentError) {
          setUserData({ ...studentData, email: user.email })
          setProfileData({
            full_name: studentData.full_name || "",
            email: user.email || "",
            phone_number: studentData.phone_number || "",
            bio: studentData.bio || "",
            website: studentData.website || "",
            company_name: studentData.company_name || "",
            country: studentData.country || "",
            city: studentData.city || "",
          })
        } else {
          // Try mentors table
          const { data: mentorData, error: mentorError } = await supabase
            .from('mentors')
            .select('*')
            .eq('id', user.id)
            .single()

          if (mentorData && !mentorError) {
            setUserData({ ...mentorData, email: user.email })
            setProfileData({
              full_name: mentorData.name || "",
              email: user.email || "",
              phone_number: mentorData.phone_number || "",
              bio: mentorData.description || "",
              website: mentorData.personal_website || "",
              company_name: "",
              country: mentorData.country || "",
              city: mentorData.city || "",
            })
          } else {
            // Create basic user data if not found in either table
            setUserData({ 
              id: user.id, 
              email: user.email || "", 
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User" 
            })
            setProfileData({
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "",
              email: user.email || "",
              phone_number: "",
              bio: "",
              website: "",
              company_name: "",
              country: "",
              city: "",
            })
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Don't redirect on error, just show the page with minimal data
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserData({ 
            id: user.id, 
            email: user.email || "", 
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User" 
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setShowSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update in students table (or create if doesn't exist)
      const { error } = await supabase
        .from('students')
        .upsert({
          id: user.id,
          email: profileData.email,
          full_name: profileData.full_name,
          phone_number: profileData.phone_number || null,
          bio: profileData.bio || null,
          website: profileData.website || null,
          company_name: profileData.company_name || null,
          country: profileData.country || null,
          city: profileData.city || null,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAccount = async () => {
    setSaving(true)
    setShowSuccess(false)

    try {
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
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating account:', error)
      alert("Error updating account. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    setShowSuccess(false)

    try {
      // Save notification preferences (you can store these in a user_settings table)
      // For now, we'll just show success
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving notifications:', error)
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <DashboardLayout userData={userData} role="advertiser">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userData={userData} role="advertiser">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/advertiser')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                  Settings
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 ml-4 leading-relaxed max-w-2xl">
              Manage your account settings, preferences, and get support
            </p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}

        {/* Tabs */}
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
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userData?.avatar_url || ""} />
                    <AvatarFallback className="text-2xl">
                      {profileData.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => handleProfileChange("full_name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={profileData.phone_number}
                      onChange={(e) => handleProfileChange("phone_number", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={profileData.company_name}
                      onChange={(e) => handleProfileChange("company_name", e.target.value)}
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleProfileChange("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => handleProfileChange("country", e.target.value)}
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleProfileChange("city", e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
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
                  <Button onClick={handleSaveAccount} disabled={saving}>
                    {saving ? (
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
                      <Label>Campaign Updates</Label>
                      <p className="text-sm text-gray-500">Get notified about campaign status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.campaignUpdates}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, campaignUpdates: checked }))}
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
                      <Label>Request Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified about new ad space requests</p>
                    </div>
                    <Switch
                      checked={notificationSettings.requestNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, requestNotifications: checked }))}
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
                  <Button onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? (
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
                      <Button variant="destructive" size="sm">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              {/* Contact Information */}
              <div className="space-y-6">
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

                    {/* FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions about booking tutors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I book a tutor?</AccordionTrigger>
                        <AccordionContent>
                          Browse available tutors on the "Find Tutors" page, view their profiles, and click "Book Session" to schedule a learning session. You can filter by subject, availability, and price.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How do I pay for sessions?</AccordionTrigger>
                        <AccordionContent>
                          Payment is processed securely when you book a session. You can pay using credit card, debit card, or other supported payment methods. Sessions must be paid for before they begin.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Can I reschedule or cancel a session?</AccordionTrigger>
                        <AccordionContent>
                          Yes, you can reschedule or cancel sessions from your "My Bookings" page. Please check the cancellation policy for your specific tutor, as refund policies may vary.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>What if I need to contact my tutor?</AccordionTrigger>
                        <AccordionContent>
                          You can message your tutor directly through the platform's messaging system. All communication is kept secure and you can access your messages from the dashboard.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>How do I track my learning progress?</AccordionTrigger>
                        <AccordionContent>
                          View your learning progress, completed sessions, and achievements in the "Progress" section of your dashboard. You can see your learning hours, completed courses, and skill improvements.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Help Resources */}
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
                    <p className="text-sm text-gray-600">Learn how to find and book tutors for your learning needs</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <BookOpen className="w-6 h-6 text-green-600 mb-2" />
                    <h4 className="font-semibold mb-1">Booking Sessions</h4>
                    <p className="text-sm text-gray-600">Tips for scheduling and managing your learning sessions</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
                    <h4 className="font-semibold mb-1">Progress Tracking</h4>
                    <p className="text-sm text-gray-600">Understanding your learning progress and achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

