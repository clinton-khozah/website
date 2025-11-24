/**
 * Ad Click Tracking Utility
 * Tracks ad clicks and impressions for mentor advertising campaigns
 */

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

interface TrackClickParams {
  campaignId: string
  mentorId: number
  referrer?: string
  pageUrl?: string
}

interface TrackImpressionParams {
  campaignId: string
  mentorId: number
  pageUrl?: string
}

/**
 * Get user's location information
 */
async function getUserLocation(): Promise<{ country?: string; city?: string; ip?: string }> {
  try {
    // Try to get location from browser geolocation API (if available)
    // For IP-based location, you might want to use a service like ipapi.co or similar
    const response = await fetch("https://ipapi.co/json/")
    if (response.ok) {
      const data = await response.json()
      return {
        country: data.country_name,
        city: data.city,
        ip: data.ip,
      }
    }
  } catch (error) {
    console.error("Error fetching location:", error)
  }
  return {}
}

/**
 * Track an ad click
 */
export async function trackAdClick(params: TrackClickParams): Promise<boolean> {
  try {
    const location = await getUserLocation()
    
    const response = await fetch(`${API_BASE_URL}/mentors/ads/track-click/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign_id: params.campaignId,
        mentor_id: params.mentorId,
        referrer: params.referrer || document.referrer,
        user_agent: navigator.userAgent,
        ip_address: location.ip,
        country: location.country,
        city: location.city,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error tracking ad click:", error)
    return false
  }
}

/**
 * Track an ad impression (view)
 */
export async function trackAdImpression(params: TrackImpressionParams): Promise<boolean> {
  try {
    const location = await getUserLocation()
    
    const response = await fetch(`${API_BASE_URL}/mentors/ads/track-impression/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign_id: params.campaignId,
        mentor_id: params.mentorId,
        page_url: params.pageUrl || window.location.href,
        user_agent: navigator.userAgent,
        ip_address: location.ip,
        country: location.country,
        city: location.city,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error tracking ad impression:", error)
    return false
  }
}

/**
 * React hook for tracking ad impressions
 * Note: Import React in your component file to use this hook
 * 
 * Example usage:
 * import { trackAdImpression } from '@/lib/ad-tracking'
 * import { useEffect } from 'react'
 * 
 * function MyComponent({ campaignId, mentorId }) {
 *   useEffect(() => {
 *     if (campaignId && mentorId) {
 *       trackAdImpression({ campaignId, mentorId, pageUrl: window.location.href })
 *     }
 *   }, [campaignId, mentorId])
 * }
 */

