"use client"

import { type ReactNode, useEffect, useState } from "react"
import { LazyMotion, domAnimation } from "framer-motion"
import { PageTransition } from "@/components/page-transition"
import { LoadingScreen } from "@/components/loading-screen"

interface AnimationProvidersProps {
  children: ReactNode
}

export function AnimationProviders({ children }: AnimationProvidersProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial page load
  useEffect(() => {
    // Check if this is the first load
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (!hasVisited) {
      // First visit - show loading screen
      const timer = setTimeout(() => {
        setIsLoading(false)
        sessionStorage.setItem("hasVisited", "true")
      }, 2000) // 2 second loading screen

      return () => clearTimeout(timer)
    } else {
      // Return visitor - skip loading screen
      setIsLoading(false)
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      {isLoading ? <LoadingScreen /> : <PageTransition>{children}</PageTransition>}
    </LazyMotion>
  )
}

