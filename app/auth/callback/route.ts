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
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin))
    }

    if (data.user && data.session) {
      // Create a new client with the session for authenticated requests
      const supabaseWithSession = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`
          }
        }
      })
      
      // Use the authenticated client for database operations
      const authenticatedSupabase = supabaseWithSession
      // Determine which table to use based on user type
      // Check URL param first, then user metadata, then default to student
      const userTypeToUse = userType || data.user.user_metadata?.user_type || 'student'
      // Mentor, Tutor, or Other (user) should go to mentors table
      const isMentor = userTypeToUse === 'mentor' || userTypeToUse === 'tutor' || userTypeToUse === 'user'

      // First check if user is already a mentor - use user_id column
      const { data: existingMentor } = await authenticatedSupabase
        .from('mentors')
        .select('id, email, user_id')
        .eq('user_id', data.user.id)
        .maybeSingle()

      // If user is a mentor, redirect to company dashboard (don't create student record)
      if (existingMentor) {
        console.log('Mentor record already exists, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
      }

      // If user type is mentor/tutor but no mentor record exists, create one
      if (isMentor) {
        const nameToUse = fullName || data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
        
        // Check if mentor record already exists (double check) - use user_id column
        const { data: existingMentorCheck } = await authenticatedSupabase
          .from('mentors')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle()

        if (!existingMentorCheck) {
          console.log('Creating mentor record in callback route for user:', data.user.id, 'Type:', userTypeToUse)
          // Create mentor record - use user_id to link to Supabase Auth
          const { data: newMentor, error: mentorError } = await authenticatedSupabase
            .from('mentors')
            .insert({
              user_id: data.user.id,
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
            .select()
            .single()

          if (mentorError) {
            console.error('Error creating mentor record in callback:', mentorError)
            console.error('Error details:', JSON.stringify(mentorError, null, 2))
          } else {
            console.log('Mentor record created successfully in callback:', newMentor)
          }
          
          // Redirect to company dashboard after creating mentor record
          return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
        } else {
          console.log('Mentor record already exists, redirecting to company dashboard')
          return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
        }
      }

      // Only create student record if user is NOT a mentor/tutor
      if (!isMentor) {
        // Check if user already exists in students table
        const { data: existingStudent } = await authenticatedSupabase
          .from('students')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        if (!existingStudent) {
          const nameToUse = fullName || data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
          
          console.log('Creating student record in callback route for user:', data.user.id)
          // Create student record
          const { error: studentError } = await authenticatedSupabase
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
      if (userTypeForRedirect === 'mentor' || userTypeForRedirect === 'tutor' || userTypeForRedirect === 'user') {
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
      } else {
        return NextResponse.redirect(new URL('/dashboard/learner', requestUrl.origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}

