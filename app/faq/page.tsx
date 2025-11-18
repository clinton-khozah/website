import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Find answers to common questions about our platform
                </p>
              </div>
              <div className="w-full max-w-md flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input type="text" placeholder="Search for answers..." className="pl-10" />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="general" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-4 w-full max-w-xl">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="advertisers">For Advertisers</TabsTrigger>
                  <TabsTrigger value="buyers">For Ad Buyers</TabsTrigger>
                  <TabsTrigger value="affiliates">For Affiliates</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What is All Things Ads?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      All Things Ads is a marketplace that connects advertisers (who own marketing spaces/platforms)
                      with businesses looking to advertise their products and services. We also provide opportunities
                      for affiliate marketers to earn commissions by promoting ad spaces.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How does the platform work?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Advertisers list their marketing spaces (websites, newsletters, social media accounts, etc.) on
                      our platform. Ad buyers browse these spaces and book the ones that match their target audience. We
                      handle the payment processing, communication, and provide tools for both parties to track
                      performance.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Is there a fee to join?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Creating an account is free. We offer different subscription plans for advertisers and ad buyers
                      with varying features. We also charge a small platform fee on transactions, which varies based on
                      your subscription plan.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How secure is the platform?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We take security seriously. All transactions are processed through our secure payment system, and
                      we use industry-standard encryption to protect your data. We also have fraud detection systems in
                      place to ensure a safe marketplace for all users.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What payment methods do you accept?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We accept all major credit cards, PayPal, and bank transfers for larger transactions. For payouts
                      to advertisers and affiliates, we support bank transfers, PayPal, and in some regions,
                      cryptocurrency payments.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advertisers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How do I list my ad space?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      After creating an advertiser account, go to your dashboard and click "Add New Ad Space." You'll
                      need to provide details about your platform, audience demographics, pricing, and upload any
                      relevant media. Once submitted, our team will review your listing before it goes live.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How do I set pricing for my ad space?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      You have full control over your pricing. We provide market insights and recommendations based on
                      similar ad spaces, but the final price is up to you. You can set different pricing models (CPM,
                      CPC, flat rate) and offer discounts for longer commitments.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>When and how do I get paid?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Payments are held in escrow until the ad campaign is completed successfully. Once the campaign
                      ends and the ad buyer confirms satisfaction, funds are released to your account within 3-5
                      business days. You can withdraw your earnings once you reach the minimum payout threshold ($50).
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Can I reject ad requests?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, you have the right to review and approve all ad requests before accepting them. You can
                      reject requests that don't align with your platform's content or audience. However, maintaining a
                      good acceptance rate improves your visibility in search results.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How do I track performance?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Your dashboard provides real-time analytics on impressions, clicks, and earnings for each ad
                      space. You can also generate custom reports for specific time periods and export data for your
                      records or to share with ad buyers.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buyers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How do I find the right ad spaces?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our platform offers advanced search and filtering options to help you find ad spaces that match
                      your target audience. You can filter by category, platform type, audience demographics, price
                      range, and more. We also provide recommendations based on your previous campaigns.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What types of ads can I run?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This depends on the ad space you choose. Each listing specifies the types of ads they accept
                      (banner ads, sponsored content, newsletter mentions, social media posts, etc.) and any
                      restrictions they may have. You can upload your creative assets directly to our platform.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How do I pay for ad placements?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      When you book an ad space, you'll be prompted to make a payment through our secure payment system.
                      The funds are held in escrow until the campaign is completed successfully. This protects both you
                      and the advertiser.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Can I negotiate prices?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, you can send custom offers to advertisers. Many advertisers are open to negotiation,
                      especially for longer campaign durations or multiple ad placements. You can use our messaging
                      system to discuss terms before making an offer.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How do I measure campaign success?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Your dashboard provides comprehensive analytics for all your campaigns, including impressions,
                      clicks, CTR, and conversion tracking (if you've set up conversion goals). You can compare
                      performance across different ad spaces and optimize your strategy accordingly.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="affiliates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How does the affiliate program work?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      As an affiliate, you promote ad spaces to potential buyers using your unique referral links. When
                      someone clicks your link and books an ad space, you earn a commission on the transaction. You can
                      promote any ad space on our platform.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What commission rates do you offer?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Commission rates typically range from 10% to 20% of the transaction value, depending on the ad
                      space category and your affiliate level. Higher-performing affiliates can qualify for premium
                      rates and bonuses.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>When and how do I get paid?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Commissions are added to your affiliate account once the ad campaign is successfully completed and
                      the payment is released to the advertiser. You can withdraw your earnings once you reach the
                      minimum payout threshold ($50) via PayPal, bank transfer, or cryptocurrency.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What marketing materials are available?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We provide a variety of marketing materials including banners, email templates, social media
                      posts, and detailed product descriptions. You can access these in your affiliate dashboard. We
                      also offer training resources to help you maximize your earnings.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>How long do cookies last?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our affiliate cookies have a 30-day tracking period. This means if someone clicks your link and
                      books an ad space within 30 days, you'll receive the commission, even if they don't complete the
                      purchase immediately.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Still have questions?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Our support team is here to help you with any questions you may have.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/resources">
                    Browse Resources
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

