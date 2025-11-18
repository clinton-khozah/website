"use client"

import React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ParallaxSection } from "@/components/parallax-section"
import { AnimatedContent } from "@/components/animated-content"
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel"

export function Testimonials() {
  const { scrollYProgress } = useScroll()
  
  // Animation for the title to drop from top
  const titleY = useTransform(scrollYProgress, [0, 0.2], [-100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Parallax section */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: {
              type: "spring",
              stiffness: 30,
              damping: 10,
              mass: 1
            }
          }}
          viewport={{ once: true }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-4 text-yellow-400"
            initial={{ scale: 0.5, y: -300 }}
            whileInView={{ 
              scale: 1,
              y: -200,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                mass: 1
              }
            }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="relative z-10">
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  )
}

