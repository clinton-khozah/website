"use client"

import * as React from "react"
import { X, AlertCircle, CheckCircle, Loader2, Camera, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface StudentProfileCompletionFormProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onComplete: () => void
}

export function StudentProfileCompletionForm({ isOpen, onClose, userId, onComplete }: StudentProfileCompletionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingCountries, setIsLoadingCountries] = React.useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const [countries, setCountries] = React.useState<Array<{name: string, code: string}>>([])
  const [formData, setFormData] = React.useState({
    full_name: '',
    bio: '',
    phone_number: '',
    country: '',
    city: '',
    facebook: '',
    linkedin: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (isOpen && userId) {
      fetchUserData()
      fetchCountries()
    }
  }, [isOpen, userId])

  // Add global styles for select options
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .student-profile-completion-form-container select {
        cursor: pointer;
      }
      .student-profile-completion-form-container select option {
        background-color: white !important;
        color: #1f2937 !important;
        padding: 0.875rem 1rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        border-bottom: 1px solid #f3f4f6 !important;
      }
      .student-profile-completion-form-container select option:first-child {
        color: #6b7280 !important;
        font-style: italic;
      }
      .student-profile-completion-form-container select option:hover {
        background-color: #f0f9ff !important;
        color: #0284c7 !important;
      }
      .student-profile-completion-form-container select option:checked,
      .student-profile-completion-form-container select option:focus {
        background: linear-gradient(to right, #dbeafe, #e0f2fe) !important;
        color: #0369a1 !important;
        font-weight: 500 !important;
      }
      .student-profile-completion-form-container select:focus option:checked {
        background: linear-gradient(to right, #bfdbfe, #dbeafe) !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  const fetchCountries = async () => {
    setIsLoadingCountries(true)
    try {
      // Try API endpoint first - matching eduspaceAI-frontend pattern
      const baseUrl = API_BASE_URL.replace(/\/+$/, '')
      const response = await fetch(`${baseUrl}/users/countries/`)
      if (response.ok) {
        const result = await response.json()
        console.log('Countries fetched from API:', result)
        if (result.countries && Array.isArray(result.countries) && result.countries.length > 0) {
          setCountries(result.countries)
          console.log('Countries set:', result.countries.length)
          return
        }
      }
      
      // Fallback: Fetch directly from REST Countries API
      console.log('Falling back to direct REST Countries API')
      const fallbackResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3')
      if (!fallbackResponse.ok) {
        throw new Error('Failed to fetch countries from fallback API')
      }
      const fallbackData = await fallbackResponse.json()
      
      const formattedCountries = fallbackData.map((country: any) => ({
        name: country.name?.common || '',
        code: country.cca2 || '',
        code3: country.cca3 || ''
      })).filter((c: any) => c.name && c.code).sort((a: any, b: any) => a.name.localeCompare(b.name))
      
      setCountries(formattedCountries)
      console.log('Countries set from fallback:', formattedCountries.length)
    } catch (error) {
      console.error('Error fetching countries:', error)
      setCountries([])
    } finally {
      setIsLoadingCountries(false)
    }
  }

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
        const socialLinks = result.data.social_links || {}
        setFormData({
          full_name: result.data.full_name || '',
          bio: result.data.bio || '',
          phone_number: result.data.phone_number || '',
          country: result.data.country || '',
          city: result.data.city || '',
          facebook: socialLinks.facebook || '',
          linkedin: socialLinks.linkedin || ''
        })
        if (result.data.avatar_url) {
          setAvatarPreview(result.data.avatar_url)
        }
      }
    } catch (error) {
      console.error('Error fetching user data from API:', error)
      // Don't use direct Supabase calls - all data must go through API
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setIsUploadingAvatar(true)
    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Get Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No session found')
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}_${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(filePath)

      // Set avatar preview - the URL will be saved when form is submitted through API
      setAvatarPreview(publicUrl)
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      alert(error.message || 'Failed to upload profile picture')
      setAvatarPreview(null)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleCompleteLater = () => {
    onClose()
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
      const apiUrl = `${baseUrl}/users/students/complete-profile/`
      console.log('Submitting to API:', apiUrl)
      console.log('API Base URL:', API_BASE_URL)
      console.log('Request method: PUT')
      
      const response = await fetch(apiUrl, {
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
          facebook: formData.facebook.trim() || null,
          linkedin: formData.linkedin.trim() || null,
          avatar_url: avatarPreview || null
        })
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = 'Failed to update profile'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
          if (errorData.missing_fields) {
            errorMessage += `: ${errorData.missing_fields.join(', ')}`
          }
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Prevent closing on backdrop click - user must complete profile
              e.stopPropagation()
            }}
            className="student-profile-completion-backdrop"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />

          {/* Form Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="student-profile-completion-form-modal"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
        <div style={{
          width: 'calc(100% - 2rem)',
          maxWidth: '42rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e5e7eb',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          pointerEvents: 'auto',
          position: 'relative'
        }}>
        {/* Background Logo - blurred and large */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{
          opacity: 0.15,
          filter: 'blur(15px)'
        }}>
          <Image
            src="/images/logo1.png"
            alt="Logo Background"
            width={450}
            height={450}
            className="object-contain"
            priority
          />
        </div>

        {/* Form Container */}
        <div className="student-profile-completion-form-container" style={{ 
          padding: '2rem 2.5rem', 
          maxHeight: '75vh', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Skip and Complete Later text - floating on form */}
          <div className="absolute top-24 right-4 z-10">
            <button
              type="button"
              onClick={handleCompleteLater}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Skip and Complete Later
            </button>
          </div>
          {/* Profile Picture Upload */}
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
              >
                <Upload className="w-4 h-4 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </label>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="student-profile-completion-form" style={{ 
            width: '100%', 
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Full Name */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => {
                  setFormData({ ...formData, full_name: e.target.value })
                  if (errors.full_name) setErrors({ ...errors, full_name: '' })
                }}
                className={`w-full px-5 py-3.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-base ${
                  errors.full_name ? 'border-red-500 bg-red-50/80' : 'border-gray-200 bg-white/60 focus:bg-white/90'
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
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => {
                  setFormData({ ...formData, bio: e.target.value })
                  if (errors.bio) setErrors({ ...errors, bio: '' })
                }}
                rows={4}
                className={`w-full px-5 py-3.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none resize-none text-base ${
                  errors.bio ? 'border-red-500 bg-red-50/80' : 'border-gray-200 bg-white/60 focus:bg-white/90'
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
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => {
                  setFormData({ ...formData, phone_number: e.target.value })
                  if (errors.phone_number) setErrors({ ...errors, phone_number: '' })
                }}
                className={`w-full px-5 py-3.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-base ${
                  errors.phone_number ? 'border-red-500 bg-red-50/80' : 'border-gray-200 bg-white/60 focus:bg-white/90'
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
            <div style={{ width: '100%', position: 'relative', zIndex: 10 }}>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => {
                    setFormData({ ...formData, country: e.target.value })
                    if (errors.country) setErrors({ ...errors, country: '' })
                  }}
                  className={`w-full px-5 py-3.5 pr-12 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-base appearance-none cursor-pointer font-medium ${
                    errors.country 
                      ? 'border-red-500 bg-red-50/80 text-red-900' 
                      : formData.country
                        ? 'border-blue-300 bg-white/80 text-gray-900'
                        : 'border-gray-200 bg-white/60 text-gray-500 focus:bg-white/90 focus:text-gray-900'
                  }`}
                  disabled={isLoadingCountries}
                  style={{
                    backgroundImage: 'none',
                    boxShadow: formData.country ? '0 2px 4px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                >
                  <option value="" disabled hidden>
                    {isLoadingCountries ? 'Loading countries...' : 'Select your country'}
                  </option>
                  {countries.length > 0 ? (
                    countries.map((country) => (
                      <option 
                        key={country.code} 
                        value={country.name}
                      >
                        {country.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No countries available
                    </option>
                  )}
                </select>
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 transition-colors ${
                  formData.country ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.country && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.country}
                </p>
              )}
            </div>

            {/* City */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value })
                  if (errors.city) setErrors({ ...errors, city: '' })
                }}
                className={`w-full px-5 py-3.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-base ${
                  errors.city ? 'border-red-500 bg-red-50/80' : 'border-gray-200 bg-white/60 focus:bg-white/90'
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

            {/* Facebook (Optional) */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                Facebook <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-5 py-3.5 border-2 border-gray-200 bg-white/60 rounded-xl transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none focus:bg-white/90 text-base"
                placeholder="https://facebook.com/yourprofile"
              />
            </div>

            {/* LinkedIn (Optional) */}
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5" style={{ textAlign: 'left' }}>
                LinkedIn <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-5 py-3.5 border-2 border-gray-200 bg-white/60 rounded-xl transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none focus:bg-white/90 text-base"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3" style={{ width: '100%' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white font-semibold text-base rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        </div>
      </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

