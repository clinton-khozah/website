"use client"

import { Bot, ShoppingCart, BarChart, MessageSquare, Mic, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/page-container"
import { AnimatedContent } from "@/components/animated-content"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Assistant",
    description: "Adsy uses advanced AI to understand your needs and provide personalized recommendations for advertising solutions."
  },
  {
    icon: ShoppingCart,
    title: "Automated Purchasing",
    description: "Let Adsy handle your digital advertising purchases automatically, saving you time and ensuring optimal placement."
  },
  {
    icon: BarChart,
    title: "Performance Reports",
    description: "Get detailed analytics and insights about your advertising campaigns with automated performance reports."
  },
  {
    icon: MessageSquare,
    title: "Smart Suggestions",
    description: "Receive intelligent suggestions based on your business goals, budget, and target audience."
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Communicate with Adsy naturally using voice commands for a hands-free experience."
  },
  {
    icon: Zap,
    title: "Autonomous Actions",
    description: "Adsy can autonomously execute digital tasks, from campaign setup to optimization."
  }
]

export default function MeetAdsyPage() {
  return (
    <main className="min-h-screen vv bg-[#0f1424]">
      <Navbar />
      <PageContainer>
        <AnimatedContent>
          <div className="container py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                  Meet <span className="text-[#9575ff]">Adsy</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Your AI-powered shopping assistant that revolutionizes digital advertising
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-[#1a1e32]/80 backdrop-blur-sm rounded-lg p-6 h-full border border-[#2a2e45] hover:border-[#9575ff] transition-colors">
                    <feature.icon className="h-12 w-12 text-[#9575ff] mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-2xl mx-auto text-center mt-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to get started?
              </h2>
              <p className="text-gray-300 mb-8">
                Click the chat icon in the bottom right corner to start talking with Adsy.
                Experience the future of digital advertising assistance.
              </p>
            </motion.div>
          </div>
        </AnimatedContent>
      </PageContainer>
      <Footer />
    </main>
  )
} 