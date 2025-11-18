"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { motion } from "framer-motion"
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  ShoppingCart
} from "lucide-react"
import clsx from "clsx"

const stats = [
  {
    label: "Total Commissions",
    value: "$24,856",
    change: "+18.2%",
    icon: DollarSign,
    trend: "up"
  },
  {
    label: "Active Referrals",
    value: "1,234",
    change: "+8.1%",
    icon: Users,
    trend: "up"
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "+0.4%",
    icon: TrendingUp,
    trend: "up"
  },
  {
    label: "Total Sales",
    value: "456",
    change: "+15.3%",
    icon: ShoppingCart,
    trend: "up"
  }
]

const recentReferrals = [
  {
    customer: "Sarah Johnson",
    product: "Premium Plan",
    commission: "$120",
    status: "Completed",
    date: "2024-02-15"
  },
  {
    customer: "Mike Smith",
    product: "Basic Plan",
    commission: "$45",
    status: "Pending",
    date: "2024-02-14"
  },
  {
    customer: "Emily Brown",
    product: "Pro Plan",
    commission: "$85",
    status: "Processing",
    date: "2024-02-13"
  }
]

export default function AffiliateDashboard() {
  return (
    <DashboardLayout role="affiliate">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, Alex!</h1>
            <p className="text-gray-400 mt-1">Track your affiliate performance and earnings.</p>
          </div>
          <button className="px-4 py-2 bg-[#9575ff] text-white rounded-lg hover:bg-[#8a63ff] transition-colors">
            Generate Link
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

        {/* Recent Referrals */}
        <div className="bg-[#1a1e32] rounded-lg border border-[#2a2e45]">
          <div className="p-6 border-b border-[#2a2e45]">
            <h2 className="text-lg font-semibold text-white">Recent Referrals</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Commission</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReferrals.map((referral, index) => (
                    <tr key={index} className="border-t border-[#2a2e45]">
                      <td className="py-4 text-white">{referral.customer}</td>
                      <td className="py-4 text-gray-300">{referral.product}</td>
                      <td className="py-4 text-white">{referral.commission}</td>
                      <td className="py-4">
                        <span className={clsx(
                          "px-2 py-1 text-xs rounded-full",
                          referral.status === "Completed" ? "bg-green-400/10 text-green-400" :
                          referral.status === "Pending" ? "bg-yellow-400/10 text-yellow-400" :
                          "bg-blue-400/10 text-blue-400"
                        )}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">{referral.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1e32] p-6 rounded-lg border border-[#2a2e45]">
            <h3 className="text-lg font-semibold text-white mb-4">Marketing Materials</h3>
            <p className="text-gray-400 mb-4">Access banners, logos, and promotional content.</p>
            <button className="text-[#9575ff] hover:text-[#8a63ff] transition-colors">
              Browse Assets →
            </button>
          </div>
          <div className="bg-[#1a1e32] p-6 rounded-lg border border-[#2a2e45]">
            <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>
            <p className="text-gray-400 mb-4">View your commission payments and statements.</p>
            <button className="text-[#9575ff] hover:text-[#8a63ff] transition-colors">
              View History →
            </button>
          </div>
          <div className="bg-[#1a1e32] p-6 rounded-lg border border-[#2a2e45]">
            <h3 className="text-lg font-semibold text-white mb-4">Support Center</h3>
            <p className="text-gray-400 mb-4">Get help with your affiliate account.</p>
            <button className="text-[#9575ff] hover:text-[#8a63ff] transition-colors">
              Get Help →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 