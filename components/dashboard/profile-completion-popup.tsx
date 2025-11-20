"use client"

import * as React from "react"
import { X, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface ProfileCompletionPopupProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onComplete: () => void
}

export function ProfileCompletionPopup({ isOpen, onClose, userId, onComplete }: ProfileCompletionPopupProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    full_name: '',
    bio: '',
    phone_number: '',
    country: '',
    city: '',
    website: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (isOpen && userId) {
      fetchUserData()
    }
  }, [isOpen, userId])

  const fetchUserData = async () => {
    try {
      // Get Supabase session for auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('No session found')
        return
      }

      // Fetch from API - matching eduspaceAI-frontend pattern
      const baseUrl = API_BASE_URL.replace(/\/+$/, '')
      const response = await fetch(`${baseUrl}/users/students/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const result = await response.json()
      
      if (result.data) {
        setFormData({
          full_name: result.data.full_name || '',
          bio: result.data.bio || '',
          phone_number: result.data.phone_number || '',
          country: result.data.country || '',
          city: result.data.city || '',
          website: result.data.website || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Fallback to direct Supabase call if API fails
      try {
        const { data, error } = await supabase
          .from('students')
          .select('full_name, bio, phone_number, country, city, website, email')
          .eq('id', userId)
          .single()

        if (!error && data) {
          setFormData({
            full_name: data.full_name || '',
            bio: data.bio || '',
            phone_number: data.phone_number || '',
            country: data.country || '',
            city: data.city || '',
            website: data.website || ''
          })
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError)
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required'
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Get Supabase session for auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No session found. Please log in again.')
      }

      // Call API endpoint - matching eduspaceAI-frontend pattern
      const baseUrl = API_BASE_URL.replace(/\/+$/, '') // Remove trailing slashes from base URL
      const response = await fetch(`${baseUrl}/users/students/complete-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          bio: formData.bio.trim(),
          phone_number: formData.phone_number.trim(),
          country: formData.country.trim(),
          city: formData.city.trim(),
          website: formData.website.trim() || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const result = await response.json()
      
      if (result.message === 'Profile completed successfully') {
        onComplete()
        onClose()
        // Refresh the page to update the user data
        router.refresh()
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          // Prevent closing on backdrop click - user must complete profile
          e.stopPropagation()
        }}
        className="profile-completion-backdrop"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998
        }}
      />

      {/* Popup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="profile-completion-modal"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 2rem)',
          maxWidth: '32rem',
          margin: 0,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        {/* Form Container */}
        <div className="profile-completion-form-container" style={{ 
          padding: '1.5rem', 
          maxHeight: '70vh', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>

          {/* Form */}
          <form onSubmit={handleSubmit} className="profile-completion-form" style={{ 
            width: '100%', 
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Full Name */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ textAlign: 'left' }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => {
                  setFormData({ ...formData, full_name: e.target.value })
                  if (errors.full_name) setErrors({ ...errors, full_name: '' })
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Bio */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ textAlign: 'left' }}>
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => {
                  setFormData({ ...formData, bio: e.target.value })
                  if (errors.bio) setErrors({ ...errors, bio: '' })
                }}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.bio ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Tell us about yourself"
              />
              {errors.bio && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.bio}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ textAlign: 'left' }}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => {
                  setFormData({ ...formData, phone_number: e.target.value })
                  if (errors.phone_number) setErrors({ ...errors, phone_number: '' })
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone_number ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="+1 234 567 8900"
              />
              {errors.phone_number && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Country */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ textAlign: 'left' }}>
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => {
                  setFormData({ ...formData, country: e.target.value })
                  if (errors.country) setErrors({ ...errors, country: '' })
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.country ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Enter your country"
              />
              {errors.country && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.country}
                </p>
              )}
            </div>

            {/* City */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ textAlign: 'left' }}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value })
                  if (errors.city) setErrors({ ...errors, city: '' })
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* Website (Optional) */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ textAlign: 'left' }}>
                Website <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center pt-2">
              All fields marked with <span className="text-red-500 font-semibold">*</span> are required for verification
            </p>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

