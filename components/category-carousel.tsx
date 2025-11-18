"use client"

import { useState, useEffect, useCallback, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Mail, MessageSquare, Users, Eye, ChevronLeft, ChevronRight, Sparkles, Info, X, Calendar, Clock, BarChart2, ShieldCheck } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface CategoryCarouselProps {
  adSpaces: Array<{
    id: number
    title: string
    description: string
    type: string
    icon: any
    metrics: Record<string, ReactNode>
    price: number
    priceModel: string
    category: string
    tags: string[]
  }>
}

export function CategoryCarousel({ adSpaces }: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [flashStates, setFlashStates] = useState<boolean[]>(Array(3).fill(false))
  const [selectedSpace, setSelectedSpace] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cardsToShow = 3

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Enhanced random highlight effect for visible cards
  useEffect(() => {
    const highlightRandomCard = () => {
      const randomIdx = Math.floor(Math.random() * cardsToShow)
        setFlashStates(prev => {
        const newState = Array(3).fill(false)
        newState[randomIdx] = true
              return newState
            })

      // Turn off highlight after 2 seconds
      setTimeout(() => {
        setFlashStates(Array(3).fill(false))
      }, 2000)
    }

    const interval = setInterval(highlightRandomCard, Math.random() * 5000 + 3000)
    return () => clearInterval(interval)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + adSpaces.length) % adSpaces.length)
  }

  const getVisibleCards = useCallback(() => {
    const cards = []
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % adSpaces.length
      cards.push(adSpaces[index])
    }
    return cards
  }, [currentIndex, adSpaces, cardsToShow])

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Featured Ad Spaces</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className="rounded-full hover:bg-white/10 border-white/20 text-white backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className="rounded-full hover:bg-white/10 border-white/20 text-white backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative h-[350px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="absolute w-full h-full grid grid-cols-3 gap-6"
            >
              {getVisibleCards().map((space, idx) => (
                <motion.div
                  key={`${space.id}-${idx}`} 
                  className="w-full h-full"
                  animate={flashStates[idx] ? {
                    scale: 1.05,
                    zIndex: 10,
                    transition: { 
                      duration: 0.3, 
                      ease: "easeOut",
                      scale: { type: "spring", stiffness: 300, damping: 30 }
                    }
                  } : {
                    scale: 1,
                    zIndex: 0,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Card 
                    className={`h-full overflow-hidden shadow-xl transition-all duration-300 relative group
                      ${flashStates[idx] 
                        ? 'bg-gradient-to-br from-red-900 via-red-800 to-red-900 border-2 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] z-10' 
                        : 'bg-white/10 backdrop-blur-xl border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50 hover:scale-105'
                      }`}
                  >
                    <CardContent className="p-6 h-full flex flex-col transform-gpu">
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-500 to-red-500 animate-gradient" />
                        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-red-500 via-red-500 to-red-500 animate-gradient" />
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-500 to-red-500 animate-gradient" />
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 via-red-500 to-red-500 animate-gradient" />
                      </motion.div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className={`text-lg font-semibold transition-colors flex items-center gap-2 leading-tight transform-gpu
                            ${flashStates[idx] ? 'text-red-300' : 'text-white group-hover:text-red-300'}`}
                            style={{ 
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                              textRendering: 'optimizeLegibility',
                              transform: flashStates[idx] ? 'scale(0.95)' : 'scale(1)',
                              transformOrigin: 'left center'
                            }}
                          >
                            {space.title}
                            {flashStates[idx] && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Sparkles className="w-4 h-4 text-red-300 flex-shrink-0" />
                              </motion.div>
                            )}
                          </h3>
                          <p className={`text-sm mt-1.5 ${flashStates[idx] ? 'text-red-200/90' : 'text-white/70 group-hover:text-red-200/90'} line-clamp-2 transform-gpu`}
                             style={{ 
                               WebkitFontSmoothing: 'antialiased',
                               MozOsxFontSmoothing: 'grayscale',
                               textRendering: 'optimizeLegibility',
                               transform: flashStates[idx] ? 'scale(0.95)' : 'scale(1)',
                               transformOrigin: 'left center'
                             }}>
                            {space.description}
                          </p>
                        </div>
                        <space.icon className={`w-6 h-6 flex-shrink-0 ${flashStates[idx] ? 'text-red-400' : 'text-red-400/70 group-hover:text-red-400'}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.entries(space.metrics).map(([key, value]) => (
                          <div 
                            key={key} 
                            className={`p-2 rounded-lg transition-all duration-300
                              ${flashStates[idx] 
                                ? 'bg-gradient-to-br from-red-800/50 to-red-800/50 border border-red-500/30' 
                                : 'bg-white/5 backdrop-blur-sm group-hover:bg-red-500/10 group-hover:border-red-500/30'
                              }`}
                          >
                            <p className={`text-sm capitalize ${flashStates[idx] ? 'text-red-300' : 'text-white/50 group-hover:text-red-300'} transform-gpu`}
                               style={{
                                 transform: flashStates[idx] ? 'scale(0.95)' : 'scale(1)',
                                 transformOrigin: 'left center'
                               }}>
                              {key}
                            </p>
                            <p className={`text-base font-medium ${flashStates[idx] ? 'text-red-200' : 'text-white group-hover:text-red-200'} transform-gpu`}
                               style={{
                                 transform: flashStates[idx] ? 'scale(0.95)' : 'scale(1)',
                                 transformOrigin: 'left center'
                               }}>
                              {String(value ?? '')}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/10 group-hover:border-red-500/30">
                        <div className={flashStates[idx] ? 'text-red-300' : 'text-white group-hover:text-red-300'}>
                          <span className="text-2xl font-bold">R{space.price}</span>
                          <span className={`text-sm ml-1 ${flashStates[idx] ? 'text-red-300/80' : 'text-white/70 group-hover:text-red-300/80'}`}>
                            {space.priceModel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="default"
                                className={`h-10 px-4 text-base transition-all duration-300 ${
                                  flashStates[idx]
                                    ? 'bg-gradient-to-r from-red-500 to-red-500 text-white hover:from-red-600 hover:to-red-600 border-red-400'
                                    : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                }`}
                                onClick={() => {
                                  setSelectedSpace(space);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black/90 border border-red-500/30 p-3 max-w-xs">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-white mb-1">View Details</p>
                                  <p className="text-xs text-white/70">
                                    Click to see full details, specifications, and booking options for this ad space.
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Ad Space Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1a1145]/95 border border-red-500/30 text-white max-w-3xl">
          {selectedSpace && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold text-red-300 flex items-center gap-2">
                    {selectedSpace.title}
                    <Badge variant="outline" className="ml-2 bg-red-500/20 text-red-300 border-red-500/30">
                      {selectedSpace.category}
                    </Badge>
                  </DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <DialogDescription className="text-white/70 text-base mt-2">
                  {selectedSpace.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-300">Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-red-400" />
                      <span className="text-white/80">Type: <span className="text-white">{selectedSpace.type}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-400" />
                      <span className="text-white/80">Availability: <span className="text-white">Immediate</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-400" />
                      <span className="text-white/80">Duration: <span className="text-white">Flexible</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-red-400" />
                      <span className="text-white/80">Performance: <span className="text-white">High</span></span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-red-300 mt-6">Metrics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedSpace.metrics).map(([key, value]) => (
                      <div 
                        key={key} 
                        className="bg-red-900/30 p-3 rounded-lg border border-red-500/30"
                      >
                        <p className="text-sm text-white/70 capitalize">{key}</p>
                        <p className="text-lg font-medium text-white">
                          {String(value ?? '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-300">Pricing</h3>
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">R{selectedSpace.price}</span>
                      <span className="text-white/70">{selectedSpace.priceModel}</span>
                    </div>
                    <p className="text-sm text-white/70 mt-2">Flexible payment options available</p>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-red-300 mt-6">Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-400" />
                      <span className="text-white">Premium placement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-400" />
                      <span className="text-white">Targeted audience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-400" />
                      <span className="text-white">Performance tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-400" />
                      <span className="text-white">Customizable options</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-red-300 mt-6">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpace.tags.map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="bg-red-500/20 text-red-300 border-red-500/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button 
                  variant="outline" 
                  className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                >
                  Save for Later
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                >
                  Book Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            minHeight: '100vh',
            minWidth: '100vw',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1
          }}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>
    </div>
  )
} 