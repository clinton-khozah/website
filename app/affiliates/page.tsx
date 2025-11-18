"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, DollarSign, Heart, Share2, Video, Clock, Globe, Calendar } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Live session data
const liveSessions = [
  {
    id: 1,
    title: "Advanced Mathematics Masterclass",
    host: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      reviews: 87,
      verified: true,
      expertise: "Mathematics & Statistics"
    },
    description: "Master advanced calculus, linear algebra, and mathematical proofs in this comprehensive session.",
    price: 187.50,
    currency: "R",
    duration: "90 minutes",
    date: "2025-01-20",
    time: "14:00",
    timezone: "GMT+2",
    participants: 15,
    maxParticipants: 30,
    subject: "Mathematics",
    level: "Advanced",
    language: "English",
    location: "Global"
  },
  {
    id: 2,
    title: "Finance & Investment Strategies",
    host: {
      name: "Emma Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      reviews: 65,
      verified: true,
      expertise: "Finance & Investing"
    },
    description: "Learn investment strategies, portfolio management, and financial planning from an expert.",
    price: 147.00,
    currency: "R",
    duration: "60 minutes",
    date: "2025-01-21",
    time: "10:00",
    timezone: "GMT+2",
    participants: 12,
    maxParticipants: 25,
    subject: "Finance",
    level: "Intermediate",
    language: "English",
    location: "Global"
  },
  {
    id: 3,
    title: "Health & Fitness Transformation",
    host: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.7,
      reviews: 92,
      verified: true,
      expertise: "Health & Fitness"
    },
    description: "Transform your health with personalized fitness plans, nutrition guidance, and wellness strategies.",
    price: 228.00,
    currency: "R",
    duration: "75 minutes",
    date: "2025-01-22",
    time: "18:00",
    timezone: "GMT+2",
    participants: 18,
    maxParticipants: 35,
    subject: "Health & Fitness",
    level: "All Levels",
    language: "English",
    location: "Global"
  },
  {
    id: 4,
    title: "E-commerce Business Mastery",
    host: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      reviews: 78,
      verified: true,
      expertise: "E-commerce & Retail"
    },
    description: "Build and scale your e-commerce business with proven strategies and expert insights.",
    price: 277.50,
    currency: "R",
    duration: "120 minutes",
    date: "2025-01-23",
    time: "15:30",
    timezone: "GMT+2",
    participants: 22,
    maxParticipants: 40,
    subject: "Business",
    level: "Intermediate",
    language: "English",
    location: "Global"
  },
  {
    id: 5,
    title: "Tech Innovation & Development",
    host: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      reviews: 103,
      verified: true,
      expertise: "Tech & Gadgets"
    },
    description: "Explore the latest in technology, software development, and innovation trends.",
    price: 222.00,
    currency: "R",
    duration: "90 minutes",
    date: "2025-01-24",
    time: "11:00",
    timezone: "GMT+2",
    participants: 19,
    maxParticipants: 30,
    subject: "Technology",
    level: "Advanced",
    language: "English",
    location: "Global"
  },
  {
    id: 6,
    title: "Beauty & Fashion Styling",
    host: {
      name: "Lisa Anderson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      reviews: 156,
      verified: true,
      expertise: "Beauty & Fashion"
    },
    description: "Learn professional styling techniques, beauty tips, and fashion trends from industry experts.",
    price: 319.50,
    currency: "R",
    duration: "60 minutes",
    date: "2025-01-25",
    time: "16:00",
    timezone: "GMT+2",
    participants: 25,
    maxParticipants: 50,
    subject: "Beauty & Fashion",
    level: "All Levels",
    language: "English",
    location: "Global"
  },
]

export default function LiveSessionsPage() {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSession, setSelectedSession] = useState<typeof liveSessions[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cardsPerPage = 3

  const filteredSessions = liveSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredSessions.length / cardsPerPage)
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const handleJoinSession = (session: typeof liveSessions[0]) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/images/adspace.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      <Navbar />
      <main className="flex-1 relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container py-12 max-w-7xl mx-auto px-4">
          <div className="text-center py-5 mb-8 mt-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Live Sessions Available
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join live sessions with expert mentors from around the world
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <Input
                type="search"
                placeholder="Search sessions by title, host, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {paginatedSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-80 h-[520px] rounded-2xl border-2 border-blue-200 shadow-xl p-6 flex flex-col items-center justify-between transition-all duration-300 group overflow-hidden bg-white text-gray-900"
              >
                {/* Header: Avatar, Name, Verified */}
                <div className="flex items-center gap-3 mb-3 w-full">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.host.avatar} alt={session.host.name} />
                    <AvatarFallback>{session.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">Hosted by {session.host.name}</span>
                      {session.host.verified && (
                        <Badge className="ml-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-medium">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{session.host.rating} ({session.host.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Session Title */}
                <div className="font-bold text-lg text-gray-900 mb-2 text-center">{session.title}</div>

                {/* Description */}
                <div className="text-gray-700 text-sm mb-3 text-center line-clamp-2">
                  {session.description}
                </div>

                {/* Session Details */}
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-700 mb-3 w-full space-y-2 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span><span className="font-semibold">Date:</span> {session.date} at {session.time} ({session.timezone})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span><span className="font-semibold">Duration:</span> {session.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span><span className="font-semibold">Participants:</span> {session.participants}/{session.maxParticipants}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span><span className="font-semibold">Location:</span> {session.location}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3 justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-200">{session.subject}</Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 border border-purple-200">{session.level}</Badge>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  {session.currency}{session.price.toFixed(2)}
                  <span className="text-sm font-normal text-gray-600"> to join</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto w-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-50 text-gray-500 hover:text-red-500"
                    onClick={() => toggleFavorite(session.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.has(session.id) ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleJoinSession(session)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition font-medium"
              >
                Prev
              </button>
              <span className="text-white font-semibold px-4">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-[#222]'}`}>
          {selectedSession && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedSession.host.avatar} alt={selectedSession.host.name} />
                    <AvatarFallback>{selectedSession.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      {selectedSession.title}
                    </DialogTitle>
                    <p className="text-gray-500 dark:text-gray-400">Hosted by {selectedSession.host.name}</p>
                    {selectedSession.host.verified && (
                      <Badge className="mt-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Verified Host
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Session Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">{selectedSession.date}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.time} ({selectedSession.timezone})</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Duration</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Participants</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.participants}/{selectedSession.maxParticipants} joined</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">About This Session</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedSession.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Host Information</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedSession.host.avatar} alt={selectedSession.host.name} />
                          <AvatarFallback>{selectedSession.host.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{selectedSession.host.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.host.expertise}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedSession.host.rating}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({selectedSession.host.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Session Information</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Subject</span>
                        <Badge variant="secondary">{selectedSession.subject}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Level</span>
                        <Badge variant="secondary">{selectedSession.level}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Language</span>
                        <span className="font-medium">{selectedSession.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {selectedSession.currency}{selectedSession.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Price to join this session</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-200 dark:border-gray-700"
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Video className="h-4 w-4 mr-2" />
                  Join Session Now
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

