"use client"

import { TestimonialCarousel } from "@/components/ui/testimonial-carousel"

export function TestimonialCarouselDemo() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="text-center mb-10 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
        <p className="text-muted-foreground">
          Discover why advertisers and content creators love our platform
        </p>
      </div>
      <div className="min-h-[500px] flex flex-col justify-center">
        <TestimonialCarousel />
      </div>
    </div>
  )
} 