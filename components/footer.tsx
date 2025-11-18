"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Twitter, Sparkles, ArrowRight } from "lucide-react"
import { AnimatedContent } from "@/components/animated-content"
import { AnimatedInput } from "@/components/animated-input"
import { AnimatedButton } from "@/components/animated-button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function Footer() {

  return (
    <footer className="bg-blue-200 border-t border-blue-400 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo1.png"
                alt="Brightbyt Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-['Verdana',sans-serif]">
                Brightbyt
              </div>
            </div>
            <p className="text-sm text-gray-600 font-['Verdana',sans-serif] leading-relaxed font-medium">
              Connecting students with expert tutors and mentors worldwide. Your journey to academic excellence starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-lg font-['Verdana',sans-serif] border-b border-blue-300 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ad-spaces" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/company" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Who are we
                </Link>
              </li>
              <li>
                <Link href="/affiliates" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Live Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-lg font-['Verdana',sans-serif] border-b border-blue-300 pb-2">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-lg font-['Verdana',sans-serif] border-b border-blue-300 pb-2">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-700 hover:text-blue-700 transition-colors font-['Verdana',sans-serif] font-medium hover:underline inline-block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-blue-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-700 font-['Verdana',sans-serif] font-medium">
              © {new Date().getFullYear()} Brightbyt. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.601-1-1.601-1 0-1.16.781-1.16 1.601v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

