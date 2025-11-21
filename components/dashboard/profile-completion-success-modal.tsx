"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileCompletionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export function ProfileCompletionSuccessModal({ 
  isOpen, 
  onClose, 
  onContinue 
}: ProfileCompletionSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Profile Completed!</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>
              
              <p className="text-gray-700 text-lg mb-2">
                Your profile has been successfully completed!
              </p>
              <p className="text-gray-600 text-sm">
                You're one step closer to becoming a verified tutor/mentor.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={onContinue}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to Application
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

