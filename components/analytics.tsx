"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // This is where you would typically add your analytics tracking code
    // For example, Google Analytics, Plausible, etc.
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    console.log(`Page view: ${url}`)

    // Example: if you were using Google Analytics
    // window.gtag('config', 'GA-MEASUREMENT-ID', {
    //   page_path: url,
    // })
  }, [pathname, searchParams])

  return null
}

