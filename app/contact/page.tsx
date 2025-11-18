"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/page-container"
import { AnimatedContent } from "@/components/animated-content"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, userType: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
        userType: "",
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageContainer>
        <AnimatedContent>
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contact Us</h1>
              <p className="text-xl text-gray-300 mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </AnimatedContent>

        {/* Contact Form Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        name="name"
                        placeholder="John"
                        className="bg-[#1a1f2e] border-[#2a2e45]"
                        value={formState.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="name"
                        placeholder="Doe"
                        className="bg-[#1a1f2e] border-[#2a2e45]"
                        value={formState.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-[#1a1f2e] border-[#2a2e45]"
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      className="bg-[#1a1f2e] border-[#2a2e45]"
                      value={formState.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      className="min-h-[150px] bg-[#1a1f2e] border-[#2a2e45]"
                      value={formState.message}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <Card className="bg-[#1a1f2e] border-[#2a2e45]">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#9575ff]/10 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-[#9575ff]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Visit Us</h3>
                        <p className="text-gray-300">
                          123 Business Street
                          <br />
                          New York, NY 10001
                          <br />
                          United States
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f2e] border-[#2a2e45]">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#9575ff]/10 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-[#9575ff]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Call Us</h3>
                        <p className="text-gray-300">
                          +1 (555) 123-4567
                          <br />
                          Mon - Fri, 9am - 6pm EST
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f2e] border-[#2a2e45]">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#9575ff]/10 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-[#9575ff]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Email Us</h3>
                        <p className="text-gray-300">
                          support@allthingsads.com
                          <br />
                          sales@allthingsads.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-[#1a1f2e] rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-white">Business Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container">
            <div className="aspect-video bg-[#1a1f2e] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1641234567890!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </PageContainer>
      <Footer />
    </div>
  )
}

