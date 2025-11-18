"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/page-container"
import { GraduationCap, Users, BookOpen, CreditCard, Video, Award, CheckCircle, Star, Globe, Shield, Clock, TrendingUp, Zap, Target, ArrowRight, UserCheck, UsersRound, MapPin, BarChart3, Calculator, Book, Code, Languages, Atom, Map, Cpu, Brain, FlaskConical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"

const features = [
  {
    icon: Users,
    title: "Expert Mentors",
    description: "Connect with the world's finest mentors and tutors across all subjects and expertise levels."
  },
  {
    icon: BookOpen,
    title: "Easy Booking",
    description: "Simple and intuitive booking system that lets you find and schedule sessions in minutes."
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment processing ensures your transactions are protected at all times."
  },
  {
    icon: Video,
    title: "Virtual Sessions",
    description: "Attend sessions from anywhere in the world through our high-quality video platform."
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "All our mentors are verified professionals committed to delivering exceptional learning experiences."
  },
  {
    icon: Star,
    title: "Best in the World",
    description: "We pride ourselves on being the premier platform for connecting students with world-class mentors."
  }
]

const values = [
  {
    title: "Excellence",
    description: "We are committed to providing the highest quality educational experiences through our carefully selected mentors."
  },
  {
    title: "Accessibility",
    description: "Education should be accessible to everyone, which is why we've made it easy to find and book sessions with expert mentors."
  },
  {
    title: "Innovation",
    description: "We continuously innovate our platform to provide the best possible experience for both students and mentors."
  },
  {
    title: "Trust",
    description: "Your learning journey is important to us. We ensure secure transactions and verified mentors you can trust."
  }
]

const stats = [
  { label: "Active Mentors", value: 50, suffix: "", icon: UserCheck },
  { label: "Students Served", value: 300, suffix: "", icon: UsersRound },
  { label: "Countries", value: 5, suffix: "", icon: MapPin },
  { label: "Success Rate", value: 98, suffix: "%", icon: BarChart3 }
]

// Animated Counter Component
function AnimatedCounter({ value, suffix, startCounting }: { value: number; suffix: string; startCounting: boolean }) {
  const [count, setCount] = useState(0)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (startCounting && !hasStartedRef.current) {
      hasStartedRef.current = true
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      const stepDuration = duration / steps

      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => {
        clearInterval(timer)
      }
    }
  }, [startCounting, value])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString()
    }
    return num.toString()
  }
 
  return (
    <span>
      {formatNumber(count)}{suffix}
    </span>
  )
}

export default function CompanyPage() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [isStatsVisible, setIsStatsVisible] = useState(false)

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let timeoutId: NodeJS.Timeout | null = null

    // Small delay to ensure ref is attached
    timeoutId = setTimeout(() => {
      const currentRef = statsRef.current
      if (!currentRef) return

      // Check if already visible
      const checkVisibility = () => {
        const rect = currentRef.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      }

      // Check immediately
      if (checkVisibility()) {
        setIsStatsVisible(true)
        return
      }

      // Set up observer
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsStatsVisible(true)
              if (observer) {
                observer.disconnect()
              }
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      )

      observer.observe(currentRef)
    }, 100)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Navbar />
      <PageContainer className="flex-1">
        <div className="py-12 md:py-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/images/logo1.png"
                alt="Brightbyt Logo"
                width={80}
                height={80}
                className="object-contain"
              />
                            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-['Verdana',sans-serif]">
              Who Are We
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 mb-4 font-['Verdana',sans-serif] leading-relaxed font-semibold">
                Welcome to <span className="text-blue-600 font-bold">Brightbyt</span>
              </p>
              <p className="text-lg text-gray-600 font-['Verdana',sans-serif] leading-relaxed">
                We are the premier platform where you can find the best mentors to teach you whatever you want to learn. 
                Book a session, make a secure payment, and have an exceptional learning experience with your special mentor. 
                We are the best in the world at connecting students with world-class educators.
                                    </p>
                                  </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                        <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                >
                  <Card className="bg-white border-2 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-400 transition-all duration-300 group">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <Icon className="w-5 h-5 text-white" />
                          </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1 font-['Verdana',sans-serif] group-hover:text-blue-600 transition-colors">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} startCounting={isStatsVisible} />
                            </div>
                      <div className="text-xs text-gray-600 font-['Verdana',sans-serif] font-medium">
                        {stat.label}
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Subjects Section */}
                      <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center font-['Verdana',sans-serif]">
                Subjects We Offer
              </h2>
              <p className="text-center text-gray-600 mb-8 font-['Verdana',sans-serif] text-lg">
                Find expert mentors for any subject you want to learn
              </p>
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/group.png"
                  alt="Subjects"
                  width={600}
                  height={450}
                  className="object-contain rounded-lg"
                />
                          </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: "Mathematics", icon: Calculator, color: "from-blue-500 to-blue-600" },
                  { name: "Programming", icon: Code, color: "from-purple-500 to-purple-600" },
                  { name: "Languages", icon: Languages, color: "from-orange-500 to-orange-600" },
                  { name: "Physical Science", icon: Atom, color: "from-red-500 to-red-600" },
                  { name: "Chemistry", icon: FlaskConical, color: "from-teal-500 to-teal-600" },
                  { name: "Computer Engineering", icon: Cpu, color: "from-indigo-500 to-indigo-600" },
                  { name: "Artificial Intelligence", icon: Brain, color: "from-pink-500 to-pink-600" },
                  { name: "Life Science", icon: Book, color: "from-emerald-500 to-emerald-600" }
                ].map((subject, index) => {
                  const Icon = subject.icon
                  return (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card className="bg-white border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                          <h3 className="text-base font-semibold text-gray-900 font-['Verdana',sans-serif] group-hover:text-blue-600 transition-colors">
                            {subject.name}
                          </h3>
                </CardContent>
              </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center font-['Verdana',sans-serif]">
                What Makes Us Different
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Verdana',sans-serif]">Secure & Trusted</h3>
                    <p className="text-gray-600 font-['Verdana',sans-serif]">
                      All payments are processed securely, and all mentors are verified professionals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Verdana',sans-serif]">Flexible Scheduling</h3>
                    <p className="text-gray-600 font-['Verdana',sans-serif]">
                      Book sessions at times that work for you, from anywhere in the world.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Verdana',sans-serif]">Instant Access</h3>
                    <p className="text-gray-600 font-['Verdana',sans-serif]">
                      Start learning immediately after booking. No waiting, no delays.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Verdana',sans-serif]">Quality Guaranteed</h3>
                    <p className="text-gray-600 font-['Verdana',sans-serif]">
                      Every mentor is carefully vetted to ensure the highest quality of instruction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

        </div>
      </div>
      </PageContainer>
      <Footer />
    </div>
  )
} 
