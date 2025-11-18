import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#32147f]/20 to-transparent" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-yellow-400">Ready to Get Started?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Join our platform today and start connecting with advertisers or finding the perfect ad space for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#9575ff] text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-[#8a63ff] transition-colors"
            >
              List Your Space
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#9575ff] px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              Find Ad Spaces
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 