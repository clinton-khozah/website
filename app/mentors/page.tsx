"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  CheckCircle2, 
  Clock,
  Globe,
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { MentorDetailsModal } from "@/components/mentors/mentor-details-modal"
import { BookingModal } from "@/components/mentors/booking-modal"
import { ProfilePictureModal } from "@/components/mentors/profile-picture-modal"

interface Mentor {
  id: number
  supabase_id: string
  name: string
  title: string
  description: string
  specialization: string[]
  rating: number
  total_reviews: number
  hourly_rate: number
  avatar: string
  experience: string
  languages: string[]
  availability: string
  country?: string
  city?: string
  latitude?: number
  longitude?: number
  is_verified?: boolean
  is_online?: boolean
  email?: string
  phone_number?: string
  qualifications?: string
  linkedin_profile?: string
  github_profile?: string
  twitter_profile?: string
  facebook_profile?: string
  instagram_profile?: string
  personal_website?: string
  sessions_conducted?: number
}

export default function MentorsPage() {
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isFindingNearby, setIsFindingNearby] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [profilePictureMentor, setProfilePictureMentor] = useState<Mentor | null>(null)
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false)

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://127.0.0.1:8000/api/v1/mentors/list/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.mentors) {
          setMentors(data.mentors)
          setFilteredMentors(data.mentors)
        } else {
          console.error('Failed to fetch mentors:', data.message)
          setMentors([])
          setFilteredMentors([])
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
        setMentors([])
        setFilteredMentors([])
      } finally {
        setLoading(false)
      }
    }

    fetchMentors()
  }, [])

  // Search and filter mentors
  useEffect(() => {
    let filtered = mentors

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase()
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm) ||
        mentor.title.toLowerCase().includes(searchTerm) ||
        mentor.description?.toLowerCase().includes(searchTerm) ||
        mentor.specialization?.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        mentor.country?.toLowerCase().includes(searchTerm) ||
        mentor.city?.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredMentors(filtered)
  }, [search, mentors])

  // Get user's current location
  const getCurrentLocation = () => {
    setIsFindingNearby(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsFindingNearby(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        findNearbyMentors(location)
        setIsFindingNearby(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocationError("Unable to retrieve your location. Please enable location services.")
        setIsFindingNearby(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Find nearby online mentors
  const findNearbyMentors = (location: { lat: number; lng: number }) => {
    const MAX_DISTANCE_KM = 50 // Maximum distance in kilometers

    const nearbyMentors = mentors
      .filter(mentor => {
        // Filter for online mentors with location data
        if (!mentor.is_online && mentor.latitude && mentor.longitude) {
          return false
        }

        // Calculate distance if mentor has location
        if (mentor.latitude && mentor.longitude) {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            mentor.latitude,
            mentor.longitude
          )
          return distance <= MAX_DISTANCE_KM
        }

        return false
      })
      .map(mentor => {
        // Add distance to mentor object
        if (mentor.latitude && mentor.longitude) {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            mentor.latitude,
            mentor.longitude
          )
          return { ...mentor, distance }
        }
        return mentor
      })
      .sort((a, b) => {
        // Sort by distance if available
        const distA = (a as any).distance || Infinity
        const distB = (b as any).distance || Infinity
        return distA - distB
      })

    setFilteredMentors(nearbyMentors)

    if (nearbyMentors.length === 0) {
      setLocationError("No online mentors found nearby. Try expanding your search.")
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ))
  }

  const handleViewMore = async (mentor: Mentor) => {
    try {
      // Fetch full mentor details
      const response = await fetch(`http://127.0.0.1:8000/api/v1/mentors/detail/${mentor.id}/`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.mentor) {
          setSelectedMentor(data.mentor)
          setIsModalOpen(true)
        }
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 relative z-10 pt-24 pb-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect Mentor
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with verified mentors who can help you achieve your goals
            </p>

            {/* Search and Find Bar */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="search"
                    placeholder="Search mentors by name, subject, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full h-12 text-base"
                  />
                </div>
                <Button
                  onClick={getCurrentLocation}
                  disabled={isFindingNearby}
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2"
                >
                  {isFindingNearby ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finding...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Find Nearby
                    </>
                  )}
                </Button>
              </div>

              {/* Location Error */}
              {locationError && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{locationError}</span>
                </div>
              )}

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                {filteredMentors.length} {filteredMentors.length === 1 ? 'mentor' : 'mentors'} found
                {userLocation && " nearby"}
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No mentors found</p>
              <p className="text-gray-400 text-sm">
                {search ? "Try adjusting your search terms" : "Check back later for available mentors"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col h-full"
                >
                  {/* Header with Avatar and Price */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <button
                          onClick={() => {
                            setProfilePictureMentor(mentor)
                            setIsProfilePictureModalOpen(true)
                          }}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={mentor.avatar || '/images/user/user-01.jpg'}
                            alt={mentor.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 hover:border-blue-400 transition-colors"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/images/user/user-01.jpg'
                            }}
                          />
                        </button>
                        {mentor.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-gray-900 font-semibold text-base">
                            {mentor.name}
                          </h3>
                          {mentor.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                              <CheckCircle2 className="w-3 h-3 fill-blue-600 text-blue-600" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {mentor.title}
                        </p>
                        {mentor.is_online && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Online
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        ${mentor.hourly_rate}
                      </div>
                      <div className="text-xs text-gray-500">
                        /hour
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(mentor.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {mentor.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({mentor.total_reviews})
                    </span>
                  </div>

                  {/* Description/About */}
                  {mentor.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {mentor.description}
                    </p>
                  )}

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.specialization?.slice(0, 3).map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-blue-50 text-blue-700"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {mentor.specialization?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.specialization.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Location and Distance */}
                  {(mentor.city || mentor.country || (mentor as any).distance) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {mentor.city && mentor.country
                          ? `${mentor.city}, ${mentor.country}`
                          : mentor.country || mentor.city}
                        {(mentor as any).distance && (
                          <span className="ml-2 font-medium text-blue-600">
                            • {(mentor as any).distance.toFixed(1)} km away
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
                    <Button
                      onClick={() => handleViewMore(mentor)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View More
                    </Button>
                    <Button
                      onClick={() => {
                        setBookingMentor(mentor)
                        setIsBookingModalOpen(true)
                      }}
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Book Session
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {selectedMentor && (
        <MentorDetailsModal
          mentor={selectedMentor}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMentor(null)
          }}
          onBookSession={(mentorId) => {
            const mentorToBook = mentors.find(m => m.id === mentorId)
            if (mentorToBook) {
              setBookingMentor(mentorToBook)
              setIsBookingModalOpen(true)
              setIsModalOpen(false)
            }
          }}
        />
      )}

      {bookingMentor && (
        <BookingModal
          mentor={bookingMentor}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setBookingMentor(null)
          }}
        />
      )}

      {profilePictureMentor && (
        <ProfilePictureModal
          isOpen={isProfilePictureModalOpen}
          onClose={() => {
            setIsProfilePictureModalOpen(false)
            setProfilePictureMentor(null)
          }}
          imageUrl={profilePictureMentor.avatar || '/images/user/user-01.jpg'}
          mentorName={profilePictureMentor.name}
        />
      )}
    </div>
  )
}

