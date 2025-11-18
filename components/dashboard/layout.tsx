"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  LogOut
} from "lucide-react"
import clsx from "clsx"
import { createClient } from '@supabase/supabase-js'
import { UserProfilePopup } from "./user-profile-popup"

interface SidebarLink {
  icon: any
  label: string
  href: string
}

const mainLinks: SidebarLink[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard/advertiser"
  },
  {
    icon: MonitorPlay,
    label: "Ad Spaces",
    href: "/ad-spaces"
  },
  {
    icon: Bell,
    label: "Requests",
    href: "/dashboard/advertiser/requests"
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/dashboard/advertiser/messages"
  },
  {
    icon: BarChart2,
    label: "Analytics",
    href: "/dashboard/advertiser/analytics"
  }
]

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
  children 
}: { 
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const pathname = usePathname()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('users_account')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="flex h-screen bg-[#140047]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#140047] border-r border-[#2a2e45]/10">
        <div className="flex flex-col h-full px-4 py-6">
          {/* User Profile Section */}
          <div 
            className="flex items-center gap-3 mb-8 px-2 cursor-pointer hover:bg-[#2a2e45] rounded-lg p-2 transition-colors"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="h-10 w-10 rounded-full bg-[#2a2e45] flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {userData?.full_name?.[0] || 'A'}
              </span>
            </div>
            <div>
              <h2 className="text-white font-medium">{userData?.full_name || 'John Doe'}</h2>
              <p className="text-sm text-gray-400">Premium Advertiser</p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
        className={clsx(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "bg-[#9575ff] text-white"
                    : "text-gray-300 hover:bg-[#2a2e45] hover:text-white"
                )}
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Add New Ad Space Button */}
          <div className="px-2 my-4">
            <button className="w-full px-3 py-2 bg-[#2a2e45] text-white rounded-lg flex items-center text-sm font-medium hover:bg-[#353b57] transition-colors">
              <PlusCircle className="h-5 w-5 mr-3" />
              Add New Ad Space
            </button>
          </div>

          {/* Bottom Navigation */}
          <nav className="space-y-1">
            {bottomLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "bg-[#9575ff] text-white"
                    : "text-gray-300 hover:bg-[#2a2e45] hover:text-white"
                )}
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-[#1a1e32] rounded-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* User Profile Popup */}
      <UserProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
      />
    </div>
  )
} 