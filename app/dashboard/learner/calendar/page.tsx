"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { SessionsCalendar } from "@/components/dashboard/sessions-calendar"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Session {
  id: string
  date: string
  time: string
  topic: string
  mentor_name?: string
  mentor_avatar?: string
  mentor_title?: string
  status: string
  duration: number
  notes?: string
  meeting_type?: string
  meeting_link?: string
  amount?: number
  learner_name?: string
  learner_email?: string
  is_paid?: boolean
}

export default function LearnerCalendarPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        setUserData(user)

        // Fetch all sessions - both booked by the learner and all available sessions
        const { data: bookedSessions, error: bookedError } = await supabase
          .from('sessions')
          .select(`
            *,
            mentors (
              id,
              name,
              avatar,
              title,
              hourly_rate,
              experience,
              specialization,
              languages,
              availability,
              country,
              is_verified
            )
          `)
          .eq('learner_email', user.email)
          .order('date', { ascending: true })
          .order('time', { ascending: true })

        if (bookedError) throw bookedError

        // Fetch all available public sessions (not private)
        const { data: availableSessions, error: availableError } = await supabase
          .from('sessions')
          .select(`
            *,
            mentors (
              id,
              name,
              avatar,
              title,
              hourly_rate,
              experience,
              specialization,
              languages,
              availability,
              country,
              is_verified
            )
          `)
          .eq('private', false)
          .order('date', { ascending: true })
          .order('time', { ascending: true })

        if (availableError) throw availableError

        // Combine and transform sessions
        const allSessions = [...(bookedSessions || []), ...(availableSessions || [])]
        
        // Remove duplicates based on session ID
        const uniqueSessions = Array.from(
          new Map(allSessions.map((s: any) => [s.id, s])).values()
        )

        const transformedSessions: Session[] = uniqueSessions.map((session: any) => ({
          id: session.id,
          date: session.date,
          time: session.time,
          topic: session.topic || 'Untitled Session',
          mentor_name: session.mentors?.name,
          mentor_avatar: session.mentors?.avatar,
          mentor_title: session.mentors?.title,
          status: session.status || 'scheduled',
          duration: session.duration || 60,
          notes: session.notes,
          meeting_type: session.meeting_type || 'google meet',
          meeting_link: session.meeting_link,
          amount: session.amount,
          learner_name: session.learner_name,
          learner_email: session.learner_email,
          is_paid: session.is_paid
        }))

        setSessions(transformedSessions)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Calendar</CardTitle>
            <CardDescription>
              View all available sessions and your bookings. Click on any day to see sessions and check mentor availability.
            </CardDescription>
          </CardHeader>
        </Card>

        <SessionsCalendar sessions={sessions} />
      </div>
    </DashboardLayout>
  )
}

