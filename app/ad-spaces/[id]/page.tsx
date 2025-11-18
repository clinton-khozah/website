import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BarChart2,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Eye,
  Globe,
  Heart,
  Mail,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  Zap,
  Rocket,
  Cpu,
  Binary,
  CircuitBoard,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AdSpaceListPage() {
  const adSpaces = [
    {
      id: 1,
      owner: {
        name: "Alex Johnson",
        verified: true,
      },
      title: "Pro Gamer YouTube Channel",
      description: "Top gaming channel with 2M+ subscribers. Perfect for game launches, eSports, and hardware sponsorships.",
      type: "Video",
      category: "Gaming",
      tags: ["eSports", "PC Gaming", "Live Streams"],
      price: "$7000",
      priceModel: "per video",
      metrics: {
        subscribers: "2M",
        avgViews: "300K",
        engagementRate: "5.2%",
        avgWatchTime: "15:00",
      }
    },
    {
      id: 2,
      owner: {
        name: "Samantha Lee",
        verified: false,
      },
      title: "Finance Weekly Newsletter",
      description: "Trusted finance newsletter with 100K+ subscribers. Ideal for fintech, investment, and banking ads.",
      type: "Newsletter",
      category: "Finance",
      tags: ["Investing", "Fintech", "Banking"],
      price: "$2500",
      priceModel: "per issue",
      metrics: {
        subscribers: "100K",
        openRate: "38%",
        clickRate: "12%",
        avgCPC: "$1.30",
      }
    },
    {
      id: 3,
      owner: {
        name: "Michael Carter",
        verified: true,
      },
      title: "Business Leaders Podcast",
      description: "Podcast for entrepreneurs and executives. Reach a high-value B2B audience with your message.",
      type: "Podcast",
      category: "Business",
      tags: ["Entrepreneurship", "Leadership", "B2B"],
      price: "$3500",
      priceModel: "per episode",
      metrics: {
        listeners: "50K",
        avgDownloads: "40K",
        completionRate: "88%",
        adReadRate: "77%",
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-6xl px-4">
          {/* Search Bar */}
          <div className="mb-8 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ad spaces..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ad Spaces Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {adSpaces.map((adSpace) => (
              <Card key={adSpace.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{adSpace.owner.name}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">Posted an ad</p>
                        {adSpace.owner.verified && (
                          <Badge variant="outline" className="text-xs gap-1 px-1.5 py-0.5">
                            <Check className="h-3 w-3" /> Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{adSpace.title}</CardTitle>
                  <CardDescription className="mt-1">{adSpace.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize">
                      {adSpace.type}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {adSpace.category}
                    </Badge>
                    {adSpace.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">{adSpace.price}</p>
                      <p className="text-sm text-muted-foreground">{adSpace.priceModel}</p>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-2">
                    {Object.entries(adSpace.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}