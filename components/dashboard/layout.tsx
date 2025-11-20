"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  Settings, 
  MessageSquare,
  DollarSign,
  Bell,
  Menu,
  X,
  MonitorPlay,
  PlusCircle,
  HelpCircle,
  LogOut,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  ChevronDown
} from "lucide-react"
import clsx from "clsx"
import { supabase } from "@/lib/supabase"
import { UserProfilePopup } from "./user-profile-popup"
import { LogoutConfirmationModal } from "./logout-confirmation-modal"
import { MessagesModal } from "./messages-modal"

interface SidebarLink {
  icon: any
  label: string
  href: string
}

// Dynamic links based on user type
const getMainLinks = (userType: string): SidebarLink[] => {
  if (userType === 'mentor' || userType === 'tutor') {
    return [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/tutor"
      },
      {
        icon: Users,
        label: "My Sessions",
        href: "/dashboard/tutor/sessions"
      },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/dashboard/tutor/messages"
      },
      {
        icon: BarChart2,
        label: "Earnings",
        href: "/dashboard/tutor/earnings"
      }
    ]
  } else {
    // Student/Learner links
    return [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard/learner"
      },
      {
        icon: Calendar,
        label: "My Bookings",
        href: "/dashboard/learner/bookings"
      },
      {
        icon: Users,
        label: "Find Tutors",
        href: "/dashboard/learner/tutors"
      },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/dashboard/learner/messages"
      },
      {
        icon: BarChart2,
        label: "Progress",
        href: "/dashboard/learner/progress"
      }
    ]
  }
}

const bottomLinks: SidebarLink[] = [
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/advertiser/settings"
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "/dashboard/advertiser/support"
  },
  {
    icon: LogOut,
    label: "Logout",
    href: "/auth/logout"
  }
]

export function DashboardLayout({ 
  children,
  role 
}: { 
  children: React.ReactNode
  role?: string
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Check if user is in mentors or students table
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!mentorError && mentorData) {
          // Convert verified field to boolean if it's a string
          const verified = mentorData.is_verified === true || mentorData.is_verified === 'true' || mentorData.is_verified === 'pending' 
            ? (mentorData.is_verified === 'pending' ? 'pending' : true)
            : false
          
          // Parse JSON fields if they're strings
          let social_links = mentorData.social_links || {}
          if (typeof social_links === 'string') {
            try {
              social_links = JSON.parse(social_links)
            } catch {
              social_links = {}
            }
          }
          
          let settings = mentorData.settings || {}
          if (typeof settings === 'string') {
            try {
              settings = JSON.parse(settings)
            } catch {
              settings = {}
            }
          }
          
          setUserData({ 
            ...mentorData, 
            full_name: mentorData.name, 
            user_type: 'mentor',
            verified,
            social_links,
            settings
          })
        } else {
          // Check students table
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', user.id)
            .single()

          if (studentError) throw studentError
          
          // Convert verified field to boolean if it's a string
          const verified = studentData.verified === true || studentData.verified === 'true' || studentData.verified === 'pending'
            ? (studentData.verified === 'pending' ? 'pending' : true)
            : false
          
          // Parse JSON fields if they're strings
          let social_links = studentData.social_links || {}
          if (typeof social_links === 'string') {
            try {
              social_links = JSON.parse(social_links)
            } catch {
              social_links = {}
            }
          }
          
          let settings = studentData.settings || {}
          if (typeof settings === 'string') {
            try {
              settings = JSON.parse(settings)
            } catch {
              settings = {}
            }
          }
          
          // Parse languages_spoken and interests if they're strings
          let languages_spoken = studentData.languages_spoken
          if (typeof languages_spoken === 'string') {
            try {
              languages_spoken = JSON.parse(languages_spoken)
            } catch {
              // If it's a string like "[]", try to clean it
              languages_spoken = languages_spoken.replace(/[\[\]"]/g, '') || null
            }
          }
          
          let interests = studentData.interests
          if (typeof interests === 'string') {
            try {
              interests = JSON.parse(interests)
            } catch {
              // If it's a string like "[]", try to clean it
              interests = interests.replace(/[\[\]"]/g, '') || null
            }
          }
          
          setUserData({ 
            ...studentData, 
            user_type: 'student',
            verified,
            social_links,
            settings,
            languages_spoken,
            interests
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  // Get the user type from role prop or userData
  const userType = role || userData?.user_type || 'student'
  const mainLinks = getMainLinks(userType)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={clsx(
        "bg-white border-r border-gray-200 transition-all duration-300 relative",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>

        <div className="flex flex-col h-full px-4 py-6">
          {/* Logo Section */}
          <div 
            className={clsx(
              "flex items-center justify-center mb-8 px-2",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <div className="h-20 w-20 flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/logo1.png"
                alt="Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1">
            {mainLinks.map((link) => {
              // Handle Messages button separately to open modal
              if (link.label === "Messages") {
                return (
                  <button
                    key={link.href}
                    onClick={() => setIsMessagesModalOpen(true)}
                    className={clsx(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                      pathname === link.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                      isSidebarCollapsed && "justify-center"
                    )}
                    title={isSidebarCollapsed ? link.label : undefined}
                  >
                    <link.icon className={clsx("h-5 w-5 flex-shrink-0", !isSidebarCollapsed && "mr-3")} />
                    {!isSidebarCollapsed && <span>{link.label}</span>}
                  </button>
                )
              }
              
              // Regular links
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    pathname === link.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    isSidebarCollapsed && "justify-center"
                  )}
                  title={isSidebarCollapsed ? link.label : undefined}
                >
                  <link.icon className={clsx("h-5 w-5 flex-shrink-0", !isSidebarCollapsed && "mr-3")} />
                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Action Button - Different for different user types */}
          {!isSidebarCollapsed && (
            <div className="px-2 my-4">
              {userType === 'mentor' || userType === 'tutor' ? (
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Session
                </button>
              ) : (
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Book a Session
                </button>
              )}
            </div>
          )}

          {/* Collapsed Action Button */}
          {isSidebarCollapsed && (
            <div className="px-2 my-4">
              <button 
                className="w-full p-2 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                title={userType === 'mentor' || userType === 'tutor' ? 'Create Session' : 'Book a Session'}
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Bottom Navigation */}
          <nav className="space-y-1">
            {bottomLinks.map((link) => {
              // Handle logout button separately
              if (link.label === "Logout") {
                return (
                  <button
                    key={link.href}
                    onClick={() => setIsLogoutModalOpen(true)}
                    className={clsx(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                      isSidebarCollapsed && "justify-center"
                    )}
                    title={isSidebarCollapsed ? link.label : undefined}
                  >
                    <link.icon className={clsx("h-5 w-5 flex-shrink-0", !isSidebarCollapsed && "mr-3")} />
                    {!isSidebarCollapsed && <span>{link.label}</span>}
                  </button>
                )
              }
              
              // Regular links
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    isSidebarCollapsed && "justify-center"
                  )}
                  title={isSidebarCollapsed ? link.label : undefined}
                >
                  <link.icon className={clsx("h-5 w-5 flex-shrink-0", !isSidebarCollapsed && "mr-3")} />
                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        {/* Top Header with User Info */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-6 w-6 text-gray-600" />
            ) : (
              <X className="h-6 w-6 text-gray-600" />
            )}
          </button>
          
          <div 
            className="flex items-center gap-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl px-5 py-3 transition-all duration-200 border border-gray-200 hover:border-blue-400 hover:shadow-md group"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="text-right">
              <h2 className="font-semibold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-colors">
                {userData?.full_name || 'User'}
              </h2>
              <p className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">
                {userData?.user_type === 'mentor' || userData?.user_type === 'tutor' 
                  ? 'Tutor/Mentor' 
                  : 'Student'}
              </p>
            </div>
            <div className="relative flex items-center gap-2">
              {userData?.avatar_url ? (
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm group-hover:border-blue-400 transition-colors">
                  <img
                    src={userData.avatar_url}
                    alt={userData.full_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-blue-200 shadow-sm group-hover:border-blue-400 transition-colors">
                  <UserCircle className="h-8 w-8 text-white" />
                </div>
              )}
              <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {/* User Profile Popup */}
      <UserProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      {/* Messages Modal */}
      {userData && (
        <MessagesModal
          isOpen={isMessagesModalOpen}
          onClose={() => setIsMessagesModalOpen(false)}
          userType={userType}
          userId={userData.id}
          userData={userData}
        />
      )}
    </div>
  )
} 