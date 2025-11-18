"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube, Twitter, Globe, Users, Star, TrendingUp, Calendar, Check, Twitch, Award, Target, DollarSign, Clock, Heart, MessageSquare, Share2, Zap, Trophy, TrendingUp as TrendingUpIcon } from "lucide-react"
import { Footer } from "@/components/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparklines, SparklinesLine } from "react-sparklines"

const influencers = [
  {
    name: "Alex Morgan",
    handle: "@techreviewalex",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Tech reviewer and gadget enthusiast with a focus on consumer electronics and smartphones.",
    posts: 245,
    website: "https://alextechreviews.com",
    followers: "2.5M",
    engagement: "8.5%",
    categories: ["Technology", "Gadgets", "Reviews"],
    platforms: ["YouTube", "Instagram", "Twitter"],
    avgViews: "500K",
    location: "San Francisco, CA",
    languages: ["English", "Spanish"],
    verified: true,
    joinDate: "Jan 2020",
    achievements: ["Top Tech Creator 2023", "Best Tech Reviews 2022"],
    collaborationRate: "R70K - R140K",
    responseTime: "< 24 hours",
    topBrands: ["Apple", "Samsung", "Sony"],
    recentCampaigns: [
      { name: "iPhone 15 Launch", success: "98%", reach: "2.1M" },
      { name: "Samsung S24 Review", success: "95%", reach: "1.8M" }
    ],
    growth: "+15%",
    audienceAge: "18-34",
    audienceGender: "65% Male",
    topLocations: ["US", "UK", "Canada"]
  },
  {
    name: "Sophia Chen",
    handle: "@sophiastyle",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Gaming streamer and content creator covering new releases, gameplay strategies, and industry news.",
    posts: 312,
    website: "https://sophiastyle.gg",
    followers: "1.8M",
    engagement: "12.3%",
    categories: ["Gaming", "eSports", "Live Streaming"],
    platforms: ["Twitch", "YouTube", "Discord"],
    avgViews: "350K",
    location: "Los Angeles, CA",
    languages: ["English", "Mandarin"],
    verified: true,
    joinDate: "Mar 2019",
    achievements: ["Twitch Partner", "Gaming Awards 2023"],
    collaborationRate: "R42K - R112K",
    responseTime: "< 12 hours",
    topBrands: ["NVIDIA", "Razer", "Logitech"],
    recentCampaigns: [
      { name: "RTX 4090 Launch", success: "96%", reach: "1.5M" },
      { name: "Gaming Setup Tour", success: "92%", reach: "1.2M" }
    ],
    growth: "+22%",
    audienceAge: "16-28",
    audienceGender: "70% Male",
    topLocations: ["US", "Japan", "South Korea"]
  },
  {
    name: "David Kim",
    handle: "@davidgaming",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    description: "Fitness coach and nutrition expert sharing workout routines, meal plans, and health advice.",
    posts: 180,
    website: "https://davidfit.com",
    followers: "950K",
    engagement: "15.7%",
    categories: ["Fitness", "Health", "Nutrition"],
    platforms: ["Instagram", "YouTube", "TikTok"],
    avgViews: "200K",
    location: "Miami, FL",
    languages: ["English", "Korean"],
    verified: false,
    joinDate: "Jun 2021"
  },
  {
    name: "Emily Rodriguez",
    handle: "@emilyeats",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Food blogger and recipe creator specializing in easy, healthy meals and baking tutorials.",
    posts: 410,
    website: "https://emilyeats.com",
    followers: "1.2M",
    engagement: "9.8%",
    categories: ["Food", "Cooking", "Lifestyle"],
    platforms: ["Instagram", "YouTube", "Pinterest"],
    avgViews: "280K",
    location: "New York, NY",
    languages: ["English", "Spanish"],
    verified: true,
    joinDate: "Sep 2018"
  },
  {
    name: "Marcus Johnson",
    handle: "@fitnesswithmark",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    description: "Fashion and lifestyle influencer sharing outfit ideas, beauty tips, and travel experiences.",
    posts: 98,
    website: "https://marklifestyle.com",
    followers: "750K",
    engagement: "11.2%",
    categories: ["Fashion", "Lifestyle", "Travel"],
    platforms: ["Instagram", "TikTok", "YouTube"],
    avgViews: "150K",
    location: "Chicago, IL",
    languages: ["English"],
    verified: false,
    joinDate: "Apr 2022"
  },
  {
    name: "Sarah Lee",
    handle: "@sarahlee",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    description: "Travel vlogger exploring the world and sharing unique experiences and tips.",
    posts: 220,
    website: "https://sarahleetravels.com",
    followers: "1.5M",
    engagement: "13.5%",
    categories: ["Travel", "Adventure", "Photography"],
    platforms: ["YouTube", "Instagram", "TikTok"],
    avgViews: "400K",
    location: "Worldwide",
    languages: ["English", "Korean", "Japanese"],
    verified: true,
    joinDate: "May 2019"
  },
];

// AnimatedCounter for stats
function AnimatedCounter({ value }: { value: number | string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) : value;
    if (isNaN(end)) return setCount(0);
    if (end === 0) return setCount(0);
    const duration = 1000;
    const increment = Math.ceil(end / (duration / 16));
    let current = start;
    const step = () => {
      current += increment;
      if (current >= end) {
        setCount(end);
      } else {
        setCount(current);
        requestAnimationFrame(step);
      }
    };
    step();
  }, [value]);
  return <span>{typeof value === 'string' && value.includes('%') ? `${count}%` : count.toLocaleString()}</span>;
}

// StarRating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
      <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
    </div>
  );
}

// Skeleton Loader
function InfluencerSkeleton() {
  return (
    <div className="w-80 h-[480px] rounded-2xl border shadow-xl p-6 flex flex-col items-center justify-between animate-pulse bg-gray-100 dark:bg-gray-800">
      <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4" />
      <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
      <div className="h-3 w-40 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
      <div className="flex gap-2 mb-2">
        <div className="h-3 w-10 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="h-3 w-10 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
      <div className="flex gap-2 mb-2">
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-600 rounded" />
    </div>
  );
}

// Collaboration Request Modal
function CollaborationModal({ open, onClose, influencer }: any) {
  const [form, setForm] = useState({ name: '', email: '', message: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="font-bold mb-2 text-black dark:text-white">Request Collaboration</h2>
        {submitted ? (
          <div className="text-green-600 dark:text-green-400">Request sent! {influencer?.name} will get back to you soon.</div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); onClose(); }} className="space-y-3">
            <input className="w-full border rounded p-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800" placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input className="w-full border rounded p-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800" placeholder="Your Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <input className="w-full border rounded p-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800" placeholder="Budget (optional)" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            <textarea className="w-full border rounded p-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800" placeholder="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded">Send Request</button>
          </form>
        )}
        <button className="mt-4 text-sm text-gray-500 dark:text-gray-300" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Share Buttons
function ShareButtons({ influencer }: any) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Check out ${influencer.name} on our platform!`);
  return (
    <div className="flex gap-2 mt-2">
      <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')} className="hover:text-cyan-500"><Twitter size={20} /></button>
      <button onClick={() => window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')} className="hover:text-green-600"><Share2 size={20} /></button>
    </div>
  );
}

// Comparison Modal
function ComparisonModal({ open, onClose, influencers }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-4xl shadow-xl overflow-x-auto">
        <h2 className="font-bold mb-4 text-black dark:text-white">Compare Influencers</h2>
        <div className="flex gap-6">
          {influencers.map((inf: any) => (
            <div key={inf.handle} className="w-80 rounded-2xl border shadow-xl p-6 flex flex-col items-center bg-white dark:bg-gray-900">
              <img src={inf.avatar} alt={inf.name} className="w-20 h-20 rounded-full mb-2" />
              <div className="font-bold text-lg mb-1">{inf.name}</div>
              <div className="text-sm text-gray-500 mb-1">{inf.handle}</div>
              <div className="mb-1">Followers: <AnimatedCounter value={inf.followers} /></div>
              <div className="mb-1">Engagement: <AnimatedCounter value={inf.engagement} /></div>
              <div className="mb-1">Avg Views: <AnimatedCounter value={inf.avgViews} /></div>
              <div className="mb-1">Growth: {inf.growth}</div>
              <div className="mb-1">Categories: {inf.categories.join(', ')}</div>
              <div className="mb-1">Platforms: {inf.platforms.join(', ')}</div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-gray-500 dark:text-gray-300" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function InfluencersPage() {
  const { theme } = useTheme()
  const [search, setSearch] = useState("")
  const [selectedInfluencer, setSelectedInfluencer] = useState<typeof influencers[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const cardsPerPage = 3
  const [loading, setLoading] = useState(true)
  const [showCollab, setShowCollab] = useState(false)
  const [collabInfluencer, setCollabInfluencer] = useState<any>(null)
  const [compare, setCompare] = useState<any[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [reviews, setReviews] = useState<{[handle: string]: {user: string, rating: number, comment: string}[]}>({})
  const [reviewInput, setReviewInput] = useState<{user: string, rating: number, comment: string}>({user: '', rating: 5, comment: ''})
  const [sort, setSort] = useState('followers')
  const [filter, setFilter] = useState({ location: '', language: '', verified: '', minFollowers: '', maxFollowers: '' })

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200)
  }, [])

  // Advanced filtering
  let filteredInfluencers = influencers.filter(influencer => {
    const searchTerm = search.toLowerCase()
    const followers = parseInt((influencer.followers || '').replace(/[^\d]/g, ''))
    return (
      (influencer.name.toLowerCase().includes(searchTerm) ||
      influencer.handle.toLowerCase().includes(searchTerm) ||
      influencer.description.toLowerCase().includes(searchTerm) ||
      influencer.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
      (influencer.topBrands?.some(brand => brand.toLowerCase().includes(searchTerm)) ?? false)) &&
      (!filter.location || (influencer.location && influencer.location.toLowerCase().includes(filter.location.toLowerCase()))) &&
      (!filter.language || (influencer.languages && influencer.languages.some(l => l.toLowerCase().includes(filter.language.toLowerCase())))) &&
      (!filter.verified || (filter.verified === 'yes' ? influencer.verified : !influencer.verified)) &&
      (!filter.minFollowers || followers >= parseInt(filter.minFollowers)) &&
      (!filter.maxFollowers || followers <= parseInt(filter.maxFollowers))
    )
  })

  // Sorting
  filteredInfluencers = filteredInfluencers.sort((a, b) => {
    if (sort === 'followers') return parseInt((b.followers || '').replace(/[^\d]/g, '')) - parseInt((a.followers || '').replace(/[^\d]/g, ''))
    if (sort === 'engagement') return parseFloat((b.engagement || '0').replace('%','')) - parseFloat((a.engagement || '0').replace('%',''))
    return 0
  })

  const totalPages = Math.ceil(filteredInfluencers.length / cardsPerPage)
  const paginatedInfluencers = filteredInfluencers.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)

  const handleViewMore = (influencer: typeof influencers[0]) => {
    setSelectedInfluencer(influencer);
    setIsModalOpen(true);
    setShowCollab(true);
    setCollabInfluencer(influencer);
  }

  // Review submit
  const handleReviewSubmit = (handle: string) => {
    if (!reviewInput.user || !reviewInput.comment) return
    setReviews(prev => ({
      ...prev,
      [handle]: [...(prev[handle] || []), { ...reviewInput }]
    }))
    setReviewInput({ user: '', rating: 5, comment: '' })
  }

  // Badge logic
  const getBadges = (inf: any) => {
    const badges = []
    if (parseInt((inf.followers || '').replace(/[^\d]/g, '')) > 1000000) badges.push({ label: 'Top Influencer', color: 'bg-yellow-400 text-yellow-900 animate-bounce' })
    if (inf.verified) badges.push({ label: 'Verified', color: 'bg-blue-500 text-white animate-pulse' })
    if (parseFloat((inf.engagement || '0').replace('%','')) > 10) badges.push({ label: 'Trending', color: 'bg-pink-500 text-white animate-pulse' })
    return badges
  }
  
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
      <main className="flex-1 relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container py-12 max-w-7xl mx-auto px-4">
          <div className="text-center py-5 mb-8 mt-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find the Perfect Mentor
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with verified mentors who can help you achieve your goals
            </p>
            <div className="max-w-2xl mx-auto mb-4">
              <Input
                type="search"
                placeholder="Search mentors by name, category, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <input className="border rounded p-1 text-xs" placeholder="Location" value={filter.location} onChange={e => setFilter(f => ({ ...f, location: e.target.value }))} />
              <input className="border rounded p-1 text-xs" placeholder="Language" value={filter.language} onChange={e => setFilter(f => ({ ...f, language: e.target.value }))} />
              <select className="border rounded p-1 text-xs" value={filter.verified} onChange={e => setFilter(f => ({ ...f, verified: e.target.value }))}>
                <option value="">All</option>
                <option value="yes">Verified</option>
                <option value="no">Not Verified</option>
              </select>
              <input className="border rounded p-1 text-xs" placeholder="Min Students" type="number" value={filter.minFollowers} onChange={e => setFilter(f => ({ ...f, minFollowers: e.target.value }))} />
              <input className="border rounded p-1 text-xs" placeholder="Max Students" type="number" value={filter.maxFollowers} onChange={e => setFilter(f => ({ ...f, maxFollowers: e.target.value }))} />
              <select className="border rounded p-1 text-xs" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="followers">Sort by Students</option>
                <option value="engagement">Sort by Rating</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <InfluencerSkeleton key={i} />)
              : paginatedInfluencers.map((influencer) => (
              <div
                key={influencer.handle}
                  className={`w-80 h-[520px] rounded-2xl border shadow-xl p-6 flex flex-col items-center justify-between transition-all duration-300 group overflow-hidden ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-[#222] border-gray-200'}`}
              >
                  <div className="relative inline-block">
                  <img
                    src={influencer.avatar}
                    alt={influencer.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 shadow border-4 border-indigo-600"
                    />
                    <div className="absolute -bottom-2 right-0 flex gap-1">
                      {getBadges(influencer).map(b => <span key={b.label} className={`px-2 py-1 rounded-full text-xs font-bold ${b.color}`}>{b.label}</span>)}
                    </div>
                </div>

                  <div className="flex justify-center items-center gap-2 mb-2">
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{influencer.name}</h3>
                  {(influencer.achievements?.length ?? 0) > 0 && (
                      <div className="flex gap-1">
                        <Award size={16} className="text-yellow-400 animate-bounce" />
                        <Trophy size={16} className="text-yellow-400 animate-bounce" />
                    </div>
                  )}
                </div>

                  <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{influencer.handle}</div>

                  <div className={`mb-2 text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{influencer.description}</div>

                  <div className="flex justify-center gap-6 mb-2">
                    <div className="text-center">
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Followers</div>
                      <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{influencer.followers}</div>
                </div>
                    <div className="text-center">
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Engagement</div>
                      <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{influencer.engagement}</div>
                </div>
                  </div>

                  {/* Mini Analytics/Chart */}
                  <div className="w-full mb-2">
                    <Sparklines data={[10, 20, 15, 30, 25, 40, 35]} height={30}><SparklinesLine color="#06b6d4" /></Sparklines>
                </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {influencer.categories.slice(0, 3).map((category) => (
                    <Badge
                      key={category}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                  <div className="flex justify-center gap-2 mb-4">
                  {influencer.platforms.slice(0, 3).map((platform) => {
                    const Icon = {
                      'YouTube': Youtube,
                      'Instagram': Instagram,
                      'Twitter': Twitter,
                      'Twitch': Twitch,
                      'TikTok': TrendingUp,
                      'Discord': Users,
                      'Pinterest': Globe
                    }[platform] || Globe
                    return (
                      <div
                        key={platform}
                          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                        >
                          <Icon size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                      </div>
                    )
                  })}
                </div>

                  <button
                  onClick={() => handleViewMore(influencer)}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                >
                    View Details
                  </button>
              </div>
            ))}
          </div>
            {totalPages > 1 && (
             <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-cyan-400 text-white disabled:opacity-50 hover:bg-cyan-500 transition"
              >
                Prev
              </button>
              <span className="text-black font-semibold dark:text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-cyan-400 text-white disabled:opacity-50 hover:bg-cyan-500 transition"
              >
                Next
              </button>
            </div>
          )}
          {/* Comparison Modal */}
          <ComparisonModal open={showCompare && compare.length > 1} onClose={() => setShowCompare(false)} influencers={compare} />
          {/* Collaboration Modal */}
          <CollaborationModal open={showCollab} onClose={() => setShowCollab(false)} influencer={collabInfluencer} />
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-y-auto border-gray-700 p-2 md:p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-[#222]'}`}>
          {selectedInfluencer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedInfluencer.avatar}
                    alt={selectedInfluencer.name}
                    className="w-20 h-20 rounded-full border-2 border-indigo-200 dark:border-indigo-700"
                  />
                  <div>
                    <DialogTitle className={`flex items-center gap-2 text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedInfluencer.name}
                      {selectedInfluencer.verified && (
                        <Badge variant="secondary" className={`ml-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-200 text-gray-800 border border-gray-400'}`}>
                          Verified
                        </Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedInfluencer.handle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>About</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{selectedInfluencer.description}</p>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedInfluencer.followers}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Followers</div>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedInfluencer.engagement}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Engagement Rate</div>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedInfluencer.avgViews}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average Views</div>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedInfluencer.growth}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Growth Rate</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInfluencer.categories.map((cat) => (
                        <Badge 
                          key={cat}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Reviews & Ratings</h3>
                    <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                      {(reviews[selectedInfluencer.handle] || []).length === 0 && (<div className="text-gray-500">No reviews yet. Be the first to comment!</div>)}
                      {(reviews[selectedInfluencer.handle] || []).map((r, idx) => (<div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-gray-900 dark:text-gray-100"><span className="font-bold text-cyan-700 dark:text-cyan-300">{r.user}:</span> <StarRating rating={r.rating} /> {r.comment}</div>))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Your name" value={reviewInput.user} onChange={e => setReviewInput({ ...reviewInput, user: e.target.value })} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700" />
                      <select value={reviewInput.rating} onChange={e => setReviewInput({ ...reviewInput, rating: parseInt(e.target.value) })} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700">
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}★</option>)}
                      </select>
                      <input type="text" placeholder="Write a comment..." value={reviewInput.comment} onChange={e => setReviewInput({ ...reviewInput, comment: e.target.value })} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700 flex-1" />
                      <button onClick={() => handleReviewSubmit(selectedInfluencer.handle)} className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded flex items-center gap-1">Post</button>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Collaboration Details</h3>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className={`text-3xl font-bold text-gray-200 mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedInfluencer.collaborationRate}
                      </div>
                      <div className={`text-gray-400 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Response Time: {selectedInfluencer.responseTime}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Campaigns</h3>
                    <div className="space-y-3">
                      {selectedInfluencer.recentCampaigns?.map((campaign, index) => (
                        <div key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                          <span className={`text-gray-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{campaign.name}</span>
                          <div className="flex gap-4">
                            <Badge variant="secondary" className={`bg-green-500/20 text-green-400 ${theme === 'dark' ? 'bg-green-800' : 'bg-green-200'}`}>
                              {campaign.success}
                            </Badge>
                            <span className={`text-gray-400 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{campaign.reach}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Audience Demographics</h3>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} space-y-2`}>
                      <div className="flex justify-between text-gray-300">
                        <span>Age Range:</span>
                        <span>{selectedInfluencer.audienceAge}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Gender:</span>
                        <span>{selectedInfluencer.audienceGender}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Top Locations:</span>
                        <span>{selectedInfluencer.topLocations?.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  className={`border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-100 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowCollab(true);
                    setCollabInfluencer(selectedInfluencer);
                  }}
                >
                  Start Collaboration
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Compare Button */}
      {compare.length > 1 && (
        <button className="fixed bottom-8 right-8 z-50 bg-cyan-500 text-white px-6 py-3 rounded-full shadow-lg" onClick={() => setShowCompare(true)}>Compare ({compare.length})</button>
      )}
    </div>
  );
}

