"use client"

import * as React from "react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { 
  LayoutDashboard, 
  MonitorPlay, 
  MessageSquare, 
  Bell, 
  BarChart2, 
  DollarSign,
  PlusCircle,
  Settings,
  HelpCircle,
  Menu,
  X
} from "lucide-react"

const menuItems = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/dashboard/company',
    color: '#F9CA56' // Yellow
  },
  { 
    name: 'Ad Spaces', 
    icon: MonitorPlay, 
    href: '/dashboard/company/ad-spaces',
    color: '#53E2D2' // Teal
  },
  { 
    name: 'Requests', 
    icon: Bell, 
    href: '/dashboard/company/requests',
    color: '#6B54FA' // Purple
  },
  { 
    name: 'Messages', 
    icon: MessageSquare, 
    href: '/dashboard/company/messages',
    color: '#F9CA56' // Yellow
  },
  { 
    name: 'Analytics', 
    icon: BarChart2, 
    href: '/dashboard/company/analytics',
    color: '#53E2D2' // Teal
  },
  { 
    name: 'Earnings', 
    icon: DollarSign, 
    href: '/dashboard/company/earnings',
    color: '#6B54FA' // Purple
  }
]

const bottomMenuItems = [
  { 
    name: 'Add New Ad Space', 
    icon: PlusCircle, 
    href: '/dashboard/company/new-ad-space',
    color: '#F9CA56' // Yellow
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    href: '/dashboard/company/settings',
    color: '#53E2D2' // Teal
  },
  { 
    name: 'Help & Support', 
    icon: HelpCircle, 
    href: '/dashboard/company/support',
    color: '#6B54FA' // Purple
  }
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <>
      {/* Toggle Button for Mobile/Tablet */}
      <motion.button
        className={`fixed top-4 ${isCollapsed ? 'left-20' : 'left-64'} z-50 bg-[#1a1e32] p-2 rounded-full border border-[#2a2e45] hover:bg-[#2a2e45] transition-all duration-300`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? (
          <Menu className="h-5 w-5 text-[#53E2D2]" />
        ) : (
          <X className="h-5 w-5 text-[#53E2D2]" />
        )}
      </motion.button>

      <motion.div 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#0f1424] border-r border-[#1a1e32] h-screen fixed left-0 top-0 transition-all duration-300 py-6`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div 
          className={`px-6 mb-10 ${isCollapsed ? 'text-center' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isCollapsed ? (
            <span className="text-2xl font-bold text-white">C</span>
          ) : (
            <h1 className="text-2xl font-bold text-white">CyberX</h1>
          )}
        </motion.div>

        {/* Main Menu */}
        <motion.div 
          className="space-y-2 px-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {menuItems.map((menuItem, index) => (
            <motion.div 
              key={menuItem.name}
              variants={item}
              whileHover={{ x: 5 }}
              className="relative"
            >
              <Link 
                href={menuItem.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 p-3 rounded-lg relative group overflow-hidden`}
              >
                <menuItem.icon 
                  className="h-5 w-5 transition-colors duration-300"
                  style={{ color: menuItem.color }}
                />
                {!isCollapsed && (
                  <span 
                    className="text-gray-400 group-hover:text-white transition-colors duration-300"
                    style={{ textShadow: `0 0 10px ${menuItem.color}40` }}
                  >
                    {menuItem.name}
                  </span>
                )}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-lg"
                  style={{ 
                    background: `radial-gradient(circle at ${isCollapsed ? 'center' : 'left'}, ${menuItem.color} 0%, transparent 70%)`
                  }}
                />
                {isCollapsed && (
                  <div 
                    className="absolute left-0 w-1 h-full bg-transparent group-hover:bg-[#53E2D2] transition-all duration-300"
                    style={{
                      boxShadow: `0 0 10px ${menuItem.color}`
                    }}
                  />
                )}
              </Link>
              {isCollapsed && (
                <div
                  className="absolute left-16 top-0 px-2 py-1 bg-[#1a1e32] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                  style={{
                    color: menuItem.color,
                    boxShadow: `0 0 10px ${menuItem.color}40`
                  }}
                >
                  {menuItem.name}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Menu */}
        <motion.div 
          className={`absolute bottom-6 ${isCollapsed ? 'px-3' : 'left-6 right-6'} space-y-2`}
          variants={container}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
        >
          {bottomMenuItems.map((menuItem, index) => (
            <motion.div 
              key={menuItem.name}
              variants={item}
              whileHover={{ x: 5 }}
              className="relative"
            >
              <Link 
                href={menuItem.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 p-3 rounded-lg relative group overflow-hidden`}
              >
                <menuItem.icon 
                  className="h-5 w-5 transition-colors duration-300"
                  style={{ color: menuItem.color }}
                />
                {!isCollapsed && (
                  <span 
                    className="text-gray-400 group-hover:text-white transition-colors duration-300"
                    style={{ textShadow: `0 0 10px ${menuItem.color}40` }}
                  >
                    {menuItem.name}
                  </span>
                )}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-lg"
                  style={{ 
                    background: `radial-gradient(circle at ${isCollapsed ? 'center' : 'left'}, ${menuItem.color} 0%, transparent 70%)`
                  }}
                />
                {isCollapsed && (
                  <div 
                    className="absolute left-0 w-1 h-full bg-transparent group-hover:bg-[#53E2D2] transition-all duration-300"
                    style={{
                      boxShadow: `0 0 10px ${menuItem.color}`
                    }}
                  />
                )}
              </Link>
              {isCollapsed && (
                <div
                  className="absolute left-16 top-0 px-2 py-1 bg-[#1a1e32] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                  style={{
                    color: menuItem.color,
                    boxShadow: `0 0 10px ${menuItem.color}40`
                  }}
                >
                  {menuItem.name}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  )
} 