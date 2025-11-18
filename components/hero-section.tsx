"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ParallaxSection } from "@/components/parallax-section"
import { MarketingIllustrations } from "@/components/marketing-illustrations"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  // Handle mouse move for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    // Calculate mouse position relative to the container
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update gradient position (0-100 range for CSS gradient)
    const gradientX = (x / rect.width) * 100
    const gradientY = (y / rect.height) * 100

    // Update CSS variables for gradient text
    containerRef.current.style.setProperty("--x", `${gradientX}%`)
    containerRef.current.style.setProperty("--y", `${gradientY}%`)
  }

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": "50%",
          "--y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Marketing illustrations that float and respond to mouse */}
      <MarketingIllustrations />

      <div className="container-narrow relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <motion.h1 ref={textRef} variants={item} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            The Revolutionary Digital{" "}
            <span className="relative inline-block">
              <span className="text-[#9575ff]">Advertising</span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-[#9575ff]/30 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            {" "}Marketplace
          </motion.h1>

          <motion.p variants={item} className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect businesses with advertisers, influencers, and affiliates through an AI-powered, automated, and efficient ecosystem.
          </motion.p>

          <motion.div variants={item}>
            <Tabs defaultValue="find-spaces" className="max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#1a1e32] border border-[#2a2e45]">
                <TabsTrigger
                  value="find-spaces"
                  className="data-[state=active]:bg-[#9575ff] data-[state=active]:text-white text-gray-300"
                >
                  Find Ad Spaces
                </TabsTrigger>
                <TabsTrigger
                  value="list-space"
                  className="data-[state=active]:bg-[#9575ff] data-[state=active]:text-white text-gray-300"
                >
                  List Your Space
                </TabsTrigger>
              </TabsList>
              <TabsContent value="find-spaces">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex w-full max-w-lg mx-auto items-center space-x-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search for advertisers, influencers, or ad packages..."
                      className="pl-10 bg-[#1a1e32] border-[#2a2e45] focus:border-[#9575ff] text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      type="submit"
                      className="bg-[#9575ff] hover:bg-[#8a63ff] text-white"
                    >
                      Search
                    </Button>
                  </motion.div>
                </motion.div>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-400">
                  <span>Popular:</span>
                  <Link href="/ad-spaces?category=websites" className="hover:text-[#9575ff] transition-colors">
                    Influencer Marketing
                  </Link>
                  <span>•</span>
                  <Link href="/ad-spaces?category=social-media" className="hover:text-[#9575ff] transition-colors">
                    Social Media Ads
                  </Link>
                  <span>•</span>
                  <Link href="/ad-spaces?category=newsletters" className="hover:text-[#9575ff] transition-colors">
                    Content Creation
                  </Link>
                  <span>•</span>
                  <Link href="/ad-spaces?category=podcasts" className="hover:text-[#9575ff] transition-colors">
                    Affiliate Programs
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="list-space">
                <div className="text-center">
                  <p className="mb-4 text-gray-300">Start monetizing your platform today</p>
                  <Link href="/become-advertiser">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        className="bg-[#9575ff] hover:bg-[#8a63ff] text-white gap-2"
                        size="lg"
                      >
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>

        <ParallaxSection direction="up" speed={0.3} className="mt-12">
          <div className="flex flex-wrap justify-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2"
            >
              <div className="h-12 w-12 rounded-full bg-[#9575ff]/20 flex items-center justify-center text-white">
                <span className="text-xl font-bold">5K+</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">Ad Spaces</p>
                <p className="text-gray-400">Available</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2"
            >
              <div className="h-12 w-12 rounded-full bg-[#9575ff]/20 flex items-center justify-center text-white">
                <span className="text-xl font-bold">10K+</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">Ad Buyers</p>
                <p className="text-gray-400">Active</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2"
            >
              <div className="h-12 w-12 rounded-full bg-[#9575ff]/20 flex items-center justify-center text-white">
                <span className="text-xl font-bold">$2M+</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">Ad Revenue</p>
                <p className="text-gray-400">Generated</p>
              </div>
            </motion.div>
          </div>
        </ParallaxSection>
      </div>
    </section>
  )
}

