"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, AlertCircle, CheckCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

interface TutorApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userName: string
}

export function TutorApplicationModal({ 
  isOpen, 
  onClose, 
  userEmail,
  userName 
}: TutorApplicationModalProps) {
  const [applicationType, setApplicationType] = React.useState<"tutor" | "mentor">("tutor")
  const [motivation, setMotivation] = React.useState("")
  const [qualifications, setQualifications] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!motivation.trim()) {
      setError("Please provide your motivation for becoming a tutor/mentor")
      return
    }

    setIsSubmitting(true)

    try {
      // Call API to send application email with Amplitude test link
      const response = await fetch('http://127.0.0.1:8000/api/v1/mentors/send-application-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          application_type: applicationType,
          motivation: motivation.trim(),
          qualifications: qualifications.trim()
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSuccess(true)
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setMotivation("")
        setQualifications("")
        setApplicationType("tutor")
      }, 3000)
    } catch (error: any) {
      console.error('Error submitting application:', error)
      setError(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Apply as Tutor/Mentor</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
                <p className="text-gray-700 text-lg mb-2 font-semibold">
                  Application Submitted Successfully!
                </p>
                <p className="text-gray-600 text-sm">
                  We've sent an email to <strong>{userEmail}</strong> with a link to complete the Amplitude test.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Please check your inbox and complete the test to proceed with your application.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-3 block">
                    I am applying as:
                  </Label>
                  <RadioGroup
                    value={applicationType}
                    onValueChange={(value) => setApplicationType(value as "tutor" | "mentor")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tutor" id="tutor" />
                      <Label htmlFor="tutor" className="font-normal cursor-pointer">
                        Tutor
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentor" id="mentor" />
                      <Label htmlFor="mentor" className="font-normal cursor-pointer">
                        Mentor
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="motivation" className="text-base font-semibold text-gray-900 mb-2 block">
                    Why do you want to become a {applicationType}? *
                  </Label>
                  <Textarea
                    id="motivation"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Tell us about your motivation, experience, and what makes you a great tutor/mentor..."
                    className="min-h-[120px] resize-none"
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This information will help us understand your background and goals.
                  </p>
                </div>

                <div>
                  <Label htmlFor="qualifications" className="text-base font-semibold text-gray-900 mb-2 block">
                    Qualifications & Certifications
                  </Label>
                  <Textarea
                    id="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="List your educational qualifications, certifications, degrees, or relevant training..."
                    className="min-h-[120px] resize-none"
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include degrees, certifications, professional training, or any relevant qualifications.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> After submitting your application, you'll receive an email with a link to complete the Amplitude test. This test helps us assess your knowledge and skills.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !motivation.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

