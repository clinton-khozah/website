"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, TrendingUp, Plus, Wallet, BarChart3, ArrowRight, CheckCircle2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { StripePaymentForm } from "@/components/payment/stripe-payment-form"
import { supabase } from "@/lib/supabase"

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

interface AdAccount {
  id: string
  balance: number
  lifetime_spent: number
  status: string
  cost_per_click: number
  is_global: boolean
  is_social_media: boolean
}

export default function AdvertisingPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [account, setAccount] = useState<AdAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [depositId, setDepositId] = useState<string | null>(null)
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/")
          return
        }

        const { data: mentorData } = await supabase
          .from("mentors")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (mentorData) {
          setUserData({ ...mentorData, id: mentorData.id })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [router])

  // Load Stripe key from API
  useEffect(() => {
    const loadStripeKey = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/ai/payment/config/")
        const data = await response.json()
        if (data.success && data.publishable_key) {
          setStripePromise(loadStripe(data.publishable_key))
        } else {
          console.error("Failed to load Stripe key:", data)
        }
      } catch (error) {
        console.error("Error loading Stripe:", error)
      }
    }
    loadStripeKey()
  }, [])

  useEffect(() => {
    const fetchAccount = async () => {
      if (!userData?.id) return

      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/mentors/ads/account/${userData.id}/`)
        const data = await response.json()

        if (data.success && data.account) {
          setAccount(data.account)
        }
      } catch (error) {
        console.error("Error fetching account:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [userData])

  const handleAddFunds = async () => {
    if (!userData || !depositAmount) return

    const amount = parseFloat(depositAmount)
    if (amount < 5) {
      alert("Minimum deposit amount is $5.00")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/mentors/ads/deposit/create-payment-intent/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentor_id: userData.id,
          amount: amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setPaymentIntent({
          clientSecret: data.client_secret,
          paymentIntentId: data.payment_intent_id,
        })
        setDepositId(data.deposit_id)
        setShowAddFunds(false)
      } else {
        throw new Error(data.error || "Failed to create payment intent")
      }
    } catch (error: any) {
      console.error("Error creating payment intent:", error)
      alert(error.message || "Failed to create payment intent. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/mentors/ads/deposit/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          deposit_id: depositId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh account balance
        const accountResponse = await fetch(`${API_BASE_URL}/mentors/ads/account/${userData.id}/`)
        const accountData = await accountResponse.json()
        if (accountData.success) {
          setAccount(accountData.account)
        }
        
        setPaymentIntent(null)
        setDepositId(null)
        setDepositAmount("")
        setSuccessMessage(`Successfully added $${data.deposit_amount} to your ad account!`)
        setShowSuccessModal(true)
      } else {
        alert(data.error || "Failed to confirm payment")
      }
    } catch (error) {
      console.error("Error confirming payment:", error)
      alert("Failed to confirm payment. Please contact support.")
    }
  }

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`)
    setPaymentIntent(null)
  }

  if (loading && !account) {
    return (
      <DashboardLayout userData={userData} role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (paymentIntent) {
    if (!stripePromise) {
      return (
        <DashboardLayout userData={userData} role="mentor">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading payment form...</p>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      )
    }

    return (
      <DashboardLayout userData={userData} role="mentor">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Ad Account</CardTitle>
              <CardDescription>
                Deposit ${depositAmount} to your advertising account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.clientSecret }}>
                <StripePaymentForm
                  amount={parseFloat(depositAmount)}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onBack={() => {
                    setPaymentIntent(null)
                    setDepositId(null)
                  }}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userData={userData} role="mentor">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advertising Account</h1>
          <p className="text-gray-600">
            Add funds to your account and pay per click for advertising
          </p>
        </div>

        {/* Account Balance Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${account?.balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <Wallet className="w-12 h-12 text-blue-600" />
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => setShowAddFunds(!showAddFunds)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lifetime Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${account?.lifetime_spent?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cost Per Click</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${account?.cost_per_click?.toFixed(2) || "0.50"}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Funds Form */}
        {showAddFunds && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add Funds to Account</CardTitle>
                <CardDescription>
                  Minimum deposit: $5.00. Funds will be available immediately after payment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="5"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount (minimum $5.00)"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddFunds}
                      disabled={loading || !depositAmount || parseFloat(depositAmount) < 5}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Continue to Payment
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddFunds(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* How It Works */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Add Funds</h3>
                <p className="text-sm text-gray-600">
                  Deposit money into your advertising account. Minimum deposit is $5.00.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Pay Per Click</h3>
                <p className="text-sm text-gray-600">
                  Only pay when students click on your ad. Track every click and optimize your campaigns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
            >
              {/* Success Icon */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  Payment Successful!
                </motion.h3>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-700 mb-6"
                >
                  {successMessage}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 justify-center"
                >
                  <Button
                    onClick={() => {
                      setShowSuccessModal(false)
                    }}
                    className="px-6"
                  >
                    Got it, Thanks!
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
