"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { supabase } from '@/lib/supabase'
import { motion } from "framer-motion"
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Video,
  User,
  Mail,
  ArrowRight,
  Copy,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TutorSessionsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          router.push('/')
          return
        }

        // Fetch mentor data
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (mentorError || !mentor) {
          console.error('Error fetching mentor data:', mentorError)
          setLoading(false)
          return
        }

        setMentorData(mentor)
        setUserData({
          id: user.id,
          email: user.email,
          full_name: mentor.name || user.email?.split('@')[0] || 'User',
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

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

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true
    const sessionDate = new Date(`${session.date}T${session.time}`)
    const isPast = sessionDate < new Date()
    
    if (filter === 'scheduled') {
      return session.status === 'scheduled' && !isPast
    }
    if (filter === 'completed') {
      return session.status === 'completed' || (isPast && session.status !== 'cancelled')
    }
    if (filter === 'cancelled') {
      return session.status === 'cancelled'
    }
    return true
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading your sessions...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="mentor">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-lg text-gray-600">View and manage your scheduled sessions</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="rounded-lg"
          >
            All Sessions ({sessions.length})
          </Button>
          <Button
            variant={filter === 'scheduled' ? 'default' : 'outline'}
            onClick={() => setFilter('scheduled')}
            className="rounded-lg"
          >
            Scheduled ({sessions.filter(s => {
              const sessionDate = new Date(`${s.date}T${s.time}`)
              return s.status === 'scheduled' && sessionDate >= new Date()
            }).length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className="rounded-lg"
          >
            Completed ({sessions.filter(s => {
              const sessionDate = new Date(`${s.date}T${s.time}`)
              return s.status === 'completed' || (sessionDate < new Date() && s.status !== 'cancelled')
            }).length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setFilter('cancelled')}
            className="rounded-lg"
          >
            Cancelled ({sessions.filter(s => s.status === 'cancelled').length})
          </Button>
        </div>

        {/* Sessions List */}
        {sessionsLoading ? (
          <Card className="bg-white border rounded-xl shadow-sm">
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  <p className="mt-4 text-gray-600">Loading sessions...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : filteredSessions.length === 0 ? (
          <Card className="bg-white border rounded-xl shadow-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  {filter === 'all' 
                    ? 'No sessions scheduled yet' 
                    : `No ${filter} sessions found`}
                </p>
                <p className="text-gray-500 text-sm">
                  {filter === 'all' 
                    ? 'Your scheduled sessions will appear here' 
                    : 'Try selecting a different filter'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => {
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
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Section */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {session.learner_name && session.learner_name !== 'TBD' 
                          ? session.learner_name.charAt(0).toUpperCase() 
                          : userData?.full_name?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{session.topic}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${statusColor} border`}>
                              {session.status || (isPast ? 'completed' : 'scheduled')}
                            </Badge>
                            {session.is_paid && (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Paid
                              </Badge>
                            )}
                            {!session.is_paid && (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Awaiting Payment
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Student Info */}
                      {session.is_paid && session.learner_name && session.learner_name !== 'TBD' ? (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs font-semibold text-blue-900 mb-2">Student Information</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">{session.learner_name}</span>
                            </div>
                            {session.learner_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-700">{session.learner_email}</span>
                              </div>
                            )}
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
                          <span className="text-sm font-semibold">${parseFloat(session.amount || 0).toFixed(2)}</span>
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

                      {/* Meeting Link - Only show if session is paid AND student is assigned */}
                      {session.meeting_link && 
                       session.is_paid === true && 
                       session.learner_name && 
                       session.learner_name !== 'TBD' && 
                       session.learner_name.trim() !== '' && 
                       session.learner_email && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Meeting Link</p>
                              <p className="text-sm text-gray-600 truncate">{session.meeting_link}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(session.meeting_link)}
                              className="ml-2 flex-shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Join Meeting Button - Only accessible when meeting starts and session is paid AND student is assigned */}
                      {session.meeting_link && 
                       session.is_paid === true && 
                       session.learner_name && 
                       session.learner_name !== 'TBD' && 
                       session.learner_name.trim() !== '' && 
                       session.learner_email && (
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
      </div>
    </DashboardLayout>
  )
}

