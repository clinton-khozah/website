"use client"

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'

export default function TutorDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        // Fetch mentor data
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('id', user.id)
          .single()

        if (mentorError) {
          // If not a mentor, check if they're a student
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', user.id)
            .single()

          if (studentError) throw mentorError
          setUserData(studentData)
        } else {
          setMentorData(mentor)
          // Use mentor data as user data for tutors
          setUserData({ ...mentor, full_name: mentor.name, user_type: 'mentor' })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {userData?.full_name || 'Tutor'}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">My Sessions</h2>
            <p className="text-gray-600">View and manage your scheduled sessions</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile</h2>
            <p className="text-gray-600">
              {mentorData?.is_complete ? 'Complete' : 'Complete your profile to start teaching'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Earnings</h2>
            <p className="text-gray-600">View your earnings and payment history</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


