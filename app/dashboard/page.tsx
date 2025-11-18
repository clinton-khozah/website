"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Eye,
  Globe,
  LineChart,
  MessageSquare,
  TrendingUp,
  Users,
  Mail,
  ChevronDown,
  Megaphone,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { AnimatedBorderCard } from "@/components/ui/animated-border-card"
import { motion } from "framer-motion"
import { DisplayCards } from "@/components/ui/display-cards"
import { useState } from "react"
import { Meteors } from "@/components/ui/meteors"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedEmail } from "@/components/ui/animated-email"

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

const topPerformingAdSpaces = [
  {
    icon: <Globe className="size-4 text-green-400" />,
    title: "Tech Blog Premium Banner",
    description: "$4,200 revenue",
    date: "This month",
    iconClassName: "text-green-400",
    titleClassName: "text-green-400",
    className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Users className="size-4 text-orange-400" />,
    title: "Newsletter Sponsorship",
    description: "$3,150 revenue",
    date: "This month",
    iconClassName: "text-orange-400",
    titleClassName: "text-orange-400",
    className: "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <MessageSquare className="size-4 text-blue-300" />,
    title: "Podcast Ad Spot",
    description: "$2,800 revenue",
    date: "This month",
    iconClassName: "text-blue-300",
    titleClassName: "text-blue-300",
    className: "[grid-area:stack] translate-x-24 translate-y-16 hover:translate-y-8 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
];

const revenueData = [
  { month: "Jan", revenue: 8500 },
  { month: "Feb", revenue: 9200 },
  { month: "Mar", revenue: 10500 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
];

export default function DashboardPage() {
  const currentMonth = revenueData.find(data => data.month === "Mar") || revenueData[revenueData.length - 1]
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,543",
      change: "+18% from last month",
      icon: DollarSign
    },
    {
      title: "Active Ad Spaces",
      value: "8",
      change: "+2 new this month",
      icon: Globe
    },
    {
      title: "Pending Requests",
      value: "5",
      change: "3 new since yesterday",
      icon: MessageSquare
    },
    {
      title: "Total Impressions",
      value: "1.2M",
      change: "+12% from last month",
      icon: Eye
    }
  ]

  const getGrowthPercentage = (currentMonth: typeof revenueData[0]) => {
    const currentIndex = revenueData.findIndex(data => data.month === currentMonth.month)
    if (currentIndex <= 0) return 0
    return Math.round(
      (currentMonth.revenue - revenueData[currentIndex - 1].revenue) / 
      revenueData[currentIndex - 1].revenue * 100
    )
  }

  const getTotalRevenue = () => revenueData.reduce((acc, curr) => acc + curr.revenue, 0)

  return (
    <div className="space-y-8 p-8">
        <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-gray-400">Welcome back! Here's an overview of your advertising spaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$45,231.89</div>
              <p className="text-xs text-gray-400">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-gray-400">+2 new this month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Influencers</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">48</div>
              <p className="text-xs text-gray-400">+5 new this month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4.2%</div>
              <p className="text-xs text-gray-400">+0.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border-2 border-blue-500/50 bg-transparent h-9 w-[400px] grid grid-cols-3 rounded-none p-1 shadow-[inset_0_0_35px_rgba(59,130,246,0.3)]">
          <TabsTrigger 
            value="overview" 
            className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-orange-500 data-[state=active]:rounded-none data-[state=active]:shadow-[inset_0_0_30px_rgba(34,197,94,0.5)] data-[state=active]:text-white data-[state=active]:bg-transparent hover:bg-transparent px-2 py-[2px] text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-orange-500 data-[state=active]:rounded-none data-[state=active]:shadow-[inset_0_0_30px_rgba(34,197,94,0.5)] data-[state=active]:text-white data-[state=active]:bg-transparent hover:bg-transparent px-2 py-[2px] text-sm"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-orange-500 data-[state=active]:rounded-none data-[state=active]:shadow-[inset_0_0_30px_rgba(34,197,94,0.5)] data-[state=active]:text-white data-[state=active]:bg-transparent hover:bg-transparent px-2 py-[2px] text-sm"
          >
            Reports
          </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Click on a month to view details</CardDescription>
                </CardHeader>
              <CardContent className="flex gap-6">
                <div className="space-y-2 w-1/3 border-r border-blue-500/20 pr-4">
                  {revenueData.map((data, index) => {
                    const isFutureMonth = data.revenue === 0;
                    const isPastMonth = !isFutureMonth && data.month !== selectedMonth.month;
                    return (
                      <div key={data.month} className="relative group">
                        {isFutureMonth && (
                          <div className="absolute -right-2 translate-x-full top-1/2 -translate-y-1/2 bg-blue-950/90 text-blue-200 text-xs rounded-lg px-3 py-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-blue-500/20">
                            We're currently in March. This is a future month.
                          </div>
                        )}
                        {isPastMonth && (
                          <div className="absolute -right-2 translate-x-full top-1/2 -translate-y-1/2 bg-blue-950/90 text-blue-200 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-blue-500/20">
                            <div className="space-y-1">
                              <p className="font-medium">Revenue: ${data.revenue.toLocaleString()}</p>
                              <p className="text-blue-300/80">
                                {Math.round((data.revenue / getTotalRevenue()) * 100)}% of total revenue
                              </p>
                              {index < revenueData.length - 1 && (
                                <p className="text-green-400">
                                  {Math.round(
                                    ((revenueData[index + 1].revenue - data.revenue) / 
                                    data.revenue) * 100
                                  )}% growth next month
                                </p>
                              )}
                  </div>
                        </div>
                        )}
                        <button
                          onClick={() => !isFutureMonth && setSelectedMonth(data)}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors
                            ${selectedMonth.month === data.month 
                              ? 'bg-blue-500/10 text-blue-500' 
                              : isFutureMonth
                                ? 'text-muted-foreground/50 cursor-not-allowed'
                                : 'hover:bg-blue-500/5 text-muted-foreground hover:text-blue-400'}`}
                          disabled={isFutureMonth}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isFutureMonth 
                              ? 'bg-blue-500/5' 
                              : selectedMonth.month === data.month
                                ? 'bg-blue-500/10'
                                : 'bg-blue-500/10'
                          }`}>
                            <span className="text-sm font-medium">{data.month}</span>
                        </div>
                          <span className="text-sm font-medium">
                            {selectedMonth.month === data.month ? `$${data.revenue.toLocaleString()}` : ''}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/50 to-blue-900/20"
                      style={{ animation: 'rotateCircle 10s linear infinite' }}
                    >
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_45px_rgba(59,130,246,0.2)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="space-y-6 text-center p-8">
                        <div>
                          <p className="text-sm text-blue-300">Revenue</p>
                          <p className="text-4xl font-bold text-white mt-2">
                            ${selectedMonth.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-400" />
                              <span className="text-base text-green-400">
                                {getGrowthPercentage(selectedMonth)}%
                              </span>
                        </div>
                            <p className="text-sm text-blue-300 mt-1">vs prev month</p>
                      </div>
                          <div>
                            <p className="text-base font-medium text-white">
                              {Math.round((selectedMonth.revenue / getTotalRevenue()) * 100)}%
                            </p>
                            <p className="text-sm text-blue-300">of total revenue</p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 bg-black/95 border-blue-500/20">
              <CardHeader>
                <CardTitle>Top Performing Ad Spaces</CardTitle>
                <CardDescription>Based on revenue this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[300px] w-full items-center justify-center">
                  <DisplayCards cards={topPerformingAdSpaces} />
                  </div>
                </CardContent>
                <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/analytics" className="flex items-center justify-center">
                      View detailed analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                  <CardDescription>You have 5 pending requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">TechGadgets Inc.</p>
                          <p className="text-xs text-muted-foreground">Tech Blog Banner • 2 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">SaaS Platform Pro</p>
                          <p className="text-xs text-muted-foreground">Newsletter • 5 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">CloudCompute Ltd</p>
                          <p className="text-xs text-muted-foreground">Podcast Ad • 1 day ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/requests" className="flex items-center justify-center">
                      View all requests
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>You have 3 unread messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Sarah Johnson</p>
                          <p className="text-xs text-muted-foreground">Question about banner specs • 1 hour ago</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Michael Chen</p>
                          <p className="text-xs text-muted-foreground">Campaign renewal • 3 hours ago</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Jessica Williams</p>
                          <p className="text-xs text-muted-foreground">Payment confirmation • 5 hours ago</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/messages" className="flex items-center justify-center">
                      View all messages
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            <Card className="bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/ad-spaces/new">
                        <Globe className="mr-2 h-4 w-4" />
                        Add New Ad Space
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/earnings/withdraw">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Withdraw Earnings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/analytics/export">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Export Analytics
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard/settings">
                        <Users className="mr-2 h-4 w-4" />
                        Update Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Click on a month to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="space-y-2 w-1/3 border-r border-orange-500/20 pr-4">
                    {revenueData.map((data, index) => {
                      const isFutureMonth = data.revenue === 0;
                      const isPastMonth = !isFutureMonth && data.month !== selectedMonth.month;
                      return (
                        <div key={data.month} className="relative group">
                          {isFutureMonth && (
                            <div className="absolute -right-2 translate-x-full top-1/2 -translate-y-1/2 bg-[#1a0f00] text-orange-200 text-xs rounded-lg px-3 py-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-orange-500/30">
                              We're currently in March. This is a future month.
                            </div>
                          )}
                          {isPastMonth && (
                            <div className="absolute -right-2 translate-x-full top-1/2 -translate-y-1/2 bg-[#1a0f00] text-orange-200 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-orange-500/30">
                              <div className="space-y-1">
                                <p className="font-medium text-orange-200">
                                  CTR: {data.month === "Jan" ? "18.5" : data.month === "Feb" ? "21.2" : "24.5"}%
                                </p>
                                <p className="text-orange-300/90">
                                  {data.month === "Jan" ? "950K" : data.month === "Feb" ? "1.05M" : "1.2M"} impressions
                                </p>
                                {index < revenueData.length - 1 && (
                                  <p className="text-green-400">
                                    {data.month === "Jan" ? "+15%" : data.month === "Feb" ? "+8%" : "+12%"} growth next month
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => !isFutureMonth && setSelectedMonth(data)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors
                              ${selectedMonth.month === data.month 
                                ? 'bg-orange-500/10 text-orange-500' 
                                : isFutureMonth
                                  ? 'text-muted-foreground/50 cursor-not-allowed'
                                  : 'hover:bg-orange-500/5 text-muted-foreground hover:text-orange-400'}`}
                            disabled={isFutureMonth}
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isFutureMonth 
                                ? 'bg-orange-500/5' 
                                : selectedMonth.month === data.month
                                  ? 'bg-orange-500/10'
                                  : 'bg-orange-500/10'
                            }`}>
                              <span className="text-sm font-medium">{data.month}</span>
                            </div>
                            <span className="text-sm font-medium">
                              {selectedMonth.month === data.month ? `${data.month === "Jan" ? "18.5" : data.month === "Feb" ? "21.2" : "24.5"}%` : ''}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-72 h-72">
                      <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 bg-gradient-to-br from-orange-950/50 to-orange-900/20">
                        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_45px_rgba(249,115,22,0.2)]" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="space-y-6 text-center p-8">
                          <div>
                            <p className="text-sm text-orange-300">CTR</p>
                            <p className="text-4xl font-bold text-white mt-2">
                              {selectedMonth.month === "Jan" ? "18.5" : selectedMonth.month === "Feb" ? "21.2" : "24.5"}%
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-base text-green-400">
                                  {selectedMonth.month === "Jan" ? "+15%" : selectedMonth.month === "Feb" ? "+8%" : "+12%"}
                                </span>
                              </div>
                              <p className="text-sm text-orange-300 mt-1">vs prev month</p>
                            </div>
                            <div>
                              <p className="text-base font-medium text-white">
                                {selectedMonth.month === "Jan" ? "950K" : selectedMonth.month === "Feb" ? "1.05M" : "1.2M"}
                              </p>
                              <p className="text-sm text-orange-300">total impressions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader>
                <CardTitle>Top Performing Metrics</CardTitle>
                <CardDescription>Key metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-orange-500/5 hover:scale-[1.02] hover:rotate-[-1deg] group">
                    <div className="h-2 w-2 rounded-full bg-green-400 group-hover:bg-orange-400 transition-colors duration-300" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-orange-400 transition-colors duration-300">Click-Through Rate (CTR)</p>
                      <p className="text-xs text-muted-foreground group-hover:text-orange-300/80 transition-colors duration-300">24.5% average</p>
                    </div>
                    <div className="text-sm text-green-400 group-hover:text-orange-400 transition-colors duration-300">+12%</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-orange-500/5 hover:scale-[1.02] hover:rotate-[-1deg] group">
                    <div className="h-2 w-2 rounded-full bg-blue-400 group-hover:bg-orange-400 transition-colors duration-300" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-orange-400 transition-colors duration-300">Conversion Rate</p>
                      <p className="text-xs text-muted-foreground group-hover:text-orange-300/80 transition-colors duration-300">3.2% average</p>
                    </div>
                    <div className="text-sm text-blue-400 group-hover:text-orange-400 transition-colors duration-300">+8%</div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-orange-500/5 hover:scale-[1.02] hover:rotate-[-1deg] group">
                    <div className="h-2 w-2 rounded-full bg-orange-400 group-hover:bg-orange-400 transition-colors duration-300" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-orange-400 transition-colors duration-300">Engagement Rate</p>
                      <p className="text-xs text-muted-foreground group-hover:text-orange-300/80 transition-colors duration-300">18.7% average</p>
                    </div>
                    <div className="text-sm text-orange-400 group-hover:text-orange-400 transition-colors duration-300">+15%</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500/80 to-green-500/80 hover:from-blue-500/90 hover:to-green-500/90 transition-all duration-300 text-white border-0 shadow-lg shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/dashboard/detailed-metrics" className="flex items-center justify-center">
                    View detailed metrics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20 flex-1 mr-4">
              <div className="absolute inset-0 h-full w-full">
                <Meteors number={20} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle>Reports</CardTitle>
                <CardDescription>Download and view detailed reports</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Revenue Report</p>
                      <p className="text-sm text-muted-foreground">August 2023</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Ad Performance Summary</p>
                      <p className="text-sm text-muted-foreground">Last 30 days</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Audience Demographics</p>
                      <p className="text-sm text-muted-foreground">Q3 2023</p>
                    </div>
                    <Button size="sm">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-[300px] bg-gradient-to-br from-blue-950/30 to-blue-900/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AnimatedEmail />
                  Email Reports
                </CardTitle>
                <CardDescription>Receive reports directly in your inbox</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Get <span className="text-green-400">Adsy</span> to send you reports
                    </p>
                    <Switch className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-orange-500/20 data-[state=checked]:hover:bg-orange-500/90 data-[state=unchecked]:hover:bg-orange-500/30 [&>span]:data-[state=checked]:bg-green-500 [&>span]:data-[state=unchecked]:bg-red-500" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        Select Frequency
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px]">
                      <DropdownMenuItem>
                        Per Advertisement
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Every 10 Days
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Monthly
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Quarterly
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Every 6 Months
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}

