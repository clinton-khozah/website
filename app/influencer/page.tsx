"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Eye,
  Globe,
  LineChart as LineChartIcon,
  MessageSquare,
  TrendingUp,
  Users,
  Mail,
  ChevronDown,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Heart,
  Target,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  Clock
} from "lucide-react"
import Link from "next/link"
import { AnimatedBorderCard } from "@/components/ui/animated-border-card"
import { motion, useMotionValue, useTransform, animate, useSpring, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Meteors } from "@/components/ui/meteors"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { InfluencerSidebar } from "@/components/influencer/sidebar"
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AnimatedPosts } from "@/app/components/ui/animated-testimonials"
import { AnimatedText } from "@/components/ui/animated-text"

const cardVariants = {
  hidden: {
    x: 0,
    y: 0,
    scale: 0.8,
    opacity: 0,
  },
  visible: (custom: number) => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      delay: custom * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

const stats = [
  {
    title: "Total Earnings",
    value: 24320,
    prefix: "$",
    suffix: "",
    change: "+12% from last month",
    icon: DollarSign
  },
  {
    title: "Engagement Rate",
    value: 4.8,
    prefix: "",
    suffix: "%",
    change: "+0.6% increase",
    icon: Heart
  },
  {
    title: "Total Reach",
    value: 2.4,
    prefix: "",
    suffix: "M",
    change: "+18% growth",
    icon: Share2
  },
  {
    title: "Active Campaigns",
    value: 8,
    prefix: "",
    suffix: "",
    change: "3 pending approval",
    icon: Target
  }
]

const platformStats = [
  {
    platform: "Instagram",
    followers: "856K",
    engagement: "4.2%",
    reachGrowth: "+2.1%",
    icon: Instagram,
    color: "text-pink-500"
  },
  {
    platform: "YouTube",
    followers: "425K",
    engagement: "5.8%",
    reachGrowth: "+3.4%",
    icon: Youtube,
    color: "text-red-500"
  },
  {
    platform: "TikTok",
    followers: "1.2M",
    engagement: "6.5%",
    reachGrowth: "+8.2%",
    icon: Star,
    color: "text-blue-400"
  },
  {
    platform: "Twitter",
    followers: "235K",
    engagement: "3.1%",
    reachGrowth: "+1.5%",
    icon: Twitter,
    color: "text-sky-400"
  }
]

const topPerformingContent = [
  {
    title: "Summer Fashion Haul 2024",
    views: "1.2M",
    engagement: "6.8%",
    revenue: "$3,450",
    platform: "Instagram"
  },
  {
    title: "Healthy Morning Routine",
    views: "895K",
    engagement: "5.4%",
    revenue: "$2,840",
    platform: "YouTube"
  },
  {
    title: "Travel Vlog: Paris Edition",
    views: "750K",
    engagement: "4.9%",
    revenue: "$2,100",
    platform: "TikTok"
  }
]

const topPosts = [
  {
    platform: "Instagram",
    title: "Summer Fashion Collection 2024",
    likes: 24650,
    comments: 1284,
    shares: 856,
    date: "2 hours ago",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1440"
  },
  {
    platform: "TikTok",
    title: "Morning Routine Essentials",
    likes: 18932,
    comments: 892,
    shares: 1287,
    date: "5 hours ago",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1440"
  },
  {
    platform: "Instagram",
    title: "Travel Vlog: Paris Edition",
    likes: 15845,
    comments: 645,
    shares: 445,
    date: "8 hours ago",
    image: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?q=80&w=1440"
  },
  {
    platform: "YouTube",
    title: "Skincare Routine 2024",
    likes: 12445,
    comments: 445,
    shares: 265,
    date: "12 hours ago",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1440"
  },
  {
    platform: "Facebook",
    title: "Healthy Breakfast Ideas",
    likes: 9845,
    comments: 345,
    shares: 165,
    date: "1 day ago",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=1440"
  }
]

const upcomingCampaigns = [
  {
    title: "Summer Fashion Collection",
    brand: "StyleCo",
    date: "Aug 15, 2023",
    status: "confirmed"
  },
  {
    title: "Fitness App Promotion",
    brand: "FitLife",
    date: "Aug 22, 2023",
    status: "pending"
  },
  {
    title: "Organic Skincare Launch",
    brand: "NaturalGlow",
    date: "Sep 5, 2023",
    status: "pending"
  }
]

const recentActivity = [
  {
    id: "1",
    text: "Jessica Smith commented on your post",
    time: "2 hours ago",
    comment: "Your content is amazing! Keep up the great work!",
    type: "comment"
  },
  {
    id: "2",
    text: "Michael Brown liked your story",
    time: "5 hours ago",
    type: "like"
  },
  {
    id: "3",
    text: "StyleCo mentioned you in a comment",
    time: "1 day ago",
    comment: "Perfect collaboration!",
    type: "comment"
  },
  {
    id: "4",
    text: "New follower: Fashion Weekly",
    time: "2 days ago",
    type: "follow"
  },
  {
    id: "5",
    text: "Your post reached 1K likes",
    time: "3 days ago",
    type: "milestone"
  },
  {
    id: "6",
    text: "Campaign milestone achieved",
    time: "4 days ago",
    type: "campaign"
  },
  {
    id: "7",
    text: "Monthly analytics report ready",
    time: "5 days ago",
    type: "report"
  },
  {
    id: "8",
    text: "Content calendar updated",
    time: "1 week ago",
    type: "update"
  },
]

const followerGrowthData = [
  { 
    name: 'Instagram', 
    value: 856000, 
    color: '#E4405F',
    growth: '+12.5%',
    increase: '45K'
  },
  { 
    name: 'YouTube', 
    value: 425000, 
    color: '#FF0000',
    growth: '+8.3%',
    increase: '32K'
  },
  { 
    name: 'Facebook', 
    value: 950000, 
    color: '#1877F2',
    growth: '+6.8%',
    increase: '60K'
  },
  { 
    name: 'TikTok', 
    value: 1200000, 
    color: '#000000',
    growth: '+15.2%',
    increase: '158K'
  },
  { 
    name: 'Twitter', 
    value: 235000, 
    color: '#1DA1F2',
    growth: '+5.8%',
    increase: '13K'
  }
]

type PlatformName = 'Instagram' | 'YouTube' | 'Facebook' | 'TikTok' | 'Twitter';

const platformIcons: Record<PlatformName, LucideIcon> = {
  Instagram,
  YouTube: Youtube,
  Facebook,
  TikTok: Star,
  Twitter
}

const monthGrowth = {
  0: "18.5%", // January
  1: "15.2%", // February
  2: "12.8%", // March
  3: "14.5%", // April
  4: "16.7%", // May
  5: "13.9%"  // June
}

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  isHovered: boolean;
}

function Counter({ value, prefix = "", suffix = "", isHovered }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [hasHovered, setHasHovered] = useState(false)

  useEffect(() => {
    if (isHovered && !hasHovered) {
      setHasHovered(true)
      const animation = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (latest >= 100) {
            setDisplayValue(Math.round(latest))
          } else if (latest >= 10) {
            setDisplayValue(Number(latest.toFixed(1)))
          } else {
            setDisplayValue(Number(latest.toFixed(1)))
          }
        }
      })

      return () => animation.stop()
    } else if (!isHovered) {
      setDisplayValue(value)
      setHasHovered(false)
    }
  }, [value, isHovered, hasHovered])

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

export default function InfluencerDashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-[#1B0B36]">
      <InfluencerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="space-y-8 p-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back, Sarah!</h2>
            <p className="text-purple-200/70">Here's what's happening with your content performance</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  onHoverStart={() => setHoveredCard(stat.title)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-gray-200">{stat.title}</h3>
                        <stat.icon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-white">
                          <Counter 
                            value={stat.value} 
                            prefix={stat.prefix} 
                            suffix={stat.suffix}
                            isHovered={hoveredCard === stat.title}
                          />
                        </div>
                        <div className="flex items-center text-xs text-green-400">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {stat.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Your social media metrics across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {platformStats.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full bg-purple-800/30 flex items-center justify-center ${platform.color}`}>
                          <platform.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{platform.platform}</p>
                          <p className="text-sm text-purple-200/70">{platform.followers} followers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">{platform.engagement} engagement</p>
                        <p className="text-xs text-purple-200/70">{platform.reachGrowth} reach</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Follower Growth</CardTitle>
                  <CardDescription>Your follower growth across platforms</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={followerGrowthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {followerGrowthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #3b82f6',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '8px',
                        }}
                        formatter={(value, name, props) => {
                          return (
                            <div key={name} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span className="text-lg font-bold text-white">
                                    {(props.payload.value / 1000).toFixed(1)}K
                                  </span>
                                </div>
                                <div className="relative">
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${props.payload.name === 'Instagram' ? 'bg-[#E4405F]' : 
                                    props.payload.name === 'YouTube' ? 'bg-[#FF0000]' : 
                                    props.payload.name === 'Facebook' ? 'bg-[#1877F2]' : 
                                    props.payload.name === 'TikTok' ? 'bg-black' : 
                                    'bg-[#1DA1F2]'}`}>
                                    {React.createElement(platformIcons[props.payload.name as PlatformName], { className: "h-3 w-3 text-white" })}
                                  </div>
                                  <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${
                                    props.payload.name === 'Instagram' ? 'bg-[#E4405F]' : 
                                    props.payload.name === 'YouTube' ? 'bg-[#FF0000]' : 
                                    props.payload.name === 'Facebook' ? 'bg-[#1877F2]' : 
                                    props.payload.name === 'TikTok' ? 'bg-black' : 
                                    'bg-[#1DA1F2]'
                                  }`} />
                                </div>
                              </div>
                              <div className="text-sm text-gray-400">
                                New followers {props.payload.increase}
                              </div>
                              <div className="text-sm text-green-400">
                                {props.payload.growth} from last month
                              </div>
                            </div>
                          )
                        }}
                        labelFormatter={() => ""}
                        payload={[]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-400">Total Growth</span>
                  </div>
                  <div className="text-sm text-green-400">
                    +9.2% from last month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your most engaging content from the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedPosts posts={topPosts} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20 h-fit">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="flex items-center gap-2 p-2 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-300">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 