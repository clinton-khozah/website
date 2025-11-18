"use client"

import { HowItWorks } from "@/components/how-it-works"
import { FeaturedSpaces } from "@/components/featured-spaces"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { AnimatedContent } from "@/components/animated-content"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Search, Instagram, Youtube, Twitter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CustomCursor } from "@/components/custom-cursor"
import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { CTA } from "@/components/cta"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ShuffleCards } from "@/components/ui/testimonial-cards"
import { SignUpModal } from "@/components/auth/sign-up-modal"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [favoriteAdSpaces, setFavoriteAdSpaces] = useState<Set<number>>(new Set())
  const [selectedAdSpace, setSelectedAdSpace] = useState<number | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)


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
      <main className="flex-1 relative z-10">
        <div className="relative pt-32 pb-8 flex-1 flex flex-col">
          <div className="py-2">

            <AnimatedContent>
              <div className="container-narrow relative z-10 py-2 md:py-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto text-center mb-8"
                >
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white flex flex-wrap justify-center items-baseline font-['Verdana',sans-serif]">
                    <span className="text-yellow-400 font-['Verdana',sans-serif]">The Revolutionary</span>&nbsp;
                    <span className="text-[#9575ff] font-['Verdana',sans-serif] font-bold">Online Learning</span>&nbsp;
                    <span className="text-white/90 font-['Verdana',sans-serif] font-bold">Network</span>
                  </h1>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative z-10 mb-10"
                  >
                    <div className="bg-white rounded-2xl border-2 border-blue-200 px-6 py-6 max-w-2xl mx-auto shadow-lg">
                      <p className="text-lg md:text-xl text-gray-700 mb-8 font-medium font-['Verdana',sans-serif] leading-relaxed">
                        Connect <span className="text-gray-900 font-semibold font-['Verdana',sans-serif]">Students</span> with <span className="text-gray-900 font-semibold font-['Verdana',sans-serif]">Expert Tutors</span> and <span className="text-gray-900 font-semibold font-['Verdana',sans-serif]">Mentors</span> through our <span className="relative inline-block font-['Verdana',sans-serif] text-blue-600">
                          innovative
                          <motion.span 
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                          />
                        </span> platform.
                      </p>

                      <Tabs defaultValue="find-spaces" className="relative">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-50 border border-blue-200 p-1 rounded-lg">
                          <TabsTrigger
                            value="find-spaces"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 rounded-md transition-all duration-300 font-['Verdana',sans-serif] font-medium"
                          >
                            Find Tutors
                          </TabsTrigger>
                          <TabsTrigger
                            value="list-space"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 rounded-md transition-all duration-300 font-['Verdana',sans-serif] font-medium"
                          >
                            Become a Tutor
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="find-spaces">
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                          >
                            <div className="flex w-full items-center space-x-2">
                              <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                  type="text"
                                  placeholder="Search for tutors, mentors, or subjects..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-10 bg-white border-gray-300 focus-within:border-blue-500 text-gray-900 rounded-lg transition-all font-['Verdana',sans-serif]"
                                />
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Button
                                  type="button"
                                  onClick={() => setSearchQuery("")}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 px-5 font-['Verdana',sans-serif]"
                                >
                                  Search
                                </Button>
                              </motion.div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm">
                              <span className="text-gray-600 font-['Verdana',sans-serif]">Popular:</span>
                              <div className="flex flex-wrap gap-3 items-center">
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Mathematics" ? null : "Mathematics")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Mathematics"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Mathematics
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Science" ? null : "Science")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Science"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Science
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Programming" ? null : "Programming")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Programming"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Programming
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Languages" ? null : "Languages")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Languages"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Languages
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Physical Science" ? null : "Physical Science")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Physical Science"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Physical Science
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Geography" ? null : "Geography")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Geography"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Geography
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Computer Engineering" ? null : "Computer Engineering")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Computer Engineering"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Computer Engineering
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Artificial Intelligence" ? null : "Artificial Intelligence")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Artificial Intelligence"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Artificial Intelligence
                                </button>
                                <button
                                  onClick={() => setSelectedCategory(selectedCategory === "Life Science" ? null : "Life Science")}
                                  className={`text-gray-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-full border font-['Verdana',sans-serif] text-sm ${
                                    selectedCategory === "Life Science"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                  }`}
                                >
                                  Life Science
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </TabsContent>
                        
                        <TabsContent value="list-space">
                          <div className="text-center">
                            <p className="mb-5 text-gray-700 font-medium font-['Verdana',sans-serif]">Start teaching and helping students today</p>
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Button
                                onClick={() => setIsSignUpOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2 px-4 py-2 rounded-lg shadow-md font-['Verdana',sans-serif] text-sm"
                                >
                                Get Started <ArrowRight className="h-3 w-3" />
                                </Button>
                              </motion.div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </motion.div>
                </motion.div>
                
              </div>
            </AnimatedContent>

            <AnimatedContent className="pb-0">
              <HowItWorks searchQuery={searchQuery} selectedCategory={selectedCategory} />
            </AnimatedContent>
          </div>

          <div className="my-12">
                  <ShuffleCards />
                </div>
        </div>
      </main>
      <div className="relative z-10">
                <Footer />
      </div>
     
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </div>
  )
}

