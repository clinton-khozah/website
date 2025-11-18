"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content: "The platform has transformed how we handle our advertising. The ROI tracking is incredible, and the audience targeting is spot-on.",
    avatar: "https://source.unsplash.com/featured/100x100?portrait=1",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Digital Strategist",
    company: "GrowthLabs",
    content: "As an advertiser, I love how easy it is to find and book premium ad spaces. The analytics dashboard is a game-changer.",
    avatar: "https://source.unsplash.com/featured/100x100?portrait=2",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Content Creator",
    company: "CreativeHub",
    content: "The platform made monetizing my content so much easier. The payment process is smooth, and the support team is always helpful.",
    avatar: "https://source.unsplash.com/featured/100x100?portrait=3",
    rating: 5
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Publisher",
    company: "MediaGroup",
    content: "We've seen a 40% increase in ad revenue since joining. The platform's optimization tools are incredibly effective.",
    avatar: "https://source.unsplash.com/featured/100x100?portrait=4",
    rating: 5
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Brand Manager",
    company: "FashionForward",
    content: "The targeting capabilities are impressive. We're reaching our ideal audience more effectively than ever before.",
    avatar: "https://source.unsplash.com/featured/100x100?portrait=5",
    rating: 5
  }
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Handle navigation
  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  // Calculate visible testimonials (current + next/previous)
  const visibleTestimonials = [
    testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length],
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length]
  ]

  return (
    <div className="relative w-full py-10">
      {/* Main carousel */}
      <div className="relative overflow-hidden">
        <div className="flex justify-center items-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={{
                enter: (direction) => ({
                  x: direction > 0 ? 1000 : -1000,
                  opacity: 0
                }),
                center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1
                },
                exit: (direction) => ({
                  zIndex: 0,
                  x: direction < 0 ? 1000 : -1000,
                  opacity: 0
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full max-w-3xl"
            >
              <Card className="bg-black/30 backdrop-blur-sm border-gray-700/30 overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <Avatar className="h-20 w-20 border-2 border-yellow-400/30">
                        <AvatarImage src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                        <AvatarFallback className="bg-gray-800/20 text-lg">
                          {testimonials[currentIndex].name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-xl font-bold text-white">{testimonials[currentIndex].name}</h3>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-300">{testimonials[currentIndex].role}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-300">{testimonials[currentIndex].company}</p>
                      </div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-5 w-5",
                              i < testimonials[currentIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed italic">
                        "{testimonials[currentIndex].content}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-gray-700/50 hover:bg-yellow-400/10 hover:border-yellow-400/30"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-5 w-5 text-gray-300" />
        </Button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-yellow-400 w-4" 
                  : "bg-gray-600 hover:bg-gray-500"
              )}
              onClick={() => {
                setIsAutoPlaying(false)
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-gray-700/50 hover:bg-yellow-400/10 hover:border-yellow-400/30"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </Button>
      </div>
    </div>
  )
} 