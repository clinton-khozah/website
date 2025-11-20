// Currency conversion utility based on user location

interface CountryCurrency {
  code: string
  symbol: string
  name: string
}

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, CountryCurrency> = {
  'US': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'ZA': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'GB': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'EU': { code: 'EUR', symbol: '€', name: 'Euro' },
  'CA': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'AU': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'NZ': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  'IN': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'JP': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'NG': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  'KE': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'GH': { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  'EG': { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  'MA': { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  'TZ': { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  'UG': { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  'ET': { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  'AO': { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  'MZ': { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  'BW': { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
  'ZW': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'NA': { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar' },
  'LS': { code: 'LSL', symbol: 'L', name: 'Lesotho Loti' },
  'SZ': { code: 'SZL', symbol: 'L', name: 'Swazi Lilangeni' },
  'MW': { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
  'ZM': { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
}

// Cache for exchange rates
let exchangeRateCache: { [key: string]: { rate: number; timestamp: number } } = {}
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

/**
 * Get country code from coordinates using reverse geocoding
 */
export async function getCountryFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EduSpace/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch country')
    }
    
    const data = await response.json()
    const countryCode = data.address?.country_code?.toUpperCase()
    
    return countryCode || null
  } catch (error) {
    console.error('Error getting country from coordinates:', error)
    return null
  }
}

/**
 * Get currency information for a country code
 */
export function getCurrencyForCountry(countryCode: string): CountryCurrency {
  return COUNTRY_CURRENCY_MAP[countryCode] || { code: 'USD', symbol: '$', name: 'US Dollar' }
}

/**
 * Get exchange rate from USD to target currency
 */
async function getExchangeRate(targetCurrency: string): Promise<number> {
  // Check cache first
  const cacheKey = `USD_${targetCurrency}`
  const cached = exchangeRateCache[cacheKey]
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rate
  }
  
  try {
    // Using ExchangeRate-API (free, no API key required for basic usage)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate')
    }
    
    const data = await response.json()
    const rate = data.rates[targetCurrency]
    
    if (!rate) {
      console.warn(`Exchange rate not found for ${targetCurrency}, using 1.0`)
      return 1.0
    }
    
    // Cache the rate
    exchangeRateCache[cacheKey] = {
      rate,
      timestamp: Date.now()
    }
    
    return rate
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    // Fallback to 1.0 if API fails
    return 1.0
  }
}

/**
 * Convert and format price based on user location
 */
export async function convertAndFormatPrice(
  usdPrice: number,
  userLocation: { lat: number; lng: number } | null
): Promise<{ formatted: string; currency: string; symbol: string }> {
  // Default to USD if no location
  if (!userLocation) {
    return {
      formatted: `$${usdPrice.toFixed(2)}`,
      currency: 'USD',
      symbol: '$'
    }
  }
  
  try {
    // Get country from coordinates
    const countryCode = await getCountryFromCoordinates(userLocation.lat, userLocation.lng)
    
    if (!countryCode) {
      return {
        formatted: `$${usdPrice.toFixed(2)}`,
        currency: 'USD',
        symbol: '$'
      }
    }
    
    // Get currency for country
    const currency = getCurrencyForCountry(countryCode)
    
    // If already USD, return as is
    if (currency.code === 'USD') {
      return {
        formatted: `$${usdPrice.toFixed(2)}`,
        currency: 'USD',
        symbol: '$'
      }
    }
    
    // Get exchange rate
    const exchangeRate = await getExchangeRate(currency.code)
    const convertedPrice = usdPrice * exchangeRate
    
    // Format based on currency
    let formatted: string
    
    if (currency.code === 'JPY' || currency.code === 'KRW' || currency.code === 'VND') {
      // No decimal places for these currencies
      formatted = `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`
    } else {
      // 2 decimal places for most currencies
      formatted = `${currency.symbol}${convertedPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }
    
    return {
      formatted,
      currency: currency.code,
      symbol: currency.symbol
    }
  } catch (error) {
    console.error('Error converting price:', error)
    // Fallback to USD
    return {
      formatted: `$${usdPrice.toFixed(2)}`,
      currency: 'USD',
      symbol: '$'
    }
  }
}

