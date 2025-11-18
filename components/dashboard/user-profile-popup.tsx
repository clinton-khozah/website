import * as React from "react"
import { X, Globe, Link as LinkIcon, Mail, Calendar, CheckCircle, XCircle, Clock, Edit2, Check, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { VerificationPopup } from "./verification-popup"
import { createClient } from '@supabase/supabase-js'

interface UserProfilePopupProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    id: string
    email: string
    full_name: string
    avatar_url: string | null
    user_type: string
    created_at: string
    updated_at: string
    verified: boolean | 'pending'
    bio: string | null
    website: string | null
    social_links: Record<string, string>
    settings: Record<string, any>
  }
  onVerificationSubmit?: () => void
}

export function UserProfilePopup({ isOpen, onClose, userData, onVerificationSubmit }: UserProfilePopupProps) {
  const [isVerificationOpen, setIsVerificationOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    full_name: userData?.full_name || '',
    website: userData?.website || '',
    bio: userData?.bio || '',
    social_links: userData?.social_links || {}
  })
  
  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.full_name || '',
        website: userData.website || '',
        bio: userData.bio || '',
        social_links: userData.social_links || {}
      })
    }
  }, [userData])

  if (!userData) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleVerificationSubmit = async (formData: any) => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('users_account')
        .update({ verified: 'pending' })
        .eq('id', userData.id)

      if (error) throw error

      if (onVerificationSubmit) {
        onVerificationSubmit()
      }
      setIsVerificationOpen(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting verification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      
      // Create an object with only the changed fields, using existing data as base
      const updates: Record<string, any> = {}
      
      // Only update fields that have changed and are not empty
      if (formData.full_name !== userData.full_name && formData.full_name.trim() !== '') {
        updates.full_name = formData.full_name
      }
      
      if (formData.website !== userData.website && formData.website.trim() !== '') {
        updates.website = formData.website
      }
      
      if (formData.bio !== userData.bio && formData.bio.trim() !== '') {
        updates.bio = formData.bio
      }
      
      // Only update social_links if it has changed and is not empty
      if (JSON.stringify(formData.social_links) !== JSON.stringify(userData.social_links) && 
          Object.keys(formData.social_links).length > 0) {
        updates.social_links = formData.social_links
      }
      
      // Only update if there are actual changes
      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString()
        
        const { error } = await supabase
          .from('users_account')
          .update(updates)
          .eq('id', userData.id)

        if (error) throw error
        
        // Close the profile popup and show success
        onClose()
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        
        // Update the parent component's userData
        if (onVerificationSubmit) {
          onVerificationSubmit()
        }
      } else {
        // No changes were made
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getVerificationStatus = () => {
    const verified = userData?.verified
    if (verified === true) {
      return {
        icon: CheckCircle,
        text: "Verified",
        color: "text-green-500",
        clickable: false
      }
    } else if (verified === 'pending') {
      return {
        icon: Clock,
        text: "Pending Verification",
        color: "text-blue-500",
        clickable: false
      }
    } else {
      return {
        icon: XCircle,
        text: "Unverified",
        color: "text-yellow-500",
        clickable: true
      }
    }
  }

  const status = getVerificationStatus()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
            <p className="text-white text-sm">Updating profile...</p>
          </div>
        </motion.div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 right-4 z-[60]"
        >
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-[#00ff9d] blur-xl opacity-20 rounded-lg" />
            
            {/* Main popup card */}
            <div className="relative bg-[#0f1424] border border-[#00ff9d]/30 rounded-lg p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {/* Animated checkmark icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-8 h-8 rounded-full bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/30"
                >
                  <Check className="h-5 w-5 text-[#00ff9d]" />
                </motion.div>
                
                {/* Success message with gradient text */}
                <div>
                  <p className="text-sm font-medium bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] bg-clip-text text-transparent">
                    Profile Updated Successfully
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Changes have been saved to your profile
                  </p>
                </div>
              </div>
              
              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] rounded-b-lg"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#0f1424] border border-[#2a2e45] rounded-xl p-6 z-50 shadow-2xl mx-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Profile Content */}
            <div className="text-center mb-4">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {userData.avatar_url ? (
                  <img
                    src={userData.avatar_url}
                    alt={userData.full_name}
                    className="w-full h-full rounded-full object-cover border-4 border-[#2a2e45]"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#2a2e45] flex items-center justify-center border-4 border-[#6B54FA]">
                    <span className="text-3xl font-medium text-white">
                      {userData.full_name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div 
                  className={`absolute bottom-1 right-1 flex items-center gap-1 bg-[#1a1e32] px-2 py-0.5 rounded-full border border-[#2a2e45] ${
                    status.clickable ? 'cursor-pointer hover:bg-[#2a2e45] transition-colors' : ''
                  }`}
                  onClick={() => {
                    if (status.clickable) {
                      onClose()
                      setIsVerificationOpen(true)
                    }
                  }}
                >
                  <status.icon size={12} className={status.color} />
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="text-xl font-bold text-white bg-[#2a2e45] px-2 py-1 rounded text-center"
                    placeholder={userData.full_name}
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white">{userData.full_name}</h2>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 rounded-full hover:bg-[#2a2e45] transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-[#6B54FA] text-white text-xs font-medium rounded-full">
                  {userData.user_type.charAt(0).toUpperCase() + userData.user_type.slice(1)}
                </span>
              </div>
              
              {/* About Section */}
              <div className="bg-[#1a1e32]/50 rounded-lg p-4 mx-auto max-w-md border border-[#2a2e45]/50">
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-[#2a2e45] text-white px-3 py-2 rounded text-sm"
                    rows={3}
                    placeholder={userData.bio || 'Add your bio here...'}
                  />
                ) : (
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    {userData.bio || 'No bio provided'}
                  </p>
                )}
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Email */}
                <div className="bg-[#1a1e32] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#53E2D2]" />
                    <h3 className="text-xs font-medium text-white">Email</h3>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">{userData.email}</p>
                </div>

                {/* Join Date */}
                <div className="bg-[#1a1e32] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#F9CA56]" />
                    <h3 className="text-xs font-medium text-white">Member Since</h3>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">{formatDate(userData.created_at)}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Website */}
                <div className="bg-[#1a1e32] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-[#53E2D2]" />
                    <h3 className="text-xs font-medium text-white">Website</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-[#2a2e45] text-white px-2 py-1 rounded mt-1 text-xs"
                      placeholder={userData.website || 'Add your website...'}
                    />
                  ) : (
                    <a
                      href={userData.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#53E2D2] text-xs hover:underline mt-1 block"
                    >
                      {userData.website || 'Not provided'}
                    </a>
                  )}
                </div>

                {/* Last Updated */}
                <div className="bg-[#1a1e32] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#6B54FA]" />
                    <h3 className="text-xs font-medium text-white">Last Updated</h3>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">{formatDate(userData.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Update Button */}
            {isEditing && (
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-[#9575ff] text-white text-sm font-medium rounded-lg hover:bg-[#8a63ff] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Verification Popup */}
      <VerificationPopup
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onSubmit={handleVerificationSubmit}
        userId={userData.id}
      />
    </AnimatePresence>
  )
} 