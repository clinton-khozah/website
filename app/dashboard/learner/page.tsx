"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Users, 
  Clock,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Calendar,
  Award,
  Star,
  CheckCircle2,
  Eye,
  MapPin,
  Navigation,
  Video,
  ExternalLink,
  Calendar as CalendarIcon
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MentorDetailsModal } from "@/components/mentors/mentor-details-modal"
import { BookingModal } from "@/components/mentors/booking-modal"
import { ProfilePictureModal } from "@/components/mentors/profile-picture-modal"
import { StudentProfileCompletionForm } from "@/components/dashboard/student-profile-completion-form"
import { GlobeViewer } from "@/components/mentors/globe-viewer"

const stats = [
  {
    name: "Total Sessions",
    value: "24",
    change: "+5 this month",
    icon: BookOpen,
    color: "#3B82F6" // Light Blue
  },
  {
    name: "Active Tutors",
    value: "8",
    change: "+2 new tutors",
    icon: Users,
    color: "#60A5FA" // Lighter Blue
  },
  {
    name: "Learning Hours",
    value: "48h",
    change: "+12h this month",
    icon: Clock,
    color: "#93C5FD" // Lightest Blue
  },
  {
    name: "Progress Score",
    value: "87%",
    change: "+5% improvement",
    icon: TrendingUp,
    color: "#3B82F6" // Light Blue
  }
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const progressData = {
  Mar: "72%",
  current: {
    amount: "87%",
    percentage: "15%",
    vsLastMonth: "vs last month",
    ofTotal: "87% completion rate"
  }
}

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
  is_online?: boolean
}

interface BookedSession {
  id: string
  mentor_id: number
  mentor_name?: string
  mentor_avatar?: string
  mentor_title?: string
  learner_name: string
  learner_email: string
  date: string
  time: string
  duration: number
  topic: string
  notes?: string
  meeting_type: string
  meeting_link?: string
  status: string
  amount: number
  created_at: string
}


export default function LearnerDashboard() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'sessions' | 'progress' | 'achievements'>('overview')
  const [userData, setUserData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [mentors, setMentors] = React.useState<Mentor[]>([])
  const [mentorsLoading, setMentorsLoading] = React.useState(true)
  const [selectedMentor, setSelectedMentor] = React.useState<Mentor | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [bookingMentor, setBookingMentor] = React.useState<Mentor | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false)
  const [profilePictureMentor, setProfilePictureMentor] = React.useState<Mentor | null>(null)
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = React.useState(false)
  const [isProfileCompletionOpen, setIsProfileCompletionOpen] = React.useState(false)
  const [isGlobalMentorSearchOpen, setIsGlobalMentorSearchOpen] = React.useState(false)
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null)
  const [isFindingLocation, setIsFindingLocation] = React.useState(false)
  const [bookedSessions, setBookedSessions] = React.useState<BookedSession[]>([])
  const [sessionsLoading, setSessionsLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        // First check if user is a mentor
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentors')
          .select('id, email')
          .eq('id', user.id)
          .single()

        if (!mentorError && mentorData) {
          // User is a mentor, redirect to tutor dashboard
          console.log('User is a mentor, redirecting to tutor dashboard')
          router.push('/dashboard/tutor')
          return
        }

        // Check if user is in students table
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single()

        if (studentError) {
          console.log('Student not found, creating student record...', studentError)

          // User not found in either table, create student record
          console.log('User not found in students or mentors, creating student record...')
          const { data: newStudent, error: createError } = await supabase
            .from('students')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              avatar_url: user.user_metadata?.avatar_url || null,
              bio: null,
              website: null,
              phone_number: null,
              date_of_birth: null,
              gender: null,
              country: null,
              city: null,
              timezone: null,
              native_language: null,
              languages_spoken: '[]',
              current_level: 'beginner',
              interests: '[]',
              learning_goals: null,
              preferred_learning_style: null,
              availability_hours: null,
              budget_range: null,
              social_links: '{}',
              settings: '{}',
              verified: user.email_confirmed_at ? true : false,
              status: 'active',
              is_complete: false,
              role: 'student',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating student record:', createError)
            setUserData({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            })
          } else {
            setUserData(newStudent)
            // Show profile completion form if profile is incomplete
            if (newStudent && newStudent.is_complete === false) {
              setIsProfileCompletionOpen(true)
            }
          }
        } else {
          setUserData(studentData)
          // Check if profile is complete
          if (studentData && studentData.is_complete === false) {
            setIsProfileCompletionOpen(true)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserData({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          })
        } else {
        router.push('/')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Fetch mentors from API
  React.useEffect(() => {
    const fetchMentors = async () => {
      try {
        setMentorsLoading(true)
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
          // Show all mentors in the overview tab
          // Ensure latitude and longitude are numbers
          const processedMentors = data.mentors.map((mentor: any) => ({
            ...mentor,
            latitude: mentor.latitude ? Number(mentor.latitude) : undefined,
            longitude: mentor.longitude ? Number(mentor.longitude) : undefined,
          }))
          console.log('Fetched mentors:', processedMentors.length, 'mentors with location:', processedMentors.filter((m: any) => m.latitude && m.longitude).length)
          setMentors(processedMentors)
        } else {
          console.error('Failed to fetch mentors:', data.message)
          setMentors([])
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
        setMentors([])
      } finally {
        setMentorsLoading(false)
      }
    }

    fetchMentors()
  }, [])

  // Fetch booked sessions for the current user
  React.useEffect(() => {
    const fetchBookedSessions = async () => {
      if (!userData?.email) return

      try {
        setSessionsLoading(true)
        // Fetch sessions from Supabase where learner_email matches current user's email
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            *,
            mentors (
              id,
              name,
              avatar,
              title
            )
          `)
          .eq('learner_email', userData.email)
          .order('date', { ascending: true })
          .order('time', { ascending: true })

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError)
          setBookedSessions([])
          return
        }

        // Transform the data to include mentor info
        const transformedSessions: BookedSession[] = (sessionsData || []).map((session: any) => ({
          id: session.id,
          mentor_id: session.mentor_id,
          mentor_name: session.mentors?.name || 'Unknown Mentor',
          mentor_avatar: session.mentors?.avatar || '/images/user/user-01.jpg',
          mentor_title: session.mentors?.title || '',
          learner_name: session.learner_name,
          learner_email: session.learner_email,
          date: session.date,
          time: session.time,
          duration: session.duration,
          topic: session.topic,
          notes: session.notes || '',
          meeting_type: session.meeting_type,
          meeting_link: session.meeting_link || '',
          status: session.status,
          amount: parseFloat(session.amount) || 0,
          created_at: session.created_at
        }))

        setBookedSessions(transformedSessions)
      } catch (error) {
        console.error('Error fetching sessions:', error)
        setBookedSessions([])
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchBookedSessions()
  }, [userData?.email])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400 opacity-50" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-gray-300" />
      )
    }

    return stars
  }

  // Logo colors for the circle background
  const circleColors = {
    overview: "rgba(59, 130, 246, 0.1)", // Light Blue transparent
    sessions: "rgba(96, 165, 250, 0.1)", // Lighter Blue transparent
    progress: "rgba(147, 197, 253, 0.1)", // Lightest Blue transparent
    achievements: "rgba(59, 130, 246, 0.1)" // Light Blue transparent
  }

  // Border colors for the circle with glow
  const circleBorderColors = {
    overview: "#3B82F6", // Light Blue
    sessions: "#60A5FA", // Lighter Blue
    progress: "#93C5FD", // Lightest Blue
    achievements: "#3B82F6" // Light Blue
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'sessions':
        return {
          title: "Sessions Overview",
          description: "Your learning sessions and schedule",
          amount: "24",
          percentage: "15%",
          comparison: "vs last month",
          share: "8 active tutors"
        }
      case 'progress':
        return {
          title: "Tasks Overview",
          description: "Your learning progress and achievements",
          amount: "87%",
          percentage: "15%",
          comparison: "vs last month",
          share: "87% completion rate"
        }
      case 'achievements':
        return {
          title: "Achievements Overview",
          description: "Your badges and accomplishments",
          amount: "12",
          percentage: "3",
          comparison: "new this month",
          share: "12 total achievements"
        }
      default:
        return {
          title: "Learning Overview",
          description: "Your learning journey at a glance",
          amount: progressData.current.amount,
          percentage: progressData.current.percentage,
          comparison: progressData.current.vsLastMonth,
          share: progressData.current.ofTotal
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const content = getTabContent()

  return (
    <DashboardLayout role="learner">
      <div className="space-y-6 p-6">
        {/* User Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData?.full_name || 'Learner'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your learning journey.
            </p>
          </div>
          <button
            onClick={() => {
              setIsGlobalMentorSearchOpen(true)
              // Always set searching state when opening
              setIsFindingLocation(true)
              // Get user location when opening
              if (!userLocation && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setUserLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    })
                    // Keep searching state for a bit to show the UI
                    setTimeout(() => {
                      setIsFindingLocation(false)
                    }, 1000)
                  },
                  (error) => {
                    console.error("Error getting location:", error)
                    // Keep searching state for a bit even on error
                    setTimeout(() => {
                      setIsFindingLocation(false)
                    }, 1000)
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                  }
                )
              } else {
                // If location already exists, still show searching briefly
                setTimeout(() => {
                  setIsFindingLocation(false)
                }, 500)
              }
            }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <MapPin className="h-5 w-5" />
            <span>Find Nearby Mentor</span>
          </button>
        </div>

        {/* Horizontal Lines */}
        <div className="flex flex-col gap-2 mb-8">
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-blue-400 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-blue-300 to-transparent w-3/4"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-blue-200 to-transparent w-1/2"
            initial={{ width: 0 }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-blue-100 to-transparent w-1/4"
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm"
              style={{
                borderColor: stat.color + '40',
                boxShadow: `0 4px 6px -1px ${stat.color}20, 0 2px 4px -1px ${stat.color}10`,
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                    {stat.name}
                  </span>
                  <stat.icon 
                    className="h-4 w-4 transition-colors" 
                    style={{ color: stat.color }}
                  />
                </div>
                <motion.div 
                  className="text-3xl font-bold mb-2 transition-all duration-300"
                  style={{ 
                    color: stat.color
                  }}
                >
                  {stat.value}
                </motion.div>
                <div 
                  className="text-sm text-gray-600 transition-colors"
                >
                  {stat.change}
                </div>
              </div>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ 
                  background: `radial-gradient(circle at center, ${stat.color} 0%, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'sessions' ? 'border-blue-400 text-blue-600 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Sessions
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'progress' ? 'border-blue-300 text-blue-600 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tasks
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'achievements' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Achievements
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Tutors</h2>
              
              {mentorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : mentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor, index) => (
                    <motion.div 
                      key={mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                      className="relative bg-white rounded-lg p-6 group hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col h-full"
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
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
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
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {mentor.specialization?.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{mentor.specialization.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push('/dashboard/learner/mentors')
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 mb-2"
                        >
                          <Eye className="w-4 h-4" />
                          View More
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setBookingMentor(mentor)
                            setIsBookingModalOpen(true)
                          }}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 border border-blue-200"
                        >
                          Book Session
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No tutors available at the moment</p>
                </div>
              )}

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onClick={() => router.push('/dashboard/learner/mentors')}
                className="w-full mt-8 py-3 text-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                View all tutors →
              </motion.button>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h2>
                <p className="text-gray-600">{content.description}</p>
              </div>

              {sessionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : bookedSessions.length > 0 ? (
                <div className="space-y-4">
                  {bookedSessions.map((session) => {
                    const sessionDate = new Date(session.date)
                    const sessionDateTime = new Date(`${session.date}T${session.time}`)
                    const isUpcoming = sessionDateTime > new Date()
                    const isPast = sessionDateTime < new Date()
                    const statusColors: Record<string, string> = {
                      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
                      completed: 'bg-green-100 text-green-700 border-green-200',
                      cancelled: 'bg-red-100 text-red-700 border-red-200',
                      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Left Section - Session Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              {/* Mentor Avatar */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={session.mentor_avatar || '/images/user/user-01.jpg'}
                                  alt={session.mentor_name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = '/images/user/user-01.jpg'
                                  }}
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>

                              {/* Session Details */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {session.topic}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[session.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1).replace('-', ' ')}
                                  </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{session.mentor_name}</span>
                                    {session.mentor_title && (
                                      <span className="text-gray-500">• {session.mentor_title}</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                                    <span>
                                      {sessionDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>
                                      {new Date(`2000-01-01T${session.time}`).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                      })} • {session.duration} minutes
                                    </span>
                                  </div>

                                  {session.notes && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">Notes: </span>
                                        {session.notes}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="font-semibold text-gray-900">
                                      ${session.amount.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500">paid</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Meeting Link & Actions */}
                          <div className="flex flex-col gap-3 md:items-end">
                            {session.meeting_link && session.meeting_type !== 'in-person' ? (
                              <a
                                href={session.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : session.meeting_type === 'in-person' ? (
                              <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                <MapPin className="w-4 h-4 inline-block mr-2" />
                                In-Person Session
                              </div>
                            ) : (
                              <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                                No meeting link available
                              </div>
                            )}

                            {session.meeting_link && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(session.meeting_link || '')
                                  // You could add a toast notification here
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                Copy meeting link
                              </button>
                            )}

                            <div className="text-xs text-gray-500 mt-2">
                              Meeting Type: <span className="font-medium capitalize">{session.meeting_type.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions booked yet</h3>
                  <p className="text-gray-600 mb-4">Start your learning journey by booking a session with a mentor</p>
                  <button
                    onClick={() => router.push('/dashboard/learner/mentors')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <BookOpen className="w-4 h-4" />
                    Browse Mentors
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{content.title}</h2>
              <p className="text-gray-600">{content.description}</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{content.title}</h2>
              <p className="text-gray-600">{content.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Details Modal */}
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

      {/* Booking Modal */}
      <BookingModal
        mentor={bookingMentor}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setBookingMentor(null)
        }}
      />

      {/* Profile Picture Modal */}
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

      {/* Global Mentor Search Modal */}
      <GlobeViewer
        isOpen={isGlobalMentorSearchOpen}
        onClose={() => {
          setIsGlobalMentorSearchOpen(false)
          setIsFindingLocation(false)
        }}
        userLocation={userLocation}
        mentors={mentors.map(mentor => {
          // Ensure all data is passed correctly
          const mappedMentor = {
            id: mentor.id,
            name: mentor.name,
            latitude: mentor.latitude ? Number(mentor.latitude) : undefined,
            longitude: mentor.longitude ? Number(mentor.longitude) : undefined,
            city: mentor.city || undefined,
            country: mentor.country || undefined,
            is_online: mentor.is_online ?? true,
            avatar: mentor.avatar || undefined,
            specialization: mentor.specialization || [],
            title: mentor.title || undefined,
            rating: mentor.rating || 0,
            total_reviews: mentor.total_reviews || 0
          }
          return mappedMentor
        })}
        onMentorClick={(mentor) => {
          const fullMentor = mentors.find(m => m.id === mentor.id)
          if (fullMentor) {
            setSelectedMentor(fullMentor)
            setIsModalOpen(true)
            setIsGlobalMentorSearchOpen(false)
          }
        }}
        userAvatar={userData?.avatar_url}
        userName={userData?.full_name}
        isSearching={isFindingLocation}
        onRefresh={() => {
          if (navigator.geolocation) {
            setIsFindingLocation(true)
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setUserLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                })
                setIsFindingLocation(false)
              },
              (error) => {
                console.error("Error getting location:", error)
                setIsFindingLocation(false)
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            )
          }
        }}
      />

      {/* Student Profile Completion Form */}
      {userData && (
        <StudentProfileCompletionForm
          isOpen={isProfileCompletionOpen}
          onClose={() => setIsProfileCompletionOpen(false)}
          userId={userData.id}
          onComplete={() => {
            setIsProfileCompletionOpen(false)
            // Refresh user data
            const fetchUserData = async () => {
              const { data: { user } } = await supabase.auth.getUser()
              if (user) {
                const { data: studentData } = await supabase
                  .from('students')
                  .select('*')
                  .eq('id', user.id)
                  .single()
                if (studentData) {
                  setUserData(studentData)
                }
              }
            }
            fetchUserData()
          }}
        />
      )}
    </DashboardLayout>
  )
}
