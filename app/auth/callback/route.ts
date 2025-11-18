import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userType = requestUrl.searchParams.get('user_type')
  const fullName = requestUrl.searchParams.get('full_name')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
      // Check if user already exists in users_account
      const { data: existingUser } = await supabase
        .from('users_account')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!existingUser) {
        // Create user profile in users_account
        const userTypeToUse = userType || 'student'
        const nameToUse = fullName || data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'

        const { error: profileError } = await supabase
          .from('users_account')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: nameToUse,
            user_type: userTypeToUse,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            verified: data.user.email_confirmed_at ? true : false,
            bio: null,
            website: null,
            social_links: {},
            settings: {}
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }

        // If user is mentor or tutor, create mentor record
        if (userTypeToUse === 'mentor' || userTypeToUse === 'tutor') {
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
        }
      }

      // Get user type for redirect
      const { data: userData } = await supabase
        .from('users_account')
        .select('user_type')
        .eq('id', data.user.id)
        .single()

      const userTypeForRedirect = userData?.user_type || userType || 'student'

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

