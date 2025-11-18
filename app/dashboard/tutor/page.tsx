"use client"

import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'

export default function TutorDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data: userAccount, error: userError } = await supabase
          .from('users_account')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userError) throw userError
        setUserData(userAccount)

        // Fetch mentor data if exists
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!mentorError && mentor) {
          setMentorData(mentor)
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


