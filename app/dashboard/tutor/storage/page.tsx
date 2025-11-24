"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Loader2, 
  HardDrive,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  PieChart as PieChartIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { StripePaymentForm } from "@/components/payment/stripe-payment-form"

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

interface StorageInfo {
  free_storage_mb: number
  purchased_storage_gb: number
  used_storage_mb: number
  total_storage_mb: number
  available_storage_mb: number
  usage_percentage: number
}

interface StoragePlan {
  id: string
  name: string
  storage_gb: number
  price_usd: number
  price_per_gb: number
  description: string | null
}

interface StoragePurchase {
  id: string
  storage_gb: number
  price_usd: number
  payment_status: string
  purchased_at: string
}

export default function StoragePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [storagePlans, setStoragePlans] = useState<StoragePlan[]>([])
  const [purchases, setPurchases] = useState<StoragePurchase[]>([])
  const [loadingStorage, setLoadingStorage] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<StoragePlan | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (mentorError || !mentor) {
          console.error('Mentor data not found:', mentorError)
          router.push('/dashboard')
          return
        }
        setUserData(user)
        setMentorData(mentor)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    if (mentorData?.id) {
      fetchStorageInfo()
      fetchStoragePlans()
      fetchPurchases()
    }
  }, [mentorData?.id])

  // Load Stripe key from API (same as booking modal)
  useEffect(() => {
    const loadStripeKey = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ai/payment/config/`)
        const data = await response.json()
        if (data.success && data.publishable_key) {
          setStripePromise(loadStripe(data.publishable_key))
        }
      } catch (error) {
        console.error("Error loading Stripe:", error)
      }
    }
    if (showPaymentModal) {
      loadStripeKey()
    }
  }, [showPaymentModal])

  const fetchStorageInfo = async () => {
    if (!mentorData?.id) return

    try {
      setLoadingStorage(true)
      const { data, error } = await supabase
        .from('mentor_storage')
        .select('*')
        .eq('mentor_id', mentorData.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        const available = data.total_storage_mb - data.used_storage_mb
        const usagePercentage = data.total_storage_mb > 0 
          ? (data.used_storage_mb / data.total_storage_mb) * 100 
          : 0

        setStorageInfo({
          free_storage_mb: data.free_storage_mb,
          purchased_storage_gb: data.purchased_storage_gb,
          used_storage_mb: data.used_storage_mb,
          total_storage_mb: data.total_storage_mb,
          available_storage_mb: available,
          usage_percentage: usagePercentage
        })
      } else {
        // Create default storage record
        const { data: newData, error: createError } = await supabase
          .from('mentor_storage')
          .insert({
            mentor_id: mentorData.id,
            free_storage_mb: 50.00,
            purchased_storage_gb: 0.00,
            used_storage_mb: 0.00
          })
          .select()
          .single()

        if (createError) throw createError

        setStorageInfo({
          free_storage_mb: 50.00,
          purchased_storage_gb: 0.00,
          used_storage_mb: 0.00,
          total_storage_mb: 50.00,
          available_storage_mb: 50.00,
          usage_percentage: 0
        })
      }
    } catch (error: any) {
      console.error('Error fetching storage info:', error)
      toast.error('Failed to load storage information')
    } finally {
      setLoadingStorage(false)
    }
  }

  const fetchStoragePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_plans')
        .select('*')
        .eq('is_active', true)
        .order('storage_gb', { ascending: true })

      if (error) throw error
      setStoragePlans(data || [])
    } catch (error: any) {
      console.error('Error fetching storage plans:', error)
      toast.error('Failed to load storage plans')
    }
  }

  const fetchPurchases = async () => {
    if (!mentorData?.id) return

    try {
      const { data, error } = await supabase
        .from('storage_purchases')
        .select('*')
        .eq('mentor_id', mentorData.id)
        .eq('payment_status', 'succeeded')
        .order('purchased_at', { ascending: false })

      if (error) throw error
      setPurchases(data || [])
    } catch (error: any) {
      console.error('Error fetching purchases:', error)
    }
  }

  const calculateStorage = async () => {
    if (!mentorData?.id) return

    setCalculating(true)
    try {
      // Calculate storage from all sources
      let totalUsed = 0

      // Study materials
      const { data: studyMaterials, error: studyError } = await supabase
        .from('study_materials')
        .select('file_size')
        .eq('mentor_id', mentorData.id)

      if (studyError) throw studyError
      const studyMaterialsSize = (studyMaterials || []).reduce((sum, m) => sum + (m.file_size || 0), 0) / (1024 * 1024) // Convert to MB

      // Assessments
      const { data: assessments, error: assessmentError } = await supabase
        .from('assessments')
        .select('document_size')
        .eq('mentor_id', mentorData.id)

      if (assessmentError) throw assessmentError
      const assessmentsSize = (assessments || []).reduce((sum, a) => sum + (a.document_size || 0), 0) / (1024 * 1024) // Convert to MB

      // Task submissions (if any files)
      const { data: tasks, error: taskError } = await supabase
        .from('tasks')
        .select('submission_file_url')
        .eq('mentor_id', mentorData.id)
        .not('submission_file_url', 'is', null)

      // Note: For task files, we'd need to fetch from storage or track size in DB
      // For now, we'll estimate or skip

      totalUsed = studyMaterialsSize + assessmentsSize

      // Update storage record
      const { data: storageData, error: updateError } = await supabase
        .from('mentor_storage')
        .update({
          used_storage_mb: totalUsed,
          last_calculated_at: new Date().toISOString()
        })
        .eq('mentor_id', mentorData.id)
        .select()
        .single()

      if (updateError) throw updateError

      const available = storageData.total_storage_mb - totalUsed
      const usagePercentage = storageData.total_storage_mb > 0 
        ? (totalUsed / storageData.total_storage_mb) * 100 
        : 0

      setStorageInfo({
        free_storage_mb: storageData.free_storage_mb,
        purchased_storage_gb: storageData.purchased_storage_gb,
        used_storage_mb: totalUsed,
        total_storage_mb: storageData.total_storage_mb,
        available_storage_mb: available,
        usage_percentage: usagePercentage
      })

      toast.success('Storage calculation completed!')
    } catch (error: any) {
      console.error('Error calculating storage:', error)
      toast.error('Failed to calculate storage')
    } finally {
      setCalculating(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!mentorData?.id) return

    try {
      const response = await fetch(`${API_BASE_URL}/mentors/storage/confirm-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          mentor_id: mentorData.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message || `Successfully added ${selectedPlan?.storage_gb || 0} GB to your storage!`)
        setClientSecret("")
        setShowPaymentModal(false)
        setSelectedPlan(null)
        fetchStorageInfo()
        fetchPurchases()
        setShowSuccessModal(true)
      } else {
        toast.error(data.message || 'Failed to confirm payment')
      }
    } catch (error: any) {
      console.error('Error confirming payment:', error)
      toast.error('Failed to confirm payment')
    }
  }

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`)
    setClientSecret("")
    setShowPaymentModal(false)
  }

  const handleUpgrade = async (plan: StoragePlan) => {
    if (!mentorData?.id) {
      toast.error('Mentor data not found')
      return
    }

    console.log('Starting upgrade process for plan:', plan)
    
    // Open modal immediately
    setSelectedPlan(plan)
    setShowPaymentModal(true)
    setProcessingPayment(true)

    try {
      console.log('Creating payment intent...', {
        mentor_id: mentorData.id,
        storage_plan_id: plan.id,
        storage_gb: plan.storage_gb,
        amount: plan.price_usd
      })

      // Create payment intent
      const response = await fetch(`${API_BASE_URL}/mentors/storage/create-payment-intent/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentor_id: mentorData.id,
          storage_plan_id: plan.id,
          storage_gb: plan.storage_gb,
          amount: plan.price_usd
        })
      })

      console.log('Response status:', response.status, response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        let errorMessage = 'Failed to create payment intent'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          errorMessage = errorText || `Server returned ${response.status}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Payment intent data:', data)

      if (!data.success || !data.client_secret) {
        console.error('Invalid payment intent response:', data)
        throw new Error(data.message || 'Failed to create payment intent')
      }

      console.log('Setting client secret...')
      setClientSecret(data.client_secret)
      setProcessingPayment(false)
    } catch (error: any) {
      console.error('Error processing payment:', error)
      setProcessingPayment(false)
      
      const errorMessage = error.message || 'Unknown error occurred'
      
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('ERR_CONNECTION_REFUSED') ||
          error.message?.includes('NetworkError') ||
          error.name === 'TypeError') {
        toast.error('Cannot connect to backend server. Please ensure the Django backend is running on http://127.0.0.1:8000', {
          duration: 5000
        })
        setShowPaymentModal(false)
        setClientSecret("")
      } else {
        toast.error(errorMessage || 'Failed to process payment')
        setShowPaymentModal(false)
        setClientSecret("")
      }
    }
  }

  // Reset state when modal closes (same as booking modal)
  useEffect(() => {
    if (!showPaymentModal) {
      setClientSecret("")
      setSelectedPlan(null)
      setProcessingPayment(false)
    }
  }, [showPaymentModal])

  // Prepare chart data
  const chartData = storageInfo ? [
    {
      name: 'Used',
      value: storageInfo.used_storage_mb,
      color: storageInfo.usage_percentage > 90 ? '#ef4444' : storageInfo.usage_percentage > 70 ? '#f59e0b' : '#3b82f6'
    },
    {
      name: 'Available',
      value: Math.max(0, storageInfo.available_storage_mb),
      color: '#e5e7eb'
    }
  ] : []

  if (loading || loadingStorage) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (!mentorData) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Mentor data not found</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="mentor">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Storage Management</h1>
          <p className="text-lg text-gray-600">Monitor and manage your storage usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Storage Usage Card */}
            <Card className="bg-white border rounded-xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Storage Usage</CardTitle>
                    <CardDescription className="text-gray-600">Your current storage consumption</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={calculateStorage}
                    disabled={calculating}
                    className="gap-2"
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        Recalculate
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {storageInfo ? (
                  <div className="space-y-6">
                    {/* Pie Chart */}
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => `${value.toFixed(2)} MB`}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Storage Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Total Storage</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {(storageInfo.total_storage_mb / 1024).toFixed(2)} GB
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {storageInfo.free_storage_mb} MB free + {(storageInfo.purchased_storage_gb).toFixed(2)} GB purchased
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Available</p>
                        <p className="text-2xl font-bold text-green-700">
                          {(storageInfo.available_storage_mb / 1024).toFixed(2)} GB
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {storageInfo.available_storage_mb.toFixed(2)} MB remaining
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Used</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {(storageInfo.used_storage_mb / 1024).toFixed(2)} GB
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {storageInfo.used_storage_mb.toFixed(2)} MB consumed
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Usage</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {storageInfo.usage_percentage.toFixed(1)}%
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              storageInfo.usage_percentage > 90
                                ? 'bg-red-500'
                                : storageInfo.usage_percentage > 70
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(100, storageInfo.usage_percentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Warning if storage is low */}
                    {storageInfo.usage_percentage > 90 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900">Storage Almost Full</p>
                          <p className="text-sm text-red-700 mt-1">
                            You're using {storageInfo.usage_percentage.toFixed(1)}% of your storage. Consider upgrading to avoid running out of space.
                          </p>
                        </div>
                      </div>
                    )}

                    {storageInfo.usage_percentage > 70 && storageInfo.usage_percentage <= 90 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900">Storage Getting Full</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            You're using {storageInfo.usage_percentage.toFixed(1)}% of your storage. Consider upgrading soon.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HardDrive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No storage information available</p>
                    <Button onClick={calculateStorage} className="mt-4" disabled={calculating}>
                      {calculating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Calculate Storage
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase History */}
            {purchases.length > 0 && (
              <Card className="bg-white border rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Purchase History</CardTitle>
                  <CardDescription className="text-gray-600">Your storage upgrade purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">+{purchase.storage_gb} GB Storage</p>
                          <p className="text-sm text-gray-600">
                            Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${purchase.price_usd.toFixed(2)}</p>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upgrade Plans */}
          <div>
            <Card className="bg-white border rounded-xl shadow-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-gray-900">Upgrade Storage</CardTitle>
                <CardDescription className="text-gray-600">Get more space for your files</CardDescription>
              </CardHeader>
              <CardContent>
                {storagePlans.length === 0 ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading storage plans...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {storagePlans.map((plan) => (
                      <motion.div
                        key={plan.id || `plan-${plan.storage_gb}`}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all cursor-pointer"
                        onClick={() => handleUpgrade(plan)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{plan.name || 'Storage Plan'}</h3>
                            <p className="text-sm text-gray-600 mt-1">{plan.description || `${plan.storage_gb || 0} GB additional storage`}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">${(plan.price_usd || 0).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">${(plan.price_per_gb || 0).toFixed(2)}/GB</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <HardDrive className="h-4 w-4" />
                            <span>+{plan.storage_gb || 0} GB storage</span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          disabled={processingPayment && selectedPlan?.id === plan.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpgrade(plan)
                          }}
                        >
                          {processingPayment && selectedPlan?.id === plan.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowUp className="h-4 w-4 mr-2" />
                              Upgrade Now
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={(open) => {
          setShowPaymentModal(open)
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upgrade Storage</DialogTitle>
              <DialogDescription>
                {selectedPlan ? (
                  `Purchase ${selectedPlan.storage_gb} GB additional storage for $${selectedPlan.price_usd.toFixed(2)}`
                ) : (
                  'Complete your storage upgrade'
                )}
              </DialogDescription>
            </DialogHeader>
            {stripePromise && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  amount={selectedPlan?.price_usd || 0}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error("Payment error:", error)
                    handlePaymentError(error)
                  }}
                  onBack={() => {
                    setClientSecret("")
                    setShowPaymentModal(false)
                    setSelectedPlan(null)
                  }}
                />
              </Elements>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600"
                  >
                    {successMessage}
                  </motion.p>
                </div>

                {/* Action Button */}
                <div className="p-6 bg-white">
                  <Button
                    onClick={() => {
                      setShowSuccessModal(false)
                    }}
                    className="w-full"
                  >
                    Got it, Thanks!
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

