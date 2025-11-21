"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Eye,
  Globe,
  LineChart,
  MessageSquare,
  TrendingUp,
  Users,
  Mail,
  ChevronDown,
  Megaphone,
  Activity,
  Clock,
  Calendar as CalendarIcon,
  Video,
  User,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { AnimatedBorderCard } from "@/components/ui/animated-border-card"
import { motion } from "framer-motion"
import { DisplayCards } from "@/components/ui/display-cards"
import { useState, useEffect } from "react"
import { Meteors } from "@/components/ui/meteors"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedEmail } from "@/components/ui/animated-email"
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MentorProfileCompletionForm } from '@/components/dashboard/mentor-profile-completion-form'
import { DashboardLayout } from '@/components/dashboard/layout'
import { ProfileCompletionSuccessModal } from '@/components/dashboard/profile-completion-success-modal'
import { TutorApplicationModal } from '@/components/dashboard/tutor-application-modal'

const cardVariants = {
  hidden: {
    x: 0,
    y: 0,
    scale: 0.8,
    opacity: 0,
  },
  visible: (custom: number) => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      delay: custom * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

const topPerformingAdSpaces = [
  {
    icon: <Globe className="size-4 text-green-400" />,
    title: "Tech Blog Premium Banner",
    description: "$4,200 revenue",
    date: "This month",
    iconClassName: "text-green-400",
    titleClassName: "text-green-400",
    className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Users className="size-4 text-orange-400" />,
    title: "Newsletter Sponsorship",
    description: "$3,150 revenue",
    date: "This month",
    iconClassName: "text-orange-400",
    titleClassName: "text-orange-400",
    className: "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <MessageSquare className="size-4 text-blue-300" />,
    title: "Podcast Ad Spot",
    description: "$2,800 revenue",
    date: "This month",
    iconClassName: "text-blue-300",
    titleClassName: "text-blue-300",
    className: "[grid-area:stack] translate-x-24 translate-y-16 hover:translate-y-8 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
];

const revenueData = [
  { month: "Jan", revenue: 8500 },
  { month: "Feb", revenue: 9200 },
  { month: "Mar", revenue: 10500 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
];

export default function DashboardPage() {
  const currentMonth = revenueData.find(data => data.month === "Mar") || revenueData[revenueData.length - 1]
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isProfileCompletionOpen, setIsProfileCompletionOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          router.push('/')
          return
        }

        // Fetch mentor data - use user_id column to match Supabase Auth UUID
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (mentorError || !mentor) {
          // Check user metadata to see if they signed up as tutor/mentor/other
          const userType = user.user_metadata?.user_type
          
          if (userType === 'tutor' || userType === 'mentor' || userType === 'user') {
            // User signed up as tutor but mentor record doesn't exist yet
            // Create a basic mentor record - use user_id to link to Supabase Auth
            const { data: newMentor, error: createError } = await supabase
              .from('mentors')
              .insert({
                user_id: user.id,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                title: '',
                description: '',
                specialization: '[]',
                rating: 1.00,
                total_reviews: 0,
                hourly_rate: 0.00,
                avatar: user.user_metadata?.avatar_url || '',
                experience: 0,
                languages: '[]',
                availability: 'Available now',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                phone_number: '',
                gender: '',
                age: null,
                country: '',
                latitude: null,
                longitude: null,
                sessions_conducted: 0,
                qualifications: '',
                id_document: '',
                id_number: '',
                cv_document: '',
                payment_method: '',
                linkedin_profile: '',
                github_profile: '',
                twitter_profile: '',
                facebook_profile: '',
                instagram_profile: '',
                personal_website: '',
                bank_name: '',
                account_holder_name: '',
                account_number: '',
                routing_number: '',
                payment_account_details: '{}',
                payment_period: 'per_session',
                is_complete: false,
                is_verified: false
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating mentor record:', createError)
              setUserData({ 
                id: user.id, 
                email: user.email || '', 
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                user_type: 'mentor'
              })
            } else {
              setMentorData(newMentor)
              setUserData({ ...newMentor, full_name: newMentor.name, user_type: 'mentor' })
              console.log('New mentor created - is_complete:', newMentor.is_complete)
              
              // Direct check - if incomplete, set modal to open after a short delay
              const isIncomplete = newMentor.is_complete === false || 
                                  newMentor.is_complete === 'false' || 
                                  String(newMentor.is_complete).toLowerCase() === 'false' ||
                                  newMentor.is_complete === null || 
                                  newMentor.is_complete === undefined
              
              if (isIncomplete) {
                console.log('New mentor profile is incomplete - will open modal')
                setTimeout(() => {
                  setIsProfileCompletionOpen(true)
                }, 1000)
              }
            }
          } else {
            // User is not a mentor, redirect to learner dashboard
            setLoading(false)
            router.push('/dashboard/learner')
            return
          }
        } else {
          setMentorData(mentor)
          setUserData({ ...mentor, full_name: mentor.name, user_type: 'mentor' })
          console.log('Mentor found - is_complete:', mentor.is_complete, 'type:', typeof mentor.is_complete)
          
          // Direct check - if incomplete, set modal to open after a short delay
          const isIncomplete = mentor.is_complete === false || 
                              mentor.is_complete === 'false' || 
                              String(mentor.is_complete).toLowerCase() === 'false' ||
                              mentor.is_complete === null || 
                              mentor.is_complete === undefined
          
          if (isIncomplete) {
            console.log('Mentor profile is incomplete - will open modal')
            setTimeout(() => {
              setIsProfileCompletionOpen(true)
            }, 1000)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        try {
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
        } catch (authError) {
          console.error('Error getting user:', authError)
          router.push('/')
        }
      } finally {
        // Ensure loading is always set to false
        setLoading(false)
      }
    }

    fetchUserData()
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Loading timeout - setting loading to false')
      setLoading(false)
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check profile completion after component mounts - exactly like student dashboard
  useEffect(() => {
    if (!loading && mentorData && userData && userData.id) {
      console.log('=== PROFILE COMPLETION CHECK ===')
      console.log('Loading:', loading)
      console.log('MentorData:', mentorData)
      console.log('UserData:', userData)
      console.log('is_complete value:', mentorData.is_complete)
      console.log('is_complete type:', typeof mentorData.is_complete)
      
      // Check if profile is incomplete - handle boolean false, string "false", null, undefined
      const isIncomplete = mentorData.is_complete === false || 
                          mentorData.is_complete === 'false' || 
                          String(mentorData.is_complete).toLowerCase() === 'false' ||
                          mentorData.is_complete === null || 
                          mentorData.is_complete === undefined
      
      console.log('Is incomplete?', isIncomplete)
      console.log('Current modal state:', isProfileCompletionOpen)
      
      if (isIncomplete) {
        console.log('✅ Profile is incomplete - Opening modal in 500ms')
        // Small delay to ensure component is fully rendered
        const timer = setTimeout(() => {
          console.log('🚀 Setting modal to open NOW')
          setIsProfileCompletionOpen(true)
        }, 500)
        return () => clearTimeout(timer)
      } else {
        console.log('❌ Profile is complete, not opening modal')
      }
    } else {
      console.log('⚠️ Conditions not met for profile check:', { 
        loading, 
        hasMentorData: !!mentorData, 
        hasUserData: !!userData, 
        userId: userData?.id 
      })
    }
  }, [loading, mentorData, userData])

  // Fetch sessions for the mentor
  useEffect(() => {
    const fetchSessions = async () => {
      if (!mentorData?.id || !userData?.id) return

      try {
        setSessionsLoading(true)
        // Fetch sessions where this mentor is the mentor, including payment status
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            *,
            payments (
              id,
              status,
              payment_intent_id,
              paid_at
            )
          `)
          .eq('mentor_id', mentorData.id)
          .order('date', { ascending: false })
          .order('time', { ascending: false })

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError)
          setSessions([])
          return
        }

        // Transform sessions to include payment status
        const transformedSessions = (sessionsData || []).map((session: any) => {
          const payment = Array.isArray(session.payments) ? session.payments[0] : session.payments
          const isPaid = payment && (payment.status === 'succeeded' || payment.status === 'completed')
          
          return {
            ...session,
            is_paid: isPaid,
            payment_status: payment?.status || 'pending'
          }
        })
        
        setSessions(transformedSessions)
      } catch (error) {
        console.error('Error fetching sessions:', error)
        setSessions([])
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchSessions()
  }, [mentorData?.id, userData?.id])

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,543",
      change: "+18% from last month",
      icon: DollarSign
    },
    {
      title: "Active Ad Spaces",
      value: "8",
      change: "+2 new this month",
      icon: Globe
    },
    {
      title: "Pending Requests",
      value: "5",
      change: "3 new since yesterday",
      icon: MessageSquare
    },
    {
      title: "Total Impressions",
      value: "1.2M",
      change: "+12% from last month",
      icon: Eye
    }
  ]

  const getGrowthPercentage = (currentMonth: typeof revenueData[0]) => {
    const currentIndex = revenueData.findIndex(data => data.month === currentMonth.month)
    if (currentIndex <= 0) return 0
    return Math.round(
      (currentMonth.revenue - revenueData[currentIndex - 1].revenue) / 
      revenueData[currentIndex - 1].revenue * 100
    )
  }

  const getTotalRevenue = () => revenueData.reduce((acc, curr) => acc + curr.revenue, 0)

  if (loading) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="mentor">
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your advertising spaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">$45,231.89</div>
              <p className="text-xs text-gray-600">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-gray-600">+2 new this month</p>
            </CardContent>
          </Card>
          <Card className="bg-white border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Influencers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">48</div>
              <p className="text-xs text-gray-600">+5 new this month</p>
            </CardContent>
          </Card>
          <Card className="bg-white border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4.2%</div>
              <p className="text-xs text-gray-600">+0.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border-2 border-blue-500/50 bg-transparent h-9 w-[400px] grid grid-cols-3 rounded-none p-1 shadow-[inset_0_0_35px_rgba(59,130,246,0.3)]">
          <TabsTrigger 
            value="overview" 
            className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-orange-500 data-[state=active]:rounded-none data-[state=active]:shadow-[inset_0_0_30px_rgba(34,197,94,0.5)] data-[state=active]:text-white data-[state=active]:bg-transparent hover:bg-transparent px-2 py-[2px] text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-orange-500 data-[state=active]:rounded-none data-[state=active]:shadow-[inset_0_0_30px_rgba(34,197,94,0.5)] data-[state=active]:text-white data-[state=active]:bg-transparent hover:bg-transparent px-2 py-[2px] text-sm"
          >
            My Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-orange-500 data-[state=active]:rounded-none data-[state=active]:shadow-[inset_0_0_30px_rgba(34,197,94,0.5)] data-[state=active]:text-white data-[state=active]:bg-transparent hover:bg-transparent px-2 py-[2px] text-sm"
          >
            Reports
          </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-white border rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Revenue Overview</CardTitle>
                <CardDescription className="text-gray-600">Click on a month to view details</CardDescription>
                </CardHeader>
              <CardContent className="flex gap-6">
                        <div className="space-y-2 w-1/3 border-r border-gray-200 pr-4">
                  {revenueData.map((data, index) => {
                    const isFutureMonth = data.revenue === 0;
                    const isPastMonth = !isFutureMonth && data.month !== selectedMonth.month;
                    return (
                      <div key={data.month} className="relative group">
                        {isFutureMonth && (
                          <div className="absolute -right-2 translate-x-full top-1/2 -translate-y-1/2 bg-white text-gray-700 text-xs rounded-lg px-3 py-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-gray-200 shadow-lg">
                            We're currently in March. This is a future month.
                          </div>
                        )}
                        {isPastMonth && (
                          <div className="absolute -right-2 translate-x-full top-1/2 -translate-y-1/2 bg-white text-gray-700 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-gray-200 shadow-lg">
                            <div className="space-y-1">
                              <p className="font-medium">Revenue: ${data.revenue.toLocaleString()}</p>
                              <p className="text-gray-600">
                                {Math.round((data.revenue / getTotalRevenue()) * 100)}% of total revenue
                              </p>
                              {index < revenueData.length - 1 && (
                                <p className="text-green-600">
                                  {Math.round(
                                    ((revenueData[index + 1].revenue - data.revenue) / 
                                    data.revenue) * 100
                                  )}% growth next month
                                </p>
                              )}
                  </div>
                        </div>
                        )}
                        <button
                          onClick={() => !isFutureMonth && setSelectedMonth(data)}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors
                            ${selectedMonth.month === data.month 
                              ? 'bg-blue-50 text-blue-600' 
                              : isFutureMonth
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-50 text-gray-600 hover:text-blue-600'}`}
                          disabled={isFutureMonth}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isFutureMonth 
                              ? 'bg-gray-100' 
                              : selectedMonth.month === data.month
                                ? 'bg-blue-100'
                                : 'bg-gray-100'
                          }`}>
                            <span className={`text-sm font-medium ${
                              isFutureMonth ? 'text-gray-400' : 
                              selectedMonth.month === data.month ? 'text-blue-600' : 'text-gray-600'
                            }`}>{data.month}</span>
                        </div>
                          <span className={`text-sm font-medium ${
                            selectedMonth.month === data.month ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {selectedMonth.month === data.month ? `$${data.revenue.toLocaleString()}` : ''}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-blue-200 bg-blue-50"
                      style={{ animation: 'rotateCircle 10s linear infinite' }}
                    >
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_45px_rgba(59,130,246,0.1)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="space-y-6 text-center p-8">
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-4xl font-bold text-gray-900 mt-2">
                            ${selectedMonth.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-base text-green-600">
                                {getGrowthPercentage(selectedMonth)}%
                              </span>
                        </div>
                            <p className="text-sm text-gray-600 mt-1">vs prev month</p>
                      </div>
                          <div>
                            <p className="text-base font-medium text-gray-900">
                              {Math.round((selectedMonth.revenue / getTotalRevenue()) * 100)}%
                            </p>
                            <p className="text-sm text-gray-600">of total revenue</p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 bg-white border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Top Performing Ad Spaces</CardTitle>
                <CardDescription className="text-gray-600">Based on revenue this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[300px] w-full items-center justify-center">
                  <DisplayCards cards={topPerformingAdSpaces} />
                  </div>
                </CardContent>
                <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/analytics" className="flex items-center justify-center">
                      View detailed analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white border rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Requests</CardTitle>
                  <CardDescription className="text-gray-600">You have 5 pending requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">TechGadgets Inc.</p>
                          <p className="text-xs text-muted-foreground">Tech Blog Banner • 2 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">SaaS Platform Pro</p>
                          <p className="text-xs text-muted-foreground">Newsletter • 5 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">CloudCompute Ltd</p>
                          <p className="text-xs text-muted-foreground">Podcast Ad • 1 day ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/requests" className="flex items-center justify-center">
                      View all requests
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            <Card className="bg-white border rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Messages</CardTitle>
                  <CardDescription className="text-gray-600">You have 3 unread messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Sarah Johnson</p>
                          <p className="text-xs text-muted-foreground">Question about banner specs • 1 hour ago</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Michael Chen</p>
                          <p className="text-xs text-muted-foreground">Campaign renewal • 3 hours ago</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Jessica Williams</p>
                          <p className="text-xs text-muted-foreground">Payment confirmation • 5 hours ago</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/messages" className="flex items-center justify-center">
                      View all messages
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            <Card className="bg-white border rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600">Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/ad-spaces/new">
                        <Globe className="mr-2 h-4 w-4" />
                        Add New Ad Space
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/earnings/withdraw">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Withdraw Earnings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/analytics/export">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Export Analytics
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/settings">
                        <Users className="mr-2 h-4 w-4" />
                        Update Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-white border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">My Sessions</CardTitle>
                <CardDescription className="text-gray-600">View and manage your scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading sessions...</p>
                    </div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sessions scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => {
                      const sessionDate = new Date(`${session.date}T${session.time}`)
                      const isPast = sessionDate < new Date()
                      const statusColor = session.status === 'completed' 
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : session.status === 'cancelled'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : session.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : isPast
                        ? 'bg-gray-100 text-gray-700 border-gray-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'

                      const canJoinMeeting = session.meeting_link && sessionDate <= new Date() && !isPast && session.status !== 'completed' && session.status !== 'cancelled'
                      const meetingStartTime = new Date(sessionDate.getTime() + (session.duration * 60000))
                      const isMeetingActive = new Date() >= sessionDate && new Date() <= meetingStartTime

                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                        >
                          <div className="flex items-start gap-4">
                            {/* Profile Section */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                {userData?.full_name?.charAt(0)?.toUpperCase() || 'M'}
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">{session.topic}</h3>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
                                      {session.status || (isPast ? 'completed' : 'scheduled')}
                                    </span>
                                    {session.is_paid && (
                                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                        Paid
                                      </span>
                                    )}
                                    {!session.is_paid && (
                                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                        Awaiting Payment
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Student Info */}
                              {session.is_paid && session.learner_name && session.learner_name !== 'TBD' ? (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                  <p className="text-xs font-semibold text-blue-900 mb-2">Student Information</p>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm font-medium text-gray-900">{session.learner_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm text-gray-700">{session.learner_email}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-xs font-semibold text-gray-600 mb-1">No student assigned yet</p>
                                  <p className="text-xs text-gray-500">Waiting for a student to book this session</p>
                                </div>
                              )}

                              {/* Session Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium">
                                    {new Date(session.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium">
                                    {new Date(`2000-01-01T${session.time}`).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    })} • {session.duration} min
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <DollarSign className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-semibold">R {parseFloat(session.amount || 0).toFixed(2)}</span>
                                </div>
                                {session.meeting_type && (
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Video className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm capitalize">{session.meeting_type.replace('-', ' ')}</span>
                                  </div>
                                )}
                              </div>

                              {/* Notes */}
                              {session.notes && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-xs font-semibold text-gray-700 mb-1">Notes</p>
                                  <p className="text-sm text-gray-600">{session.notes}</p>
                                </div>
                              )}

                              {/* Join Meeting Button - Only accessible when meeting starts */}
                              {session.meeting_link && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  {isMeetingActive ? (
                                    <a
                                      href={session.meeting_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                                    >
                                      <Video className="h-4 w-4" />
                                      Join Meeting Now
                                      <ArrowRight className="h-4 w-4" />
                                    </a>
                                  ) : sessionDate > new Date() ? (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium text-sm">
                                      <Clock className="h-4 w-4" />
                                      Meeting starts {new Date(sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(`2000-01-01T${session.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium text-sm">
                                      <Clock className="h-4 w-4" />
                                      Meeting has ended
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20 flex-1 mr-4">
              <div className="absolute inset-0 h-full w-full">
                <Meteors number={20} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-gray-900">Reports</CardTitle>
                <CardDescription className="text-gray-600">Download and view detailed reports</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Revenue Report</p>
                      <p className="text-sm text-muted-foreground">August 2023</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Ad Performance Summary</p>
                      <p className="text-sm text-muted-foreground">Last 30 days</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Audience Demographics</p>
                      <p className="text-sm text-muted-foreground">Q3 2023</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-[300px] bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <AnimatedEmail />
                  Email Reports
                </CardTitle>
                <CardDescription className="text-gray-600">Receive reports directly in your inbox</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Get <span className="text-green-400">Adsy</span> to send you reports
                    </p>
                    <Switch className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-orange-500/20 data-[state=checked]:hover:bg-orange-500/90 data-[state=unchecked]:hover:bg-orange-500/30 [&>span]:data-[state=checked]:bg-green-500 [&>span]:data-[state=unchecked]:bg-red-500" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        Select Frequency
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px]">
                      <DropdownMenuItem>
                        Per Advertisement
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Every 10 Days
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Monthly
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Quarterly
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Every 6 Months
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
          </TabsContent>
        </Tabs>

      {/* Debug: Test button to manually open modal */}
      {userData && userData.id && mentorData && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              console.log('Manual test: Opening modal')
              console.log('Current state - isProfileCompletionOpen:', isProfileCompletionOpen)
              console.log('Mentor data - is_complete:', mentorData.is_complete)
              setIsProfileCompletionOpen(true)
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Test Modal (Debug)
          </button>
        </div>
      )}

      {/* Mentor Profile Completion Form */}
      {userData && userData.id && (
        <MentorProfileCompletionForm
          isOpen={isProfileCompletionOpen}
          onClose={() => {
            console.log('Closing profile completion modal')
            setIsProfileCompletionOpen(false)
          }}
          userId={userData.id}
          onComplete={() => {
            console.log('Profile completion finished')
            setIsProfileCompletionOpen(false)
            // Show success modal
            setIsSuccessModalOpen(true)
            // Refresh user data
            const fetchUserData = async () => {
              const { data: { user } } = await supabase.auth.getUser()
              if (user) {
                const { data: mentor } = await supabase
                  .from('mentors')
                  .select('*')
                  .eq('user_id', user.id)
                  .single()
                if (mentor) {
                  setMentorData(mentor)
                  setUserData({ ...mentor, full_name: mentor.name, user_type: 'mentor' })
                }
              }
            }
            fetchUserData()
          }}
        />
      )}
      <ProfileCompletionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onContinue={() => {
          setIsSuccessModalOpen(false)
          setIsApplicationModalOpen(true)
        }}
      />
      <TutorApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        userEmail={userData?.email || ''}
        userName={userData?.full_name || userData?.name || ''}
      />
      </div>
    </DashboardLayout>
  )
}

