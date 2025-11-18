"use client"

import { useEffect } from "react"
import { useLoading } from "@/providers/loading-provider"

/**
 * Custom hook for managing loading state
 * @param isLoading - Loading state to set
 * @param duration - Optional duration in ms after which loading will automatically stop
 * @returns Loading state control methods
 */
export function useLoader(isLoading?: boolean, duration?: number) {
  const { isLoading: globalLoading, setIsLoading } = useLoading()

  // Set loading state if provided
  useEffect(() => {
    if (isLoading !== undefined) {
      setIsLoading(isLoading)
      
      // If duration provided, automatically stop loading after duration
      if (isLoading && duration) {
        const timer = setTimeout(() => {
          setIsLoading(false)
        }, duration)
        
        return () => clearTimeout(timer)
      }
    }
  }, [isLoading, duration, setIsLoading])

  // Helper methods
  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)
  
  // Utility method for wrapping async functions with loading state
  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    options?: { duration?: number }
  ): Promise<T> => {
    try {
      setIsLoading(true)
      const result = await asyncFn()
      
      // If custom duration specified, respect it
      if (options?.duration) {
        setTimeout(() => setIsLoading(false), options.duration)
      } else {
        setIsLoading(false)
      }
      
      return result
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  return {
    isLoading: globalLoading,
    startLoading,
    stopLoading,
    withLoading
  }
} 