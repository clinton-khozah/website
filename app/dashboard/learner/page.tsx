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
  Calendar as CalendarIcon,
  DollarSign,
  Sparkles
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MentorDetailsModal } from "@/components/mentors/mentor-details-modal"
import { BookingModal } from "@/components/mentors/booking-modal"
import { ProfilePictureModal } from "@/components/mentors/profile-picture-modal"
import { StudentProfileCompletionForm } from "@/components/dashboard/student-profile-completion-form"
import { GlobeViewer } from "@/components/mentors/globe-viewer"
import { convertAndFormatPrice } from '@/lib/currency'

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
  const [convertedAmounts, setConvertedAmounts] = React.useState<Record<string, string>>({})
  const [convertedHourlyRates, setConvertedHourlyRates] = React.useState<Record<number, string>>({})
  const [sessionsLoading, setSessionsLoading] = React.useState(false)
  const [mentorsWithAds, setMentorsWithAds] = React.useState<Set<number>>(new Set())
  const router = useRouter()

  // Optimized: Fetch user data and sessions in parallel, mentors only when needed
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        // Parallel check for mentor and student
        const [mentorResult, studentResult] = await Promise.all([
          supabase.from('mentors').select('id, email').eq('id', user.id).maybeSingle(),
          supabase.from('students').select('*').eq('id', user.id).maybeSingle()
        ])

        // If user is a mentor/tutor, redirect to company dashboard
        if (mentorResult.data && !mentorResult.error) {
          console.log('User is a mentor/tutor, redirecting to company dashboard')
          router.push('/dashboard')
          return
        }

        // Also check user metadata as fallback
        const userType = user.user_metadata?.user_type
        if (userType === 'tutor' || userType === 'mentor') {
          console.log('User type from metadata is tutor/mentor, redirecting to company dashboard')
          router.push('/dashboard')
          return
        }

        // Only create student record if user is NOT a mentor and doesn't exist in students table
        if (studentResult.error && !mentorResult.data) {
          // Double-check user metadata to ensure they're not a mentor
          const userType = user.user_metadata?.user_type
          if (userType !== 'tutor' && userType !== 'mentor') {
            // Create student record
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
            setUserData({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            })
          } else {
            setUserData(newStudent)
            if (newStudent && newStudent.is_complete === false) {
              setIsProfileCompletionOpen(true)
            }
          }
          }
        } else if (studentResult.data) {
          setUserData(studentResult.data)
          if (studentResult.data && studentResult.data.is_complete === false) {
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

  // Auto-detect user location on page load for currency conversion
  React.useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location for currency conversion:", error)
          // Try to get location from user's country in their profile
          if (userData?.country) {
            // We can use a default location for the country, but for now just log
            console.log("User country:", userData.country)
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 3600000 // Cache for 1 hour
        }
      )
    }
  }, [userLocation, userData?.country])

  // Lazy load mentors - only fetch when overview tab is active or when needed
  React.useEffect(() => {
    // Only fetch mentors if we're on overview tab or when explicitly needed
    if (activeTab !== 'overview' && !isGlobalMentorSearchOpen) {
      return
    }

    const fetchMentors = async () => {
      try {
        setMentorsLoading(true)
        
        // Try API first, fallback to Supabase if API fails
        let mentorsData: any[] = []
        
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/mentors/list/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.mentors) {
              mentorsData = data.mentors
            }
          }
        } catch (apiError) {
          console.warn('API fetch failed, trying Supabase directly:', apiError)
          // Fallback to Supabase
          const { data, error } = await supabase
            .from('mentors')
            .select('*')
          
          if (error) {
            throw error
          }
          
          if (data) {
            mentorsData = data
          }
        }

        if (mentorsData.length > 0) {
          // Process mentors more efficiently
          const processedMentors = mentorsData.map((mentor: any) => {
            // Parse specialization from JSON string if needed
            let specialization = mentor.specialization || []
            if (typeof specialization === 'string') {
              try {
                specialization = JSON.parse(specialization)
              } catch {
                specialization = []
              }
            }
            if (!Array.isArray(specialization)) {
              specialization = []
            }

            // Parse languages from JSON string if needed
            let languages = mentor.languages || []
            if (typeof languages === 'string') {
              try {
                languages = JSON.parse(languages)
              } catch {
                languages = []
              }
            }
            if (!Array.isArray(languages)) {
              languages = []
            }

            return {
            ...mentor,
            latitude: mentor.latitude ? Number(mentor.latitude) : undefined,
            longitude: mentor.longitude ? Number(mentor.longitude) : undefined,
              specialization,
              languages,
            }
          })
          setMentors(processedMentors)
          console.log(`Loaded ${processedMentors.length} mentors on dashboard`)
        } else {
          console.warn('No mentors found in database')
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
  }, [activeTab, isGlobalMentorSearchOpen])

  // Fetch active ad campaigns for mentors
  React.useEffect(() => {
    const fetchActiveCampaigns = async () => {
      if (mentors.length === 0) return

      try {
        // Fetch all active campaigns from Supabase
        const { data: campaigns, error } = await supabase
          .from('ad_campaigns')
          .select('mentor_id')
          .eq('status', 'active')

        if (error) {
          console.error('Error fetching active campaigns:', error)
          return
        }

        if (campaigns && campaigns.length > 0) {
          // Create a set of mentor IDs with active campaigns
          const mentorIdsWithAds = new Set(campaigns.map((campaign: any) => Number(campaign.mentor_id)))
          setMentorsWithAds(mentorIdsWithAds)
        }
      } catch (error) {
        console.error('Error fetching active campaigns:', error)
      }
    }

    fetchActiveCampaigns()
  }, [mentors])

  // Fetch booked sessions AND all available sessions - only when needed (sessions tab or overview)
  React.useEffect(() => {
    const fetchBookedSessions = async () => {
      if (!userData?.email) {
        console.log('No user email, skipping session fetch')
        return
      }
      // Only fetch if we're on sessions tab or overview tab
      if (activeTab !== 'sessions' && activeTab !== 'overview') {
        console.log('Not on sessions/overview tab, skipping fetch. Active tab:', activeTab)
        return
      }

      console.log('Starting to fetch sessions for user:', userData.email, 'Active tab:', activeTab)
      try {
        setSessionsLoading(true)
        // Optimized query - limit to recent sessions for overview, all for sessions tab
        const limit = activeTab === 'overview' ? 5 : 100
        
        // Fetch sessions booked by this student
        const { data: bookedSessionsData, error: bookedSessionsError } = await supabase
          .from('sessions')
          .select(`
            *,
            mentors (
              id,
              name,
              avatar,
              title,
              description,
              specialization,
              rating,
              total_reviews,
              hourly_rate,
              experience,
              languages,
              availability,
              country,
              is_verified,
              email,
              phone_number,
              qualifications,
              linkedin_profile,
              github_profile,
              twitter_profile,
              facebook_profile,
              instagram_profile,
              personal_website
            ),
            payments (
              id,
              status,
              payment_intent_id,
              paid_at
            )
          `)
          .eq('learner_email', userData.email)
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(limit)

        // Fetch all upcoming public sessions created by mentors/tutors (available for booking)
        // Fetch ALL sessions first, then filter client-side to debug
        const today = new Date().toISOString().split('T')[0]
        
        console.log('Fetching public sessions with date >=', today)
        
        // Simplified query: fetch all sessions where private is false or null
        const { data: allSessionsData, error: allSessionsError } = await supabase
          .from('sessions')
          .select(`
            *,
            mentors (
              id,
              name,
              avatar,
              title,
              description,
              specialization,
              rating,
              total_reviews,
              hourly_rate,
              experience,
              languages,
              availability,
              country,
              is_verified,
              email,
              phone_number,
              qualifications,
              linkedin_profile,
              github_profile,
              twitter_profile,
              facebook_profile,
              instagram_profile,
              personal_website
            ),
            payments (
              id,
              status,
              payment_intent_id,
              paid_at
            )
          `)
          .gte('date', today)
          .eq('status', 'scheduled')
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(limit * 2) // Get more to filter
        
        console.log('All sessions fetched:', allSessionsData?.length || 0, allSessionsData)
        
        // Filter client-side: only show public sessions (private = false or null)
        const availableSessionsData = (allSessionsData || []).filter((session: any) => {
          const isPublic = session.private === false || session.private === null
          console.log(`Session ${session.id} (${session.topic}): private=${session.private}, isPublic=${isPublic}`)
          return isPublic
        })
        
        const availableSessionsError = allSessionsError
        
        console.log('Filtered public sessions:', availableSessionsData.length)

        if (bookedSessionsError) {
          console.error('Error fetching booked sessions:', bookedSessionsError)
        }
        if (availableSessionsError) {
          console.error('Error fetching available sessions:', availableSessionsError)
          // Don't return early, continue with booked sessions even if available sessions fail
        }

        // Combine booked sessions and available public sessions, removing duplicates
        const allSessions = [...(bookedSessionsData || []), ...(availableSessionsData || [])]
        const uniqueSessions = Array.from(
          new Map(allSessions.map(session => [session.id, session])).values()
        )
        
        // Show all sessions (booked by user OR public sessions)
        // No additional filtering needed since we already filtered in the query
        const sessionsData = uniqueSessions

        console.log('Sessions data before transformation:', sessionsData.length, sessionsData)

        // Transform the data efficiently
        const transformedSessions: BookedSession[] = sessionsData
          .filter((session: any) => {
            const hasMentor = !!session.mentors
            if (!hasMentor) {
              console.log('Filtering out session without mentor:', session.id, session.topic)
            }
            return hasMentor
          }) // Only include sessions with mentor data
          .map((session: any) => {
          // Check if payment exists and is successful
          const payment = Array.isArray(session.payments) ? session.payments[0] : session.payments
          const isPaid = payment && (payment.status === 'succeeded' || payment.status === 'completed')
          
          // Build full mentor object for details modal
          const mentorData: Mentor | null = session.mentors ? {
            id: session.mentors.id,
            supabase_id: '',
            name: session.mentors.name || 'Unknown Mentor',
            title: session.mentors.title || '',
            description: session.mentors.description || '',
            specialization: Array.isArray(session.mentors.specialization) 
              ? session.mentors.specialization 
              : typeof session.mentors.specialization === 'string'
                ? JSON.parse(session.mentors.specialization || '[]')
                : [],
            rating: session.mentors.rating || 0,
            total_reviews: session.mentors.total_reviews || 0,
            hourly_rate: session.mentors.hourly_rate || 0,
            avatar: session.mentors.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.mentors.name || 'User')}&background=3B82F6&color=fff&size=128`,
            experience: session.mentors.experience?.toString() || '0',
            languages: Array.isArray(session.mentors.languages)
              ? session.mentors.languages
              : typeof session.mentors.languages === 'string'
                ? JSON.parse(session.mentors.languages || '[]')
                : [],
            availability: session.mentors.availability || 'Available now',
            country: session.mentors.country || '',
            is_verified: session.mentors.is_verified === true || session.mentors.is_verified === 'true',
            email: session.mentors.email || '',
            phone_number: session.mentors.phone_number || '',
            qualifications: session.mentors.qualifications || '',
            linkedin_profile: session.mentors.linkedin_profile || '',
            github_profile: session.mentors.github_profile || '',
            twitter_profile: session.mentors.twitter_profile || '',
            facebook_profile: session.mentors.facebook_profile || '',
            instagram_profile: session.mentors.instagram_profile || '',
            personal_website: session.mentors.personal_website || '',
            sessions_conducted: 0
          } : null
          
          return {
          id: session.id,
          mentor_id: session.mentor_id,
          mentor_name: session.mentors?.name || 'Unknown Mentor',
            mentor_avatar: session.mentors?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.mentors?.name || 'User')}&background=3B82F6&color=fff&size=128`,
          mentor_title: session.mentors?.title || '',
            mentor_data: mentorData,
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
            is_paid: isPaid,
            payment_id: payment?.id || null,
          created_at: session.created_at
          }
        })

        console.log('Fetched sessions:', {
          booked: bookedSessionsData?.length || 0,
          available: availableSessionsData?.length || 0,
          unique: uniqueSessions.length,
          total: transformedSessions.length,
          sessions: transformedSessions.map(s => ({ 
            id: s.id, 
            topic: s.topic, 
            learner_email: s.learner_email,
            mentor_name: s.mentor_name,
            private: (sessionsData.find((ss: any) => ss.id === s.id) as any)?.private
          }))
        })
        
        // Debug: Log raw data
        console.log('Raw available sessions:', availableSessionsData)
        console.log('Raw booked sessions:', bookedSessionsData)

        setBookedSessions(transformedSessions)
      } catch (error) {
        console.error('Error fetching sessions:', error)
        setBookedSessions([])
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchBookedSessions()
  }, [userData?.email, activeTab])

  // Convert all session amounts when sessions or user location changes
  React.useEffect(() => {
    const convertAllAmounts = async () => {
      if (bookedSessions.length === 0) {
        setConvertedAmounts({})
        return
      }
      
      const conversions: Record<string, string> = {}
      
      for (const session of bookedSessions) {
        try {
          // Assume amount in database is in USD
          const usdAmount = session.amount
          if (userLocation) {
            const result = await convertAndFormatPrice(usdAmount, userLocation)
            conversions[session.id] = result.formatted
          } else {
            // No location, use USD
            conversions[session.id] = `$${usdAmount.toFixed(2)}`
          }
        } catch (error) {
          console.error(`Error converting currency for session ${session.id}:`, error)
          // Fallback to USD
          conversions[session.id] = `$${session.amount.toFixed(2)}`
        }
      }
      
      setConvertedAmounts(conversions)
    }
    
    convertAllAmounts()
  }, [bookedSessions, userLocation])

  // Convert mentor hourly rates when mentors or user location changes
  React.useEffect(() => {
    const convertHourlyRates = async () => {
      if (mentors.length === 0) {
        setConvertedHourlyRates({})
        return
      }
      
      const conversions: Record<number, string> = {}
      
      for (const mentor of mentors) {
        try {
          // Assume hourly rate in database is in USD
          const usdRate = mentor.hourly_rate
          if (userLocation) {
            const result = await convertAndFormatPrice(usdRate, userLocation)
            conversions[mentor.id] = result.formatted
          } else {
            // No location, use USD
            conversions[mentor.id] = `$${usdRate.toFixed(2)}`
          }
        } catch (error) {
          console.error(`Error converting hourly rate for mentor ${mentor.id}:`, error)
          // Fallback to USD
          conversions[mentor.id] = `$${mentor.hourly_rate.toFixed(2)}`
        }
      }
      
      setConvertedHourlyRates(conversions)
    }
    
    convertHourlyRates()
  }, [mentors, userLocation])

  // Memoize renderStars to avoid recreating on every render
  const renderStars = React.useCallback((rating: number) => {
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
  }, [])

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

  // Memoize tab content to avoid recalculation
  const content = React.useMemo(() => {
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
  }, [activeTab])

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
                      className={`relative bg-white rounded-lg p-6 group hover:shadow-lg transition-all duration-300 border flex flex-col h-full ${
                        mentorsWithAds.has(mentor.id) 
                          ? 'border-yellow-400 border-2 shadow-yellow-100' 
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Sponsored Badge - Top Right Corner */}
                      {mentorsWithAds.has(mentor.id) && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 rounded-full"></div>
                            <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full p-2 shadow-lg border-2 border-yellow-300">
                              <Star className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>
                        </motion.div>
                      )}
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
                                src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff&size=128`}
                                alt={mentor.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 hover:border-blue-400 transition-colors"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff&size=128`
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
                              {mentorsWithAds.has(mentor.id) && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold border-2 border-yellow-300 shadow-lg"
                                  title="This mentor has active advertising"
                                >
                                  <Sparkles className="w-3 h-3 fill-white" />
                                  <span className="font-semibold">Sponsored</span>
                                </motion.span>
                              )}
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
                            {convertedHourlyRates[mentor.id] || `$${mentor.hourly_rate.toFixed(2)}`}
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
                      </div>

                      {/* Description/About */}
                      {mentor.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {mentor.description}
                        </p>
                      )}

                      {/* Specializations */}
                      {(() => {
                        // Parse specialization from JSON string if needed
                        let specializations: string[] = []
                        if (Array.isArray(mentor.specialization)) {
                          specializations = mentor.specialization
                        } else if (typeof mentor.specialization === 'string') {
                          try {
                            specializations = JSON.parse(mentor.specialization || '[]')
                          } catch {
                            specializations = []
                          }
                        }
                        
                        return specializations.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                            {specializations.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                            {specializations.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                                +{specializations.length - 3}
                          </span>
                        )}
                      </div>
                        ) : null
                      })()}

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
                    const meetingEndTime = new Date(sessionDateTime.getTime() + (session.duration * 60000))
                    const now = new Date()
                    const isUpcoming = sessionDateTime > now
                    const isPast = sessionDateTime < now
                    const isMeetingActive = now >= sessionDateTime && now <= meetingEndTime
                    const isEnded = now > meetingEndTime
                    const isMySession = session.learner_email === userData?.email
                    const isAvailableSession = !isMySession && (session.learner_name === 'TBD' || session.learner_email === 'tbd@example.com')
                    
                    // Determine display status based on time
                    let displayStatus = session.status
                    let displayStatusLabel = session.status.charAt(0).toUpperCase() + session.status.slice(1).replace('-', ' ')
                    
                    if (isMeetingActive && session.status === 'scheduled') {
                      displayStatus = 'in-progress'
                      displayStatusLabel = 'Ongoing'
                    } else if (isEnded && (session.status === 'scheduled' || session.status === 'in-progress')) {
                      displayStatus = 'completed'
                      displayStatusLabel = 'Ended'
                    }
                    
                    const statusColors: Record<string, string> = {
                      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
                      completed: 'bg-green-100 text-green-700 border-green-200',
                      cancelled: 'bg-red-100 text-red-700 border-red-200',
                      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
                      'ongoing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
                      'ended': 'bg-gray-100 text-gray-700 border-gray-200'
                    }

                    const cardBgClass = isUpcoming && isAvailableSession 
                      ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200 hover:!border-green-400' 
                      : 'bg-white border border-gray-200 hover:!border-green-400 hover:!border-2'
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.4,
                          delay: bookedSessions.indexOf(session) * 0.05,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        whileHover={{ 
                          transition: { duration: 0.2 }
                        }}
                        className={`${cardBgClass} rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                      >
                        {/* Blue accent bar for upcoming available sessions */}
                        {isUpcoming && isAvailableSession && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                          />
                        )}
                        
                        {/* Subtle pulse animation for available sessions */}
                        {isUpcoming && isAvailableSession && (
                          <motion.div
                            animate={{ 
                              opacity: [0.3, 0.6, 0.3],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"
                          />
                        )}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Left Section - Session Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              {/* Mentor Avatar */}
                              <motion.div 
                                className="relative flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="relative">
                                <img
                                    src={session.mentor_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.mentor_name)}&background=3B82F6&color=fff&size=128`}
                                  alt={session.mentor_name}
                                    className={`w-16 h-16 rounded-full object-cover border-2 ${
                                      isUpcoming && isAvailableSession 
                                        ? 'border-blue-400 shadow-lg shadow-blue-200' 
                                        : 'border-blue-200'
                                    }`}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.mentor_name)}&background=3B82F6&color=fff&size=128`
                                    }}
                                  />
                                  {isUpcoming && isAvailableSession && (
                                    <motion.div
                                      animate={{ 
                                        boxShadow: [
                                          '0 0 0 0 rgba(59, 130, 246, 0.7)',
                                          '0 0 0 8px rgba(59, 130, 246, 0)',
                                        ]
                                      }}
                                      transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                      }}
                                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                                    />
                                  )}
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                              </div>
                              </motion.div>

                              {/* Session Details */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                  <motion.h3 
                                    className={`text-xl font-bold ${
                                      isUpcoming && isAvailableSession 
                                        ? 'text-blue-900' 
                                        : 'text-gray-900'
                                    }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    {session.topic}
                                  </motion.h3>
                                  <motion.span 
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${
                                      statusColors[displayStatus] || 'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.15 }}
                                  >
                                    {displayStatusLabel}
                                  </motion.span>
                                </div>

                                {/* Mentor Name */}
                                <motion.div 
                                  className="flex items-center gap-2 mb-3"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <Users className={`w-4 h-4 ${
                                    isUpcoming && isAvailableSession 
                                      ? 'text-blue-600' 
                                      : 'text-gray-500'
                                  }`} />
                                  <span className={`font-semibold ${
                                    isUpcoming && isAvailableSession 
                                      ? 'text-blue-800' 
                                      : 'text-gray-700'
                                  }`}>
                                    {session.mentor_name}
                                  </span>
                                    {session.mentor_title && (
                                    <span className={`text-sm ${
                                      isUpcoming && isAvailableSession 
                                        ? 'text-blue-600' 
                                        : 'text-gray-500'
                                    }`}>
                                      • {session.mentor_title}
                                    </span>
                                    )}
                                </motion.div>

                                <div className="space-y-3 text-sm">
                                  {/* Payment Status Badge */}
                                  <motion.div 
                                    className="flex items-center gap-2"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                  >
                                    {session.learner_email === userData?.email ? (
                                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${session.is_paid ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-orange-100 text-orange-700 border border-orange-300'}`}>
                                        {session.is_paid ? 'Paid' : 'Awaiting Payment'}
                                      </span>
                                    ) : (
                                      <motion.span 
                                        className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400 shadow-md"
                                        animate={isUpcoming && isAvailableSession ? {
                                          boxShadow: [
                                            '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                                            '0 4px 12px -1px rgba(59, 130, 246, 0.5)',
                                            '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                                          ]
                                        } : {}}
                                        transition={{ 
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }}
                                      >
                                        ✨ Available
                                      </motion.span>
                                    )}
                                  </motion.div>

                                  {/* Student Info for Available Sessions */}
                                  {session.learner_name === 'TBD' || session.learner_email === 'tbd@example.com' ? (
                                    <motion.div 
                                      className={`p-4 rounded-lg border ${
                                        isUpcoming && isAvailableSession
                                          ? 'bg-blue-50/80 border-blue-200 shadow-sm'
                                          : 'bg-gray-50 border-gray-200'
                                      }`}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.3 }}
                                    >
                                      <p className={`text-xs font-bold mb-1 ${
                                        isUpcoming && isAvailableSession
                                          ? 'text-blue-800'
                                          : 'text-gray-700'
                                      }`}>
                                        No student assigned yet
                                      </p>
                                      <p className={`text-xs ${
                                        isUpcoming && isAvailableSession
                                          ? 'text-blue-600'
                                          : 'text-gray-500'
                                      }`}>
                                        Waiting for a student to book this session
                                      </p>
                                    </motion.div>
                                  ) : session.learner_email === userData?.email ? (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                      <p className="text-xs font-semibold text-blue-900 mb-1">Your Session</p>
                                      <p className="text-xs text-blue-700">You have booked this session</p>
                                  </div>
                                  ) : null}

                                  {/* Date */}
                                  <motion.div 
                                    className={`flex items-center gap-2 ${
                                      isUpcoming && isAvailableSession
                                        ? 'text-blue-800'
                                        : 'text-gray-700'
                                    }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 }}
                                  >
                                    <CalendarIcon className={`w-4 h-4 ${
                                      isUpcoming && isAvailableSession
                                        ? 'text-blue-600'
                                        : 'text-gray-500'
                                    }`} />
                                    <span className="font-medium">
                                      {sessionDate.toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </motion.div>

                                  {/* Time & Duration */}
                                  <motion.div 
                                    className={`flex items-center gap-2 ${
                                      isUpcoming && isAvailableSession
                                        ? 'text-blue-800'
                                        : 'text-gray-700'
                                    }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                  >
                                    <Clock className={`w-4 h-4 ${
                                      isUpcoming && isAvailableSession
                                        ? 'text-blue-600'
                                        : 'text-gray-500'
                                    }`} />
                                    <span className="font-medium">
                                      {new Date(`2000-01-01T${session.time}`).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                      })} • {session.duration} min
                                    </span>
                                  </motion.div>

                                  {/* Amount */}
                                  <motion.div 
                                    className={`flex items-center gap-2 ${
                                      isUpcoming && isAvailableSession
                                        ? 'text-blue-800'
                                        : 'text-gray-700'
                                    }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.45 }}
                                  >
                                    <span className={`font-bold text-lg ${
                                      isUpcoming && isAvailableSession
                                        ? 'text-blue-900'
                                        : 'text-gray-900'
                                      }`}>
                                      {convertedAmounts[session.id] || `$${session.amount.toFixed(2)}`}
                                    </span>
                                  </motion.div>

                                  {/* Meeting Type */}
                                  {session.meeting_type && (
                                    <motion.div 
                                      className={`flex items-center gap-2 ${
                                        isUpcoming && isAvailableSession
                                          ? 'text-blue-800'
                                          : 'text-gray-700'
                                      }`}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.5 }}
                                    >
                                      <Video className={`w-4 h-4 ${
                                        isUpcoming && isAvailableSession
                                          ? 'text-blue-600'
                                          : 'text-gray-500'
                                      }`} />
                                      <span className="font-medium capitalize">{session.meeting_type.replace('-', ' ')}</span>
                                    </motion.div>
                                  )}

                                  {/* Notes */}
                                  {session.notes && (
                                    <motion.div 
                                      className={`mt-4 pt-4 border-t ${
                                        isUpcoming && isAvailableSession
                                          ? 'border-blue-200'
                                          : 'border-gray-200'
                                      }`}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.55 }}
                                    >
                                      <p className={`text-xs font-bold mb-2 ${
                                        isUpcoming && isAvailableSession
                                          ? 'text-blue-800'
                                          : 'text-gray-700'
                                      }`}>
                                        Notes
                                      </p>
                                      <p className={`text-sm ${
                                        isUpcoming && isAvailableSession
                                          ? 'text-blue-700'
                                          : 'text-gray-600'
                                      }`}>
                                        {session.notes}
                                      </p>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Meeting Link & Actions */}
                          <div className="flex flex-col gap-3 md:items-end">
                            {/* View Mentor Details Button */}
                            {session.mentor_data && (
                              <button
                                onClick={() => {
                                  setSelectedMentor(session.mentor_data!)
                                  setIsModalOpen(true)
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                View Mentor Details
                              </button>
                            )}

                            {/* Join Meeting / Pay / Book Button */}
                            {(() => {
                              const sessionDateTime = new Date(`${session.date}T${session.time}`)
                              const meetingEndTime = new Date(sessionDateTime.getTime() + (session.duration * 60000))
                              const now = new Date()
                              const isMeetingActive = now >= sessionDateTime && now <= meetingEndTime
                              const isUpcoming = sessionDateTime > now
                              const isEnded = now > meetingEndTime
                              const isMySession = session.learner_email === userData?.email

                              // If it's my session and I've paid
                              if (isMySession && session.is_paid) {
                                if (isMeetingActive && session.meeting_link && session.meeting_type !== 'in-person') {
                                  return (
                                    <>
                              <a
                                href={session.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                              >
                                <Video className="w-4 h-4" />
                                        Join Meeting Now
                                <ExternalLink className="w-3 h-3" />
                              </a>
                                      <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
                                        <Clock className="w-3 h-3 inline-block mr-1" />
                                        Meeting is ongoing
                                      </div>
                                    </>
                                  )
                                } else if (isEnded && session.meeting_type !== 'in-person') {
                                  return (
                                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                      <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
                                      Meeting has ended
                                    </div>
                                  )
                                } else if (isUpcoming && session.meeting_link && session.meeting_type !== 'in-person') {
                                  return (
                                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                      <Clock className="w-4 h-4 inline-block mr-2" />
                                      Starts {sessionDateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {sessionDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </div>
                                  )
                                } else if (session.meeting_type === 'in-person') {
                                  if (isEnded) {
                                    return (
                                      <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                        <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
                                        Session has ended
                                      </div>
                                    )
                                  } else if (isMeetingActive) {
                                    return (
                                      <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                        <MapPin className="w-4 h-4 inline-block mr-2" />
                                        Session is ongoing
                                      </div>
                                    )
                                  } else {
                                    return (
                              <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                <MapPin className="w-4 h-4 inline-block mr-2" />
                                In-Person Session
                              </div>
                                    )
                                  }
                                }
                              }
                              
                              // If it's an available session (not booked by me)
                              if (!isMySession && (session.learner_name === 'TBD' || session.learner_email === 'tbd@example.com')) {
                                return (
                                  <motion.button
                                    onClick={() => {
                                      if (session.mentor_data) {
                                        setBookingMentor(session.mentor_data)
                                        setIsBookingModalOpen(true)
                                      }
                                    }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/50 relative overflow-hidden"
                                    whileHover={{ 
                                      scale: 1.05,
                                      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={isUpcoming ? {
                                      boxShadow: [
                                        '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                                        '0 10px 30px -5px rgba(59, 130, 246, 0.6)',
                                        '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                                      ]
                                    } : {}}
                                    transition={{ 
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      animate={{
                                        x: ['-100%', '100%']
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                    <BookOpen className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10">Book This Session</span>
                                  </motion.button>
                                )
                              }

                              // If I haven't paid yet
                              if (isMySession && !session.is_paid) {
                                return (
                                  <button
                                    onClick={() => {
                                      if (session.mentor_data) {
                                        setBookingMentor(session.mentor_data)
                                        setIsBookingModalOpen(true)
                                      }
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                                  >
                                    <DollarSign className="w-4 h-4" />
                                    Pay & Join Meeting
                                  </button>
                                )
                              }

                              return null
                            })()}

                            {session.meeting_link && session.is_paid && session.learner_email === userData?.email && (() => {
                              const sessionDateTime = new Date(`${session.date}T${session.time}`)
                              const meetingEndTime = new Date(sessionDateTime.getTime() + (session.duration * 60000))
                              const isMeetingActive = new Date() >= sessionDateTime && new Date() <= meetingEndTime
                              
                              if (isMeetingActive) {
                                return (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(session.meeting_link || '')
                                  // You could add a toast notification here
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                Copy meeting link
                              </button>
                                )
                              }
                              return null
                            })()}

                            <div className="text-xs text-gray-500 mt-2">
                              Meeting Type: <span className="font-medium capitalize">{session.meeting_type.replace('-', ' ')}</span>
                            </div>
                            {session.learner_email === userData?.email && !session.is_paid && (
                              <div className="text-xs text-orange-600 font-medium">
                                Payment Required
                              </div>
                            )}
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
          imageUrl={profilePictureMentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profilePictureMentor.name)}&background=3B82F6&color=fff&size=128`}
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
