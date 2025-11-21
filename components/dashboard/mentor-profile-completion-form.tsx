"use client"

import * as React from "react"
import { X, AlertCircle, CheckCircle, Loader2, Camera, Upload, Plus, X as XIcon, MapPin, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

interface MentorProfileCompletionFormProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onComplete: () => void
}

export function MentorProfileCompletionForm({ isOpen, onClose, userId, onComplete }: MentorProfileCompletionFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingCountries, setIsLoadingCountries] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const [qualificationsPreview, setQualificationsPreview] = React.useState<string | null>(null)
  const [idDocumentPreview, setIdDocumentPreview] = React.useState<string | null>(null)
  const [cvDocumentPreview, setCvDocumentPreview] = React.useState<string | null>(null)
  const [countries, setCountries] = React.useState<Array<{name: string, code: string}>>([])
  const [currentSpecialization, setCurrentSpecialization] = React.useState("")
  const [currentLanguage, setCurrentLanguage] = React.useState("")
  const [isGettingLocation, setIsGettingLocation] = React.useState(false)
  const [locationStatus, setLocationStatus] = React.useState<"idle" | "success" | "error">("idle")
  const [locationError, setLocationError] = React.useState<string>("")
  const [formData, setFormData] = React.useState({
    name: '',
    title: '',
    description: '',
    phone_number: '',
    country: '',
    gender: '',
    age: '',
    id_number: '',
    linkedin_profile: '',
    github_profile: '',
    twitter_profile: '',
    facebook_profile: '',
    instagram_profile: '',
    personal_website: '',
    hourly_rate: '',
    experience: '',
    availability: 'Available now',
    languages: [] as string[],
    specialization: [] as string[],
    payment_method: '',
    payment_period: 'per_session',
    payment_email: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    routing_number: '',
    crypto_wallet: '',
    latitude: '',
    longitude: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  
  // Function to get live location
  const getLiveLocation = () => {
    setIsGettingLocation(true)
    setLocationStatus("idle")
    setLocationError("")
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLocationStatus("error")
      setIsGettingLocation(false)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }))
        setLocationStatus("success")
        setIsGettingLocation(false)
        
        // Save location to database immediately
        try {
          const { error } = await supabase
            .from('mentors')
            .update({
              latitude: latitude,
              longitude: longitude
            })
            .eq('user_id', userId)
          
          if (error) {
            console.error('Error saving location:', error)
            setLocationError("Location saved locally but failed to save to database")
          }
        } catch (error) {
          console.error('Error saving location:', error)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        setLocationError(error.message || "Failed to get your location. Please check your browser permissions.")
        setLocationStatus("error")
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const fetchUserData = React.useCallback(async () => {
    if (!userId) return
    
    try {
      const { data: mentorData, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching mentor data:', error)
        return
      }

      if (mentorData) {
        const paymentDetails = typeof mentorData.payment_account_details === 'string' 
          ? JSON.parse(mentorData.payment_account_details || '{}')
          : mentorData.payment_account_details || {}

        setFormData({
          name: mentorData.name || '',
          title: mentorData.title || '',
          description: mentorData.description || '',
          phone_number: mentorData.phone_number || '',
          country: mentorData.country || '',
          gender: mentorData.gender || '',
          age: mentorData.age?.toString() || '',
          id_number: mentorData.id_number || '',
          linkedin_profile: mentorData.linkedin_profile || '',
          github_profile: mentorData.github_profile || '',
          twitter_profile: mentorData.twitter_profile || '',
          facebook_profile: mentorData.facebook_profile || '',
          instagram_profile: mentorData.instagram_profile || '',
          personal_website: mentorData.personal_website || '',
          hourly_rate: mentorData.hourly_rate?.toString() || '',
          experience: mentorData.experience?.toString() || '',
          availability: mentorData.availability || 'Available now',
          languages: Array.isArray(mentorData.languages) ? mentorData.languages : (typeof mentorData.languages === 'string' ? JSON.parse(mentorData.languages || '[]') : []),
          specialization: Array.isArray(mentorData.specialization) ? mentorData.specialization : (typeof mentorData.specialization === 'string' ? JSON.parse(mentorData.specialization || '[]') : []),
          payment_method: mentorData.payment_method || '',
          payment_period: mentorData.payment_period || 'per_session',
          payment_email: paymentDetails.email || '',
          bank_name: mentorData.bank_name || paymentDetails.bank_name || '',
          account_holder_name: mentorData.account_holder_name || paymentDetails.account_holder || '',
          account_number: mentorData.account_number || paymentDetails.account_number || '',
          routing_number: mentorData.routing_number || paymentDetails.routing_number || '',
          crypto_wallet: paymentDetails.wallet_address || ''
        })
        if (mentorData.avatar) setAvatarPreview(mentorData.avatar)
        if (mentorData.qualifications) setQualificationsPreview(mentorData.qualifications)
        if (mentorData.id_document) setIdDocumentPreview(mentorData.id_document)
        if (mentorData.cv_document) setCvDocumentPreview(mentorData.cv_document)
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error)
    }
  }, [userId])

  const fetchCountries = React.useCallback(async () => {
    setIsLoadingCountries(true)
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      if (!response.ok) throw new Error('Failed to fetch countries')
      const data = await response.json()
      const formattedCountries = data.map((country: any) => ({
        name: country.name?.common || '',
        code: country.cca2 || ''
      })).filter((c: any) => c.name && c.code).sort((a: any, b: any) => a.name.localeCompare(b.name))
      setCountries(formattedCountries)
    } catch (error) {
      console.error('Error fetching countries:', error)
      setCountries([])
    } finally {
      setIsLoadingCountries(false)
    }
  }, [])

  React.useEffect(() => {
    if (isOpen && userId) {
      fetchUserData()
      fetchCountries()
    }
  }, [isOpen, userId, fetchUserData, fetchCountries])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddSpecialization = () => {
    if (currentSpecialization.trim() && !formData.specialization.includes(currentSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, currentSpecialization.trim()]
      }))
      setCurrentSpecialization("")
    }
  }

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index)
    }))
  }

  const handleAddLanguage = () => {
    if (currentLanguage.trim() && !formData.languages.includes(currentLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, currentLanguage.trim()]
      }))
      setCurrentLanguage("")
    }
  }

  const handleRemoveLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (file: File, type: 'avatar' | 'qualifications' | 'id_document' | 'cv_document') => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: 'File size must be less than 10MB' }))
      return null
    }

    setIsUploading(type)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}_${Date.now()}.${fileExt}`
      let filePath = ''

      if (type === 'avatar') {
        filePath = `avatars-temp/${userId}/${fileName}`
      } else {
        filePath = `verification-docs/${userId}/${fileName}`
      }

      const { error: uploadError } = await supabase.storage
        .from('course-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      setErrors(prev => ({ ...prev, [type]: `Failed to upload ${type}` }))
      return null
    } finally {
      setIsUploading(null)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleFileUpload(file, 'avatar')
    if (url) setAvatarPreview(url)
  }

  const handleQualificationsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleFileUpload(file, 'qualifications')
    if (url) setQualificationsPreview(url)
  }

  const handleIdDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleFileUpload(file, 'id_document')
    if (url) setIdDocumentPreview(url)
  }

  const handleCvDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleFileUpload(file, 'cv_document')
    if (url) setCvDocumentPreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.hourly_rate || parseFloat(formData.hourly_rate) <= 0) {
      newErrors.hourly_rate = 'Valid hourly rate is required'
    }
    if (formData.specialization.length === 0) {
      newErrors.specialization = 'At least one specialization is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      // Build payment account details based on payment method
      let paymentAccountDetails: any = {}
      if (formData.payment_method === 'paypal' || formData.payment_method === 'stripe') {
        paymentAccountDetails = {
          type: formData.payment_method,
          email: formData.payment_email
        }
      } else if (formData.payment_method === 'bank_transfer') {
        paymentAccountDetails = {
          type: 'bank_transfer',
          bank_name: formData.bank_name,
          account_holder: formData.account_holder_name,
          account_number: formData.account_number,
          routing_number: formData.routing_number
        }
      } else if (formData.payment_method === 'crypto') {
        paymentAccountDetails = {
          type: 'crypto',
          wallet_address: formData.crypto_wallet
        }
      }

      const updateData: any = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        phone_number: formData.phone_number.trim() || null,
        country: formData.country || null,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        id_number: formData.id_number.trim() || null,
        linkedin_profile: formData.linkedin_profile.trim() || null,
        github_profile: formData.github_profile.trim() || null,
        twitter_profile: formData.twitter_profile.trim() || null,
        facebook_profile: formData.facebook_profile.trim() || null,
        instagram_profile: formData.instagram_profile.trim() || null,
        personal_website: formData.personal_website.trim() || null,
        hourly_rate: parseFloat(formData.hourly_rate),
        experience: formData.experience ? parseInt(formData.experience) : 0,
        availability: formData.availability,
        languages: JSON.stringify(formData.languages),
        specialization: JSON.stringify(formData.specialization),
        payment_method: formData.payment_method || null,
        payment_period: formData.payment_period,
        payment_account_details: JSON.stringify(paymentAccountDetails),
        bank_name: formData.bank_name.trim() || null,
        account_holder_name: formData.account_holder_name.trim() || null,
        account_number: formData.account_number.trim() || null,
        routing_number: formData.routing_number.trim() || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        is_complete: true,
        updated_at: new Date().toISOString()
      }

      if (avatarPreview) updateData.avatar = avatarPreview
      if (qualificationsPreview) updateData.qualifications = qualificationsPreview
      if (idDocumentPreview) updateData.id_document = idDocumentPreview
      if (cvDocumentPreview) updateData.cv_document = cvDocumentPreview

      const { error } = await supabase
        .from('mentors')
        .update(updateData)
        .eq('user_id', userId)

      if (error) throw error

      onComplete()
    } catch (error: any) {
      console.error('Error updating mentor profile:', error)
      setErrors({ submit: error.message || 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in your information to start teaching and get verified</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploading === 'avatar'}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                  <p className="text-xs text-gray-500 mt-1">Upload a professional photo</p>
                  {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio/Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell students about yourself, your experience, and teaching style..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoadingCountries}
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Location Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={getLiveLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Getting Location...
                      </>
                    ) : locationStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Location Saved
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4" />
                        Get My Live Location
                      </>
                    )}
                  </Button>
                  {formData.latitude && formData.longitude && (
                    <span className="text-sm text-gray-600">
                      {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                    </span>
                  )}
                </div>
                {locationError && (
                  <p className="text-xs text-red-500 mt-1">{locationError}</p>
                )}
                {locationStatus === "success" && !locationError && (
                  <p className="text-xs text-green-600 mt-1">Location saved successfully!</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Click the button to automatically detect and save your current location. This helps students find tutors nearby.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Details</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50.00"
                  />
                  {errors.hourly_rate && <p className="text-xs text-red-500 mt-1">{errors.hourly_rate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Available now">Available now</option>
                    <option value="Available soon">Available soon</option>
                    <option value="Limited availability">Limited availability</option>
                    <option value="Not available">Not available</option>
                  </select>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSpecialization}
                    onChange={(e) => setCurrentSpecialization(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSpecialization()
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Python, React, AWS"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialization}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {errors.specialization && <p className="text-xs text-red-500 mb-2">{errors.specialization}</p>}
                <div className="flex flex-wrap gap-2">
                  {formData.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialization(index)}
                        className="hover:text-blue-600"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddLanguage()
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., English, Spanish"
                  />
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(index)}
                        className="hover:text-green-600"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents & Verification</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {qualificationsPreview ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-xs text-gray-600">Document uploaded</p>
                        <a href={qualificationsPreview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Upload PDF</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleQualificationsUpload}
                          className="hidden"
                          disabled={isUploading === 'qualifications'}
                        />
                      </label>
                    )}
                  </div>
                  {errors.qualifications && <p className="text-xs text-red-500 mt-1">{errors.qualifications}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Document</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {idDocumentPreview ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-xs text-gray-600">Document uploaded</p>
                        <a href={idDocumentPreview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Upload PDF/Image</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleIdDocumentUpload}
                          className="hidden"
                          disabled={isUploading === 'id_document'}
                        />
                      </label>
                    )}
                  </div>
                  {errors.id_document && <p className="text-xs text-red-500 mt-1">{errors.id_document}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CV/Resume</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {cvDocumentPreview ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-xs text-gray-600">Document uploaded</p>
                        <a href={cvDocumentPreview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Upload PDF</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvDocumentUpload}
                          className="hidden"
                          disabled={isUploading === 'cv_document'}
                        />
                      </label>
                    )}
                  </div>
                  {errors.cv_document && <p className="text-xs text-red-500 mt-1">{errors.cv_document}</p>}
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select payment method</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="crypto">Cryptocurrency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period</label>
                  <select
                    name="payment_period"
                    value={formData.payment_period}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="per_session">Per Session</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Payment Details based on method */}
              {formData.payment_method === 'paypal' || formData.payment_method === 'stripe' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.payment_method === 'paypal' ? 'PayPal' : 'Stripe'} Email
                  </label>
                  <input
                    type="email"
                    name="payment_email"
                    value={formData.payment_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              ) : formData.payment_method === 'bank_transfer' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Bank Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      name="account_holder_name"
                      value={formData.account_holder_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Account Holder"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                    <input
                      type="text"
                      name="routing_number"
                      value={formData.routing_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Routing Number"
                    />
                  </div>
                </div>
              ) : formData.payment_method === 'crypto' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    name="crypto_wallet"
                    value={formData.crypto_wallet}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0x..."
                  />
                </div>
              ) : null}
            </div>

            {/* Social Media Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Social Media & Links</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    name="github_profile"
                    value={formData.github_profile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    name="twitter_profile"
                    value={formData.twitter_profile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    name="facebook_profile"
                    value={formData.facebook_profile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    name="instagram_profile"
                    value={formData.instagram_profile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personal Website</label>
                  <input
                    type="url"
                    name="personal_website"
                    value={formData.personal_website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{errors.submit}</span>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}
