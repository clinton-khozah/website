"use client"

import * as React from "react"
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { CreditCard, Lock } from "lucide-react"

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  amount: number
  onBack: () => void
}

export function StripePaymentForm({
  onSuccess,
  onError,
  amount,
  onBack,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [message, setMessage] = React.useState<string>("")

  // Hide Stripe test mode developer panel
  React.useEffect(() => {
    const hideStripeTestPanel = () => {
      const selectors = [
        '[aria-label*="Developers"]',
        '[class*="Popover"]',
        '[class*="TestMode"]',
        'div[style*="z-index: 1000000"]',
        'div[style*="position: fixed"][style*="right"]',
      ]

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.display = "none"
          }
        })
      })
    }

    hideStripeTestPanel()
    const interval = setInterval(hideStripeTestPanel, 500)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage("")

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/dashboard/learner",
        },
        redirect: "if_required",
      })

      if (error) {
        setMessage(error.message || "An error occurred")
        onError(error.message || "Payment failed")
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id)
      } else {
        setMessage("Payment processing...")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setMessage(errorMessage)
      onError(errorMessage)
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Total Amount
            </span>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <style>{`
          /* Hide Stripe test mode developer panel */
          div[class*="Popover"],
          div[aria-label*="Developers"],
          div[data-testid*="test"],
          [class*="TestMode"] {
            display: none !important;
          }
        `}</style>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <span>Secured by Stripe</span>
      </div>

      {/* Error Message */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{message}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500">
        Your payment information is encrypted and secure. We never store your
        card details.
      </p>
    </form>
  )
}

