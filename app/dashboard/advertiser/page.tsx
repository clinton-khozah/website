"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BarChart2, 
  Users, 
  DollarSign, 
  TrendingUp,
  MessageSquare,
  Bell,
  ChevronRight,
  Search
} from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
    color: "#F9CA56" // Yellow from logo
  },
  {
    name: "Active Campaigns",
    value: "12",
    change: "+2 new this month",
    icon: BarChart2,
    color: "#6B54FA" // Purple from logo
  },
  {
    name: "Total Influencers",
    value: "48",
    change: "+5 new this month",
    icon: Users,
    color: "#53E2D2" // Teal from logo
  },
  {
    name: "Engagement Rate",
    value: "4.2%",
    change: "+0.3% from last month",
    icon: TrendingUp,
    color: "#F9CA56" // Yellow from logo
  }
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const revenueData = {
  Mar: "$10,500",
  current: {
    amount: "$10,500",
    percentage: "14%",
    vsLastMonth: "vs prev month",
    ofTotal: "37% of total revenue"
  }
}

const topAdSpaces = [
  {
    name: "Tech Blog Premium Banner",
    revenue: "$4,200",
    period: "This month",
    color: "#F9CA56" // Yellow
  },
  {
    name: "Newsletter Sponsorship",
    revenue: "$3,150",
    period: "This month",
    color: "#6B54FA" // Purple
  },
  {
    name: "Podcast Ad Spot",
    revenue: "$2,800",
    period: "This month",
    color: "#53E2D2" // Teal
  }
]

const recentRequests = [
  {
    company: "TechGadgets Inc.",
    type: "Tech Blog Banner",
    time: "2 hours ago"
  },
  {
    company: "SaaS Platform Pro",
    type: "Newsletter",
    time: "5 hours ago"
  },
  {
    company: "CloudCompute Ltd",
    type: "Podcast Ad",
    time: "1 day ago"
  }
]

const recentMessages = [
  {
    name: "Sarah Johnson",
    message: "Question about banner specs",
    time: "1 hour ago"
  },
  {
    name: "Michael Chen",
    message: "Campaign renewal",
    time: "3 hours ago"
  },
  {
    name: "Jessica Williams",
    message: "Payment confirmation",
    time: "5 hours ago"
  }
]

export default function AdvertiserDashboard() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'analytics' | 'reports' | 'earnings'>('overview')
  const [userData, setUserData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data, error } = await supabase
          .from('users_account')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Logo colors for the circle background
  const circleColors = {
    overview: "rgba(249, 202, 86, 0.05)", // Yellow transparent
    analytics: "rgba(107, 84, 250, 0.05)", // Purple transparent
    reports: "rgba(83, 226, 210, 0.05)", // Teal transparent
    earnings: "rgba(249, 202, 86, 0.05)" // Yellow transparent
  }

  // Border colors for the circle with glow
  const circleBorderColors = {
    overview: "#F9CA56", // Yellow
    analytics: "#6B54FA", // Purple
    reports: "#53E2D2", // Teal
    earnings: "#F9CA56" // Yellow
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return {
          title: "Analytics Overview",
          description: "Detailed performance metrics and trends",
          amount: "$12,750",
          percentage: "18%",
          comparison: "vs last period",
          share: "42% of total analytics"
        }
      case 'reports':
        return {
          title: "Reports Overview",
          description: "Generated reports and summaries",
          amount: "$8,920",
          percentage: "11%",
          comparison: "vs previous reports",
          share: "31% of total reports"
        }
      case 'earnings':
        return {
          title: "Earnings Overview",
          description: "Your revenue and payment history",
          amount: "$15,230",
          percentage: "22%",
          comparison: "vs last month",
          share: "45% of total earnings"
        }
      default:
        return {
          title: "Revenue Overview",
          description: "Click on a month to view details",
          amount: revenueData.current.amount,
          percentage: revenueData.current.percentage,
          comparison: revenueData.current.vsLastMonth,
          share: revenueData.current.ofTotal
        }
    }
  }

  const content = getTabContent()

  return (
    <DashboardLayout role="advertiser">
      <div className="space-y-6 p-6">
        {/* User Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {userData?.full_name || 'Advertiser'}!
            </h1>
            <p className="text-gray-400 mt-1">
              Here's an overview of your advertising campaigns.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Account Type</p>
              <p className="text-white font-medium capitalize">{userData?.user_type || 'Advertiser'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#2a2e45] flex items-center justify-center">
              <span className="text-white font-medium">
                {(userData?.full_name || 'A')[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Lines */}
        <div className="flex flex-col gap-2 mb-8">
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-[#F9CA56] to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-[#6B54FA] to-transparent w-3/4"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-[#53E2D2] to-transparent w-1/2"
            initial={{ width: 0 }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-[#F9CA56] to-transparent w-1/4"
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0f1424] border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              style={{
                borderColor: stat.color,
                boxShadow: `0 0 20px ${stat.color}25`,
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    {stat.name}
                  </span>
                  <stat.icon 
                    className="h-4 w-4 transition-colors" 
                    style={{ color: stat.color }}
                  />
                </div>
                <motion.div 
                  className="text-3xl font-bold mb-2 transition-all duration-300"
                  style={{ 
                    color: 'white',
                    textShadow: `0 0 10px ${stat.color}50`
                  }}
                >
                  {stat.value}
                </motion.div>
                <div 
                  className="text-sm transition-colors"
                  style={{ color: stat.color }}
                >
                  {stat.change}
                </div>
              </div>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ 
                  background: `radial-gradient(circle at center, ${stat.color} 0%, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1a1e32] mb-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-white border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-[#F9CA56]' : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-white border-b-2 transition-colors ${
              activeTab === 'analytics' ? 'border-[#6B54FA]' : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-white border-b-2 transition-colors ${
              activeTab === 'reports' ? 'border-[#53E2D2]' : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Reports
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 text-white border-b-2 transition-colors ${
              activeTab === 'earnings' ? 'border-[#F9CA56]' : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Earnings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Section */}
          <div className="lg:col-span-2 bg-[#0f1424] border border-[#1a1e32] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{content.title}</h2>
            <p className="text-gray-400 mb-6">{content.description}</p>
            
            <div className="flex gap-8">
              {/* Months List - Always visible */}
              <div className="space-y-4">
                {months.map((month) => (
                  <div 
                    key={month}
                    className={`px-4 py-2 rounded ${
                      month === "Mar" ? "bg-[#1a1e32] text-white" : "text-gray-400"
                    }`}
                  >
                    {month}
                    {month === "Mar" && (
                      <div className="text-blue-400 mt-1">{revenueData[month]}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Circle Display with Glow */}
              <div className="flex-1 flex items-center justify-center">
                <motion.div 
                  className="relative w-64 h-64 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: circleColors[activeTab],
                    border: `4px solid ${circleBorderColors[activeTab]}`,
                    boxShadow: `0 0 20px ${circleBorderColors[activeTab]}`,
                    transition: "all 0.5s ease"
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={activeTab}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{
                        textShadow: `0 0 10px ${circleBorderColors[activeTab]}`
                      }}
                    >
                      {content.amount}
                    </motion.div>
                    <motion.div 
                      className="text-green-400 text-lg mb-1"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ↑ {content.percentage}
                    </motion.div>
                    <motion.div 
                      className="text-gray-400 text-sm"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {content.comparison}
                    </motion.div>
                    <motion.div 
                      className="text-gray-400 text-sm"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {content.share}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Top Performing Ad Spaces */}
          <div className="bg-[#0f1424] border border-[#1a1e32] rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <motion.h2 
                className="text-xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Top Performing Ad Spaces
              </motion.h2>
              <motion.p 
                className="text-gray-400 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Based on revenue this month
              </motion.p>
              
              <div className="space-y-4">
                {topAdSpaces.map((ad, index) => (
                  <motion.div 
                    key={ad.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="relative bg-[#1a1e32] rounded-lg p-4 group hover:-translate-y-1 transition-all duration-300"
                    style={{
                      border: `1px solid ${ad.color}25`,
                      boxShadow: `0 0 20px ${ad.color}10`
                    }}
                  >
                    <h3 
                      className="text-white font-medium mb-2 transition-colors"
                      style={{
                        textShadow: `0 0 10px ${ad.color}50`
                      }}
                    >
                      {ad.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{ad.period}</span>
                      <span 
                        className="text-white font-bold"
                        style={{ color: ad.color }}
                      >
                        {ad.revenue}
                      </span>
                    </div>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"
                      style={{ 
                        background: `radial-gradient(circle at center, ${ad.color} 0%, transparent 70%)`
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full mt-6 py-3 text-center text-blue-400 bg-[#1a1e32] rounded-lg relative group overflow-hidden"
                style={{
                  border: `1px solid ${circleBorderColors.analytics}25`,
                  boxShadow: `0 0 20px ${circleBorderColors.analytics}10`
                }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors">
                  View detailed analytics →
                </span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ 
                    background: `radial-gradient(circle at center, ${circleBorderColors.analytics} 0%, transparent 70%)`
                  }}
                />
              </motion.button>
            </div>
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                background: `radial-gradient(circle at top right, #53E2D2 0%, transparent 70%)`
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0f1424] border border-[#1a1e32] rounded-xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 10px #53E2D240' }}
              >
                Recent Requests
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 mb-6"
              >
                You have 5 pending requests
              </motion.p>
              
              <div className="space-y-4">
                {recentRequests.map((request, index) => (
                  <motion.div 
                    key={request.company}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-[#1a1e32] rounded-lg group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    style={{
                      border: '1px solid #53E2D230',
                      boxShadow: '0 0 15px #53E2D215'
                    }}
                  >
                    <div>
                      <h3 
                        className="text-white font-medium"
                        style={{ textShadow: '0 0 10px #53E2D240' }}
                      >
                        {request.company}
                      </h3>
                      <p className="text-gray-400 text-sm">{request.type} • {request.time}</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-[#53E2D2] hover:bg-[#53E2D2] hover:text-white bg-transparent rounded-lg relative group overflow-hidden border border-[#53E2D240] transition-all duration-300">
                      View
                    </button>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ 
                        background: 'radial-gradient(circle at center, #53E2D2 0%, transparent 70%)'
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full mt-6 py-3 text-center text-[#53E2D2] bg-[#1a1e32] rounded-lg relative group overflow-hidden hover:bg-[#53E2D2] hover:text-white transition-all duration-300"
                style={{
                  border: '1px solid #53E2D230',
                  boxShadow: '0 0 15px #53E2D215'
                }}
              >
                View all requests →
              </motion.button>
            </div>
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                background: 'radial-gradient(circle at top right, #53E2D2 0%, transparent 70%)'
              }}
            />
          </motion.div>

          {/* Recent Messages */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0f1424] border border-[#1a1e32] rounded-xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 10px #6B54FA40' }}
              >
                Recent Messages
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 mb-6"
              >
                You have 3 unread messages
              </motion.p>
              
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <motion.div 
                    key={message.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-[#1a1e32] rounded-lg group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    style={{
                      border: '1px solid #6B54FA30',
                      boxShadow: '0 0 15px #6B54FA15'
                    }}
                  >
                    <div className="flex-1">
                      <h3 
                        className="text-white font-medium"
                        style={{ textShadow: '0 0 10px #6B54FA40' }}
                      >
                        {message.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{message.message} • {message.time}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#6B54FA] ml-4" style={{ boxShadow: '0 0 10px #6B54FA' }}></div>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ 
                        background: 'radial-gradient(circle at center, #6B54FA 0%, transparent 70%)'
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full mt-6 py-3 text-center text-[#6B54FA] bg-[#1a1e32] rounded-lg relative group overflow-hidden hover:bg-[#6B54FA] hover:text-white transition-all duration-300"
                style={{
                  border: '1px solid #6B54FA30',
                  boxShadow: '0 0 15px #6B54FA15'
                }}
              >
                View all messages →
              </motion.button>
            </div>
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                background: 'radial-gradient(circle at top right, #6B54FA 0%, transparent 70%)'
              }}
            />
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0f1424] border border-[#1a1e32] rounded-xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 10px #F9CA5640' }}
              >
                Quick Actions
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 mb-6"
              >
                Common tasks and operations
              </motion.p>
              
              <div className="space-y-4">
                {[
                  { text: "Add New Ad Space", color: "#F9CA56" },
                  { text: "Withdraw Earnings", color: "#6B54FA" },
                  { text: "Export Analytics", color: "#53E2D2" },
                  { text: "Update Profile", color: "#F9CA56" }
                ].map((action, index) => (
                  <motion.button
                    key={action.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="w-full flex items-center justify-between bg-[#1a1e32] p-4 rounded-lg group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    style={{
                      border: `1px solid ${action.color}30`,
                      boxShadow: `0 0 15px ${action.color}15`
                    }}
                  >
                    <span 
                      className="text-white relative z-10 group-hover:text-white transition-colors"
                      style={{ textShadow: `0 0 10px ${action.color}40` }}
                    >
                      {action.text}
                    </span>
                    <ChevronRight 
                      className="h-4 w-4 relative z-10 transition-colors duration-300" 
                      style={{ color: action.color }}
                    />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ 
                        background: `radial-gradient(circle at center, ${action.color} 0%, transparent 70%)`
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                background: 'radial-gradient(circle at top right, #F9CA56 0%, transparent 70%)'
              }}
            />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
} 