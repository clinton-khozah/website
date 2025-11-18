"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

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

const tutors: Tutor[] = [
  {
    id: 1,
    name: "David Kim",
    handle: "@davidgaming",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    description: "Fitness coach and nutrition expert sharing workout routines, meal plans, and health advice.",
    followers: "950K",
    engagement: "15.7%",
    categories: ["Fitness", "Health", "Nutrition"],
    status: "trending",
    rating: 4.8
  },
  {
    id: 2,
    name: "Marcus Johnson",
    handle: "@fitnesswithmark",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    description: "Fashion and lifestyle influencer sharing outfit ideas, beauty tips, and travel experiences.",
    followers: "750K",
    engagement: "11.2%",
    categories: ["Fashion", "Lifestyle", "Travel"],
    status: "trending",
    rating: 4.6
  },
  {
    id: 3,
    name: "Alex Morgan",
    handle: "@techreviewalex",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Tech reviewer and gadget enthusiast with a focus on consumer electronics and smartphones.",
    followers: "2.5M",
    engagement: "8.5%",
    categories: ["Technology", "Gadgets", "Reviews"],
    status: "verified",
    rating: 4.9
  },
  {
    id: 4,
    name: "Sarah Chen",
    handle: "@sarahmath",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Experienced mathematics tutor specializing in algebra, calculus, and advanced mathematics. Helping students excel in their math journey.",
    followers: "1.2M",
    engagement: "18.3%",
    categories: ["Mathematics", "Algebra", "Calculus"],
    status: "verified",
    rating: 4.9
  },
  {
    id: 5,
    name: "Michael Thompson",
    handle: "@mikephysics",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    description: "Physics and chemistry expert with years of teaching experience. Making physical science concepts easy to understand.",
    followers: "850K",
    engagement: "16.5%",
    categories: ["Physical Science", "Physics", "Chemistry"],
    status: "trending",
    rating: 4.7
  }
]

interface TutorCardsProps {
  searchQuery?: string
  selectedCategory?: string | null
}

export function TutorCards({ searchQuery = "", selectedCategory = null }: TutorCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const cardsPerView = 3
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter tutors based on search query and selected category
  const filteredTutors = useMemo(() => {
    let filtered = tutors

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tutor => 
        tutor.name.toLowerCase().includes(query) ||
        tutor.handle.toLowerCase().includes(query) ||
        tutor.description.toLowerCase().includes(query) ||
        tutor.categories.some(cat => cat.toLowerCase().includes(query))
      )
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
    }

    return filtered
  }, [searchQuery, selectedCategory])

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

  return (
    <div className="w-full py-8">
      {filteredTutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tutors found matching your search criteria.</p>
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Followers</div>
                    <div className="text-lg font-semibold text-gray-900">{tutor.followers}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Engagement</div>
                    <div className="text-lg font-semibold text-gray-900">{tutor.engagement}</div>
                  </div>
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
    </div>
  )
}

