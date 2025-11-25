"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { SignInModal } from "@/components/auth/sign-in-modal"
import { SignUpModal } from "@/components/auth/sign-up-modal"

interface Tutor {
  id: number
  name: string
  handle: string
  avatar: string
  description: string
  followers: string
  engagement: string
  categories: string[]
  status: "trending" | "verified"
  rating: number
}

interface TutorCardsProps {
  searchQuery?: string
  selectedCategory?: string | null
}

export function TutorCards({ searchQuery = "", selectedCategory = null }: TutorCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const cardsPerView = 3
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch mentors from database
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true)
        
        // Try API first
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/mentors/list/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.mentors) {
              const mappedTutors: Tutor[] = data.mentors.map((mentor: any) => {
                // Parse specialization
                let specializations: string[] = []
                if (Array.isArray(mentor.specialization)) {
                  specializations = mentor.specialization
                } else if (typeof mentor.specialization === 'string') {
                  try {
                    specializations = JSON.parse(mentor.specialization || '[]')
                  } catch {
                    specializations = []
                  }
                }

                // Generate handle from name
                const handle = `@${mentor.name.toLowerCase().replace(/\s+/g, '')}`

                // Calculate followers (sessions conducted * 1000 for demo)
                const followers = mentor.sessions_conducted 
                  ? `${(mentor.sessions_conducted * 1000).toLocaleString()}`
                  : "0"

                // Calculate engagement (rating * 3 for demo)
                const engagement = mentor.rating 
                  ? `${(mentor.rating * 3).toFixed(1)}%`
                  : "0%"

                // Determine status
                const status: "trending" | "verified" = mentor.is_verified 
                  ? "verified" 
                  : mentor.rating >= 4.5 
                    ? "trending" 
                    : "trending"

                return {
                  id: mentor.id,
                  name: mentor.name,
                  handle: handle,
                  avatar: mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff&size=128`,
                  description: mentor.description || mentor.title || "Experienced mentor ready to help you learn.",
                  followers: followers,
                  engagement: engagement,
                  categories: specializations.length > 0 ? specializations : [mentor.title || "General"],
                  status: status,
                  rating: mentor.rating || 4.0
                }
              })
              console.log(`Mapped ${mappedTutors.length} tutors from API`)
              setTutors(mappedTutors)
              setLoading(false)
              return
            } else {
              console.log("API returned data but no mentors found")
            }
          } else {
            console.log("API response not OK:", response.status)
          }
        } catch (apiError) {
          console.log("API fetch failed, trying Supabase directly:", apiError)
        }

        // Fallback to Supabase
        const { data: mentorsData, error } = await supabase
          .from('mentors')
          .select('*')
          .limit(20)

        console.log("Supabase fetch result:", { mentorsData, error })

        if (error) {
          console.error("Error fetching mentors from Supabase:", error)
          setTutors([])
        } else if (mentorsData && mentorsData.length > 0) {
          console.log(`Found ${mentorsData.length} mentors from Supabase`)
          const mappedTutors: Tutor[] = mentorsData.map((mentor: any) => {
            // Parse specialization
            let specializations: string[] = []
            if (Array.isArray(mentor.specialization)) {
              specializations = mentor.specialization
            } else if (typeof mentor.specialization === 'string') {
              try {
                specializations = JSON.parse(mentor.specialization || '[]')
              } catch {
                specializations = []
              }
            }

            // Generate handle from name
            const handle = `@${mentor.name.toLowerCase().replace(/\s+/g, '')}`

            // Calculate followers (sessions conducted * 1000 for demo)
            const followers = mentor.sessions_conducted 
              ? `${(mentor.sessions_conducted * 1000).toLocaleString()}`
              : "0"

            // Calculate engagement (rating * 3 for demo)
            const engagement = mentor.rating 
              ? `${(mentor.rating * 3).toFixed(1)}%`
              : "0%"

            // Determine status
            const status: "trending" | "verified" = mentor.is_verified 
              ? "verified" 
              : mentor.rating >= 4.5 
                ? "trending" 
                : "trending"

            return {
              id: mentor.id,
              name: mentor.name,
              handle: handle,
              avatar: mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff&size=128`,
              description: mentor.description || mentor.title || "Experienced mentor ready to help you learn.",
              followers: followers,
              engagement: engagement,
              categories: specializations.length > 0 ? specializations : [mentor.title || "General"],
              status: status,
              rating: parseFloat(mentor.rating) || 4.0
            }
          })
          console.log(`Mapped ${mappedTutors.length} tutors from Supabase`)
          setTutors(mappedTutors)
        } else {
          console.log("No mentors data found in Supabase")
          setTutors([])
        }
      } catch (error) {
        console.error("Error fetching mentors:", error)
        setTutors([])
      } finally {
        setLoading(false)
      }
    }

    fetchMentors()
  }, [])

  // Filter tutors based on search query and selected category
  const filteredTutors = useMemo(() => {
    let filtered = tutors

    console.log("Filtering tutors. Total tutors:", tutors.length, "Search query:", searchQuery, "Category:", selectedCategory)

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tutor => 
        tutor.name.toLowerCase().includes(query) ||
        tutor.handle.toLowerCase().includes(query) ||
        tutor.description.toLowerCase().includes(query) ||
        tutor.categories.some(cat => cat.toLowerCase().includes(query))
      )
      console.log("After search filter:", filtered.length)
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(tutor =>
        tutor.categories.some(cat => 
          cat.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === "Mathematics" && (cat.toLowerCase().includes("math") || cat.toLowerCase().includes("mathematics"))) ||
          (selectedCategory === "Science" && cat.toLowerCase().includes("science")) ||
          (selectedCategory === "Programming" && (cat.toLowerCase().includes("programming") || cat.toLowerCase().includes("tech") || cat.toLowerCase().includes("technology"))) ||
          (selectedCategory === "Languages" && (cat.toLowerCase().includes("language") || cat.toLowerCase().includes("languages"))) ||
          (selectedCategory === "Physical Science" && (cat.toLowerCase().includes("physical") || cat.toLowerCase().includes("physics") || cat.toLowerCase().includes("chemistry"))) ||
          (selectedCategory === "Geography" && cat.toLowerCase().includes("geography")) ||
          (selectedCategory === "Computer Engineering" && (cat.toLowerCase().includes("computer") || cat.toLowerCase().includes("engineering") || cat.toLowerCase().includes("software"))) ||
          (selectedCategory === "Artificial Intelligence" && (cat.toLowerCase().includes("ai") || cat.toLowerCase().includes("artificial") || cat.toLowerCase().includes("intelligence") || cat.toLowerCase().includes("machine learning"))) ||
          (selectedCategory === "Life Science" && (cat.toLowerCase().includes("life") || cat.toLowerCase().includes("biology") || cat.toLowerCase().includes("biochemistry") || cat.toLowerCase().includes("biomedical")))
        )
      )
      console.log("After category filter:", filtered.length)
    }

    console.log("Final filtered tutors:", filtered.length)
    return filtered
  }, [tutors, searchQuery, selectedCategory])

  const maxIndex = Math.max(0, filteredTutors.length - cardsPerView)

  // Reset to first card when filters change
  useEffect(() => {
    setCurrentIndex(0)
  }, [searchQuery, selectedCategory])

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  // Get visible tutors based on current index
  const visibleTutors = filteredTutors.slice(currentIndex, currentIndex + cardsPerView)

  if (loading) {
    return (
      <div className="w-full py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      {filteredTutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {tutors.length === 0 
              ? "No tutors available at the moment. Please check back later." 
              : "No tutors found matching your search criteria."}
          </p>
          {tutors.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Check the browser console for details.
            </p>
          )}
        </div>
      ) : (
        <div className="relative flex items-center gap-4">
          {/* Left Arrow */}
          {canGoPrevious && (
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-110 z-10"
              aria-label="Previous tutors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          <div 
            ref={containerRef}
            className="flex-1 overflow-hidden relative"
          >
            <motion.div
              className="flex gap-6 mb-6"
              animate={{
                x: `-${currentIndex * (100 / cardsPerView)}%`
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              {filteredTutors.map((tutor, index) => (
                <div
                  key={tutor.id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`
                  }}
                >
            <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-gray-200">
                      <AvatarImage 
                        src={tutor.avatar} 
                        alt={tutor.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-semibold">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                  </div>
                  {tutor.status === "trending" && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      Trending
                    </Badge>
                  )}
                  {tutor.status === "verified" && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{tutor.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{tutor.handle}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(tutor.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < tutor.rating
                            ? "fill-yellow-200 text-yellow-400"
                            : "fill-gray-200 text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({tutor.rating})</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{tutor.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 border-gray-200"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={() => setIsSignInOpen(true)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Book Tutor
                </Button>
              </CardContent>
                </Card>
              </div>
              ))}
            </motion.div>
          </div>

          {/* Right Arrow */}
          {canGoNext && (
            <button
              onClick={handleNext}
              className="flex-shrink-0 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-110 z-10"
              aria-label="Next tutors"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignUp={() => {
          setIsSignInOpen(false)
          setIsSignUpOpen(true)
        }}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </div>
  )
}

