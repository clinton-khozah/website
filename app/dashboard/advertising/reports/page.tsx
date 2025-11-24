"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  Loader2,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import jsPDF from "jspdf"

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

interface Deposit {
  id: string
  payment_intent_id: string
  amount: number
  currency: string
  status: string
  deposited_at: string
  created_at: string
  description?: string
  type?: 'ad_deposit' | 'storage_purchase'
}

interface StoragePurchase {
  id: string
  payment_intent_id: string
  storage_gb: number
  price_usd: number
  payment_status: string
  purchased_at: string
  created_at: string
  storage_plan_id?: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [storagePurchases, setStoragePurchases] = useState<StoragePurchase[]>([])
  const [depositsLoading, setDepositsLoading] = useState(false)
  const [emailReports, setEmailReports] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/")
          return
        }

        const { data: mentor } = await supabase
          .from("mentors")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (mentor) {
          setMentorData(mentor)
          setUserData({ ...mentor, id: mentor.id })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    const fetchDeposits = async () => {
      if (!userData?.id) return

      try {
        setDepositsLoading(true)
        
        // Fetch ad deposits
        const depositsResponse = await fetch(`${API_BASE_URL}/mentors/ads/deposits/${userData.id}/`)
        const depositsData = await depositsResponse.json()

        if (depositsData.success && depositsData.deposits) {
          const adDeposits = depositsData.deposits.map((deposit: any) => ({
            ...deposit,
            type: 'ad_deposit' as const
          }))
          setDeposits(adDeposits)
        }

        // Fetch storage purchases
        const { data: storageData, error: storageError } = await supabase
          .from('storage_purchases')
          .select('*')
          .eq('mentor_id', userData.id)
          .eq('payment_status', 'succeeded')
          .order('purchased_at', { ascending: false })

        if (!storageError && storageData) {
          setStoragePurchases(storageData)
        }
      } catch (error) {
        console.error("Error fetching deposits:", error)
      } finally {
        setDepositsLoading(false)
      }
    }

    fetchDeposits()
  }, [userData?.id])

  const generateInvoicePDF = async (item: Deposit | StoragePurchase, type: 'ad_deposit' | 'storage_purchase' = 'ad_deposit') => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    // Load and add logo (square/round dimensions)
    try {
      const logoUrl = '/images/logo1.png'
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            // Make it square - use the larger dimension for both width and height
            const size = Math.max(img.width, img.height)
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            if (ctx) {
              // Center the image in the square canvas
              const x = (size - img.width) / 2
              const y = (size - img.height) / 2
              ctx.drawImage(img, x, y, img.width, img.height)
              const imgData = canvas.toDataURL('image/png')
              // Use equal width and height for the logo in PDF (40x40)
              doc.addImage(imgData, 'PNG', margin, yPos, 40, 40)
              yPos += 45
              resolve(null)
            } else {
              reject(new Error('Could not get canvas context'))
            }
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = reject
        img.src = logoUrl
      })
    } catch (error) {
      console.error('Error loading logo:', error)
      yPos += 45
    }

    // Invoice Title and Details (Right aligned)
    const invoiceDate = type === 'ad_deposit' 
      ? new Date((item as Deposit).deposited_at || (item as Deposit).created_at)
      : new Date((item as StoragePurchase).purchased_at || (item as StoragePurchase).created_at)
    const dateIssued = invoiceDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Invoice", pageWidth - margin, margin + 10, { align: "right" })
    
    yPos = margin + 18
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("Date of issue", pageWidth - margin, yPos, { align: "right" })
    yPos += 5
    doc.setTextColor(0, 0, 0)
    doc.text(dateIssued, pageWidth - margin, yPos, { align: "right" })
    yPos += 8

    doc.setTextColor(100, 100, 100)
    doc.text("Date due", pageWidth - margin, yPos, { align: "right" })
    yPos += 5
    doc.setTextColor(0, 0, 0)
    doc.text(dateIssued, pageWidth - margin, yPos, { align: "right" })
    yPos += 8

    // Invoice number (without label)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    const paymentIntentId = type === 'ad_deposit' 
      ? (item as Deposit).payment_intent_id 
      : (item as StoragePurchase).payment_intent_id
    doc.text(paymentIntentId.substring(0, 12).toUpperCase(), pageWidth - margin, yPos, { align: "right" })

    // Company Information (Left side, below logo)
    yPos = margin + 50
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("BrightByt", margin, yPos)

    // Calculate amount
    const amount = type === 'ad_deposit'
      ? parseFloat((item as Deposit).amount.toString())
      : parseFloat((item as StoragePurchase).price_usd.toString())

    yPos = margin + 60

    // Bill To Section
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Bill to", margin, yPos)
    yPos += 7

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(mentorData?.name || "Mentor", margin, yPos)
    yPos += 5
    
    if (mentorData?.country) {
      doc.text(mentorData.country, margin, yPos)
      yPos += 5
    }
    
    if (mentorData?.email) {
      doc.text(mentorData.email, margin, yPos)
    }

    yPos = margin + 85

    // Items Table Header
    doc.setDrawColor(200, 200, 200)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text("Description", margin, yPos)
    doc.text("Qty", margin + 100, yPos)
    doc.text("Unit price", margin + 120, yPos)
    doc.text("Amount", pageWidth - margin, yPos, { align: "right" })
    yPos += 5
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 8

    // Invoice Item
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    if (type === 'ad_deposit') {
      doc.text("Advertising Account Deposit", margin, yPos)
      doc.text("1", margin + 100, yPos)
      doc.text(`$${amount.toFixed(2)}`, margin + 120, yPos)
      doc.text(`$${amount.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" })
      yPos += 5
      
      // Period information
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      const periodStart = invoiceDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const periodEnd = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      doc.text(`${periodStart} – ${periodEnd}`, margin + 2, yPos)
      doc.setTextColor(0, 0, 0)
    } else {
      const storagePurchase = item as StoragePurchase
      doc.text(`Storage Upgrade - ${storagePurchase.storage_gb} GB`, margin, yPos)
      doc.text("1", margin + 100, yPos)
      doc.text(`$${amount.toFixed(2)}`, margin + 120, yPos)
      doc.text(`$${amount.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" })
      yPos += 5
      
      // Storage information
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`${storagePurchase.storage_gb} GB additional storage`, margin + 2, yPos)
      doc.setTextColor(0, 0, 0)
    }

    yPos += 15

    // Totals Section
    const rightAlignX = pageWidth - margin - 50
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Subtotal", rightAlignX, yPos, { align: "right" })
    doc.text(`$${amount.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" })
    yPos += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Total", rightAlignX, yPos, { align: "right" })
    doc.text(`$${amount.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" })
    yPos += 7

    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text("Amount due", rightAlignX, yPos, { align: "right" })
    const currency = type === 'ad_deposit' 
      ? (item as Deposit).currency || 'USD'
      : 'USD'
    doc.text(`$${amount.toFixed(2)} ${currency.toUpperCase()}`, pageWidth - margin, yPos, { align: "right" })

    // Footer - Company Tax Info
    yPos = pageHeight - 30
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text("BrightByt", margin, yPos)

    // Save PDF
    const paymentDate = type === 'ad_deposit'
      ? new Date((item as Deposit).deposited_at || (item as Deposit).created_at)
      : new Date((item as StoragePurchase).purchased_at || (item as StoragePurchase).created_at)
    const fileName = `Invoice_${paymentIntentId.substring(0, 10)}_${paymentDate.toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  if (loading) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="mentor">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Invoices</h1>
          <p className="text-lg text-gray-600">Download and view detailed reports and payment invoices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment History */}
          <div className="lg:col-span-2">
            <Card className="bg-white border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Payment History</CardTitle>
                <CardDescription className="text-gray-600">View and download invoices for your ad account deposits and storage purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {depositsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : deposits.length === 0 && storagePurchases.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-2">No payment history yet</p>
                    <p className="text-gray-500 text-sm">Your payment invoices will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Ad Deposits */}
                    {deposits.map((deposit) => {
                      const depositDate = new Date(deposit.deposited_at || deposit.created_at)
                      return (
                        <div
                          key={`deposit-${deposit.id}`}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Receipt className="h-5 w-5 text-blue-600" />
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    Ad Account Deposit
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {depositDate.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-gray-900">
                                    ${parseFloat(deposit.amount.toString()).toFixed(2)}
                                  </span>
                                </div>
                                <Badge
                                  variant={deposit.status === 'succeeded' ? 'default' : 'secondary'}
                                  className={
                                    deposit.status === 'succeeded'
                                      ? 'bg-green-100 text-green-700 border-green-200'
                                      : ''
                                  }
                                >
                                  {deposit.status === 'succeeded' ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Paid
                                    </>
                                  ) : deposit.status === 'pending' ? (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" />
                                      Pending
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 mr-1" />
                                      {deposit.status}
                                    </>
                                  )}
                                </Badge>
                              </div>
                              {deposit.payment_intent_id && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Payment ID: {deposit.payment_intent_id.substring(0, 20)}...
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => generateInvoicePDF(deposit, 'ad_deposit').catch(console.error)}
                              variant="outline"
                              size="sm"
                              className="ml-4"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                    {/* Storage Purchases */}
                    {storagePurchases.map((purchase) => {
                      const purchaseDate = new Date(purchase.purchased_at || purchase.created_at)
                      return (
                        <div
                          key={`storage-${purchase.id}`}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Receipt className="h-5 w-5 text-purple-600" />
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    Storage Upgrade - {purchase.storage_gb} GB
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {purchaseDate.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-gray-900">
                                    ${parseFloat(purchase.price_usd.toString()).toFixed(2)}
                                  </span>
                                </div>
                                <Badge
                                  variant={purchase.payment_status === 'succeeded' ? 'default' : 'secondary'}
                                  className={
                                    purchase.payment_status === 'succeeded'
                                      ? 'bg-green-100 text-green-700 border-green-200'
                                      : ''
                                  }
                                >
                                  {purchase.payment_status === 'succeeded' ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Paid
                                    </>
                                  ) : purchase.payment_status === 'pending' ? (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" />
                                      Pending
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 mr-1" />
                                      {purchase.payment_status}
                                    </>
                                  )}
                                </Badge>
                              </div>
                              {purchase.payment_intent_id && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Payment ID: {purchase.payment_intent_id.substring(0, 20)}...
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => generateInvoicePDF(purchase, 'storage_purchase').catch(console.error)}
                              variant="outline"
                              size="sm"
                              className="ml-4"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Email Reports Section */}
          <div>
            <Card className="bg-white border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Email Reports</CardTitle>
                <CardDescription className="text-gray-600">Receive reports directly in your inbox</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-reports" className="text-sm font-medium">
                        Get BrightByt to send you reports
                      </Label>
                      <p className="text-xs text-gray-500">
                        Receive monthly reports and invoices via email
                      </p>
                    </div>
                    <Switch
                      id="email-reports"
                      checked={emailReports}
                      onCheckedChange={setEmailReports}
                    />
                  </div>
                  
                  {emailReports && (
                    <div className="pt-4 border-t border-gray-200">
                      <Label className="text-sm font-medium mb-2 block">Select Frequency</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Weekly Reports
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Monthly Reports
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

