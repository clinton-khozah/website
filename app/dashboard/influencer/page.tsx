"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { motion } from "framer-motion"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Share2,
  BarChart2
} from "lucide-react"
import { clsx } from "clsx"

const stats = [
  {
    label: "Total Followers",
    value: "125.4K",
    change: "+12.3%",
    icon: Users,
    trend: "up"
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    change: "+0.6%",
    icon: TrendingUp,
    trend: "up"
  },
  {
    label: "Total Earnings",
    value: "$15,234",
    change: "+23.1%",
    icon: DollarSign,
    trend: "up"
  },
  {
    label: "Active Campaigns",
    value: "8",
    change: "+2",
    icon: Share2,
    trend: "up"
  }
]

const recentCampaigns = [
  {
    brand: "Nike",
    type: "Story Post",
    status: "Active",
    earnings: "$1,200",
    engagement: "4.2%"
  },
  {
    brand: "Adidas",
    type: "Feed Post",
    status: "Completed",
    earnings: "$2,500",
    engagement: "5.1%"
  },
  {
    brand: "Puma",
    type: "Reel",
    status: "Pending",
    earnings: "$1,800",
    engagement: "3.8%"
  }
]

export default function InfluencerDashboard() {
  return (
    <DashboardLayout role="influencer">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, John!</h1>
            <p className="text-gray-400 mt-1">Here's what's happening with your account today.</p>
          </div>
          <button className="px-4 py-2 bg-[#9575ff] text-white rounded-lg hover:bg-[#8a63ff] transition-colors">
            New Campaign
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-[#1a1e32] p-6 rounded-lg border border-[#2a2e45]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 bg-[#2a2e45] rounded-lg">
                  <stat.icon className="h-5 w-5 text-[#9575ff]" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={clsx(
                  "font-medium",
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                )}>
                  {stat.change}
                </span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Campaigns */}
        <div className="bg-[#1a1e32] rounded-lg border border-[#2a2e45]">
          <div className="p-6 border-b border-[#2a2e45]">
            <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="pb-4">Brand</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Earnings</th>
                    <th className="pb-4">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCampaigns.map((campaign, index) => (
                    <tr key={index} className="border-t border-[#2a2e45]">
                      <td className="py-4 text-white">{campaign.brand}</td>
                      <td className="py-4 text-gray-300">{campaign.type}</td>
                      <td className="py-4">
                        <span className={clsx(
                          "px-2 py-1 text-xs rounded-full",
                          campaign.status === "Active" ? "bg-green-400/10 text-green-400" :
                          campaign.status === "Completed" ? "bg-blue-400/10 text-blue-400" :
                          "bg-yellow-400/10 text-yellow-400"
                        )}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-4 text-white">{campaign.earnings}</td>
                      <td className="py-4 text-gray-300">{campaign.engagement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 