import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userType = requestUrl.searchParams.get('user_type')
  const fullName = requestUrl.searchParams.get('full_name')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qvyofdffddwgpduljlit.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eW9mZGZmZGR3Z3BkdWxqbGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDE5ODUsImV4cCI6MjA3MjQxNzk4NX0.TEEUTy4cgKsL_g8QGdupjCkvXqueN8qFFrf4JO6QQPs'

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return NextResponse.redirect(new URL('/?error=config_error', requestUrl.origin))
  }

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin))
    }

    if (data.user) {
      // First check if user is a mentor
      const { data: existingMentor } = await supabase
        .from('mentors')
        .select('id, email')
        .eq('id', data.user.id)
        .single()

      // If user is a mentor, redirect to tutor dashboard
      if (existingMentor) {
        return NextResponse.redirect(new URL('/dashboard/tutor', requestUrl.origin))
      }

      // Determine which table to use based on user type
      const userTypeToUse = userType || 'student'
      const isMentor = userTypeToUse === 'mentor' || userTypeToUse === 'tutor'
      const tableName = isMentor ? 'mentors' : 'students'

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!existingUser) {
        const nameToUse = fullName || data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'

        if (isMentor) {
          // Create mentor record
          const { error: mentorError } = await supabase
            .from('mentors')
            .insert({
              id: data.user.id,
              name: nameToUse,
              email: data.user.email || '',
              title: '',
              description: '',
              specialization: '[]',
              rating: 1.00,
              total_reviews: 0,
              hourly_rate: 0.00,
              avatar: data.user.user_metadata?.avatar_url || '',
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

          if (mentorError) {
            console.error('Error creating mentor record:', mentorError)
          }
        } else {
          // Create student record
          const { error: studentError } = await supabase
            .from('students')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              full_name: nameToUse,
              avatar_url: data.user.user_metadata?.avatar_url || null,
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
              verified: data.user.email_confirmed_at ? true : false,
              status: 'active',
              is_complete: false,
              role: 'student',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (studentError) {
            console.error('Error creating student record:', studentError)
          }
        }
      }

      const userTypeForRedirect = userTypeToUse

      // Redirect based on user type
      if (userTypeForRedirect === 'mentor' || userTypeForRedirect === 'tutor') {
        return NextResponse.redirect(new URL('/dashboard/tutor', requestUrl.origin))
      } else {
        return NextResponse.redirect(new URL('/dashboard/learner', requestUrl.origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}

