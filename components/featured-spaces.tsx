"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Globe, Mail, MessageSquare, Users, LucideIcon } from "lucide-react"
import Link from "next/link"
import { AnimatedCard } from "@/components/animated-card"
import { ParallaxSection } from "@/components/parallax-section"
import { AnimatedContent } from "@/components/animated-content"
import { AnimatedButton } from "@/components/animated-button"
import { motion } from "framer-motion"
import { Filter } from "@/components/ui/filter"
import { useState } from "react"

interface FeaturedSpace {
  id: number
  title: string
  description: string
  type: string
  icon: LucideIcon
  metrics: {
    [key: string]: string
  }
  price: string
  priceModel: string
  category: string
  tags: string[]
}

// Sample data for featured ad spaces
const featuredSpaces: FeaturedSpace[] = [
  {
    id: 1,
    title: "Tech Blog Premium Banner",
    description: "Top banner position on a tech blog with 500K monthly visitors",
    type: "Website",
    icon: Globe,
    metrics: {
      visitors: "500K",
      impressions: "2.5M",
      ctr: "3.2%",
    },
    price: "$1,200",
    priceModel: "per month",
    category: "Technology",
    tags: ["Banner", "Tech", "Premium"],
  },
  {
    id: 2,
    title: "Weekly Finance Newsletter",
    description: "Sponsored section in a finance newsletter with 50K subscribers",
    type: "Newsletter",
    icon: Mail,
    metrics: {
      subscribers: "50K",
      openRate: "32%",
      clickRate: "8.5%",
    },
    price: "$800",
    priceModel: "per issue",
    category: "Finance",
    tags: ["Newsletter", "Finance", "Weekly"],
  },
  {
    id: 3,
    title: "Fitness App In-App Ads",
    description: "Native in-app advertisements in a fitness app with 200K active users",
    type: "Mobile App",
    icon: MessageSquare,
    metrics: {
      users: "200K",
      sessions: "1.2M",
      engagement: "4.5 min",
    },
    price: "$1,500",
    priceModel: "per week",
    category: "Health & Fitness",
    tags: ["Mobile", "In-App", "Fitness"],
  },
  {
    id: 4,
    title: "Travel Influencer Promotion",
    description: "Sponsored content from a travel influencer with 350K followers",
    type: "Social Media",
    icon: Users,
    metrics: {
      followers: "350K",
      engagement: "4.8%",
      reach: "120K",
    },
    price: "$2,000",
    priceModel: "per post",
    category: "Travel",
    tags: ["Influencer", "Social Media", "Travel"],
  },
]

// Extract unique categories
const categories = Array.from(new Set(featuredSpaces.map(space => space.category)))

export function FeaturedSpaces() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter spaces based on selected category
  const filteredSpaces = selectedCategory
    ? featuredSpaces.filter(space => space.category === selectedCategory)
    : featuredSpaces

  return (
    <section className="section-padding relative py-20">
      {/* Background gradient to match the theme */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#32147f] via-[#140047] to-[#140047] z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10">
        <ParallaxSection direction="up" speed={0.1} className="mb-16">
          <div className="text-center">
            <AnimatedContent>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Featured Ad Spaces</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover premium advertising opportunities across various platforms
              </p>
            </AnimatedContent>
          </div>
        </ParallaxSection>

        <div className="container-narrow">
          <Filter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            className="justify-center"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSpaces.map((space, index) => (
              <AnimatedContent key={space.id} delay={index * 0.1}>
                <AnimatedCard intensity={10}>
                  <Card className="overflow-hidden h-full border border-[#2a2e45] bg-[#1a1e32]/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="bg-[#9575ff]/20 p-2 rounded-lg">
                          {space.icon && <space.icon className="h-5 w-5 text-[#9575ff]" />}
                        </div>
                        <Badge variant="outline" className="border-[#2a2e45] text-gray-300">{space.type}</Badge>
                      </div>
                      <CardTitle className="mt-4 text-xl text-white">{space.title}</CardTitle>
                      <CardDescription className="line-clamp-2 h-10 text-gray-400">{space.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        {Object.entries(space.metrics).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-gray-400 capitalize">{key}</span>
                            <span className="font-medium text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {space.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-[#2a2e45] text-gray-300 hover:bg-[#353a58]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t border-[#2a2e45] pt-4 mt-auto">
                      <div>
                        <p className="text-sm font-medium text-white">{space.price}</p>
                        <p className="text-xs text-gray-400">{space.priceModel}</p>
                      </div>
                      <Link href={`/ad-spaces/${space.id}`}>
                        <AnimatedButton
                          size="sm"
                          className="gap-1 text-[#9575ff] hover:text-white hover:bg-[#9575ff]/20"
                          variant="ghost"
                          hoverScale={1.05}
                          shimmer={true}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </AnimatedButton>
                      </Link>
                    </CardFooter>
                  </Card>
                </AnimatedCard>
              </AnimatedContent>
            ))}
          </div>

          <div className="text-center mt-12">
            <AnimatedContent delay={0.4}>
              <Link href="/ad-spaces">
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  className="relative overflow-hidden bg-transparent border-[#9575ff] text-[#9575ff] hover:text-white hover:bg-[#9575ff]/20"
                  hoverScale={1.03}
                  shimmer={true}
                >
                  <span className="relative z-10">View All Ad Spaces</span>
                </AnimatedButton>
              </Link>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  )
}

