"use client";

import React from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageSquare, Share2, Instagram, Youtube, Facebook, Twitter, Star } from "lucide-react";

const platformIcons = {
  Instagram,
  YouTube: Youtube,
  Facebook,
  TikTok: Star,
  Twitter
};

const platformColors = {
  Instagram: '#E4405F',
  YouTube: '#FF0000',
  Facebook: '#1877F2',
  TikTok: '#000000',
  Twitter: '#1DA1F2'
};

type Post = {
  title: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  image: string;
  platform: string;
};

export const AnimatedPosts = ({
  posts,
  autoplay = false,
  className,
}: {
  posts: Post[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12", className)}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.image}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 999
                      : posts.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white truncate max-w-[80%]">
                  {posts[active].title}
                </h3>
                <div className="relative">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: platformColors[posts[active].platform as keyof typeof platformColors] }}
                  >
                    {React.createElement(
                      platformIcons[posts[active].platform as keyof typeof platformIcons],
                      { className: "h-4 w-4 text-white" }
                    )}
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full blur-md opacity-50"
                    style={{ backgroundColor: platformColors[posts[active].platform as keyof typeof platformColors] }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-gray-400">{posts[active].date}</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span className="text-gray-300">{posts[active].likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-300">{posts[active].comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">{posts[active].shares.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-gray-800/50 flex items-center justify-center group/button"
            >
              <ArrowLeft className="h-5 w-5 text-white group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-gray-800/50 flex items-center justify-center group/button"
            >
              <ArrowRight className="h-5 w-5 text-white group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 