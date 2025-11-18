import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, BookOpen, LifeBuoy, MessageSquare, Search } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers to your questions and learn how to get the most out of All Things Ads
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="text" placeholder="Search for help articles..." className="pl-10" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="advertisers" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="advertisers">For Advertisers</TabsTrigger>
                  <TabsTrigger value="ad-buyers">For Ad Buyers</TabsTrigger>
                  <TabsTrigger value="affiliates">For Affiliates</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="advertisers">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I list my ad space?</AccordionTrigger>
                        <AccordionContent>
                          To list your ad space, sign up for an account, navigate to your dashboard, and click on "Add
                          New Ad Space." Fill out the required information about your platform, including audience
                          demographics, pricing, and available ad formats. Once submitted, your listing will be reviewed
                          and published within 24-48 hours.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How much should I charge for my ad space?</AccordionTrigger>
                        <AccordionContent>
                          Pricing depends on various factors including your audience size, engagement rates, niche, and
                          ad format. We provide pricing recommendations based on similar platforms in our marketplace.
                          You can also use our pricing calculator tool to get a suggested range based on your metrics.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>When and how do I get paid?</AccordionTrigger>
                        <AccordionContent>
                          Payments are processed on the 1st and 15th of each month for all completed ad campaigns. We
                          offer multiple payout methods including direct deposit, PayPal, and bank transfer. The minimum
                          payout threshold is $50. You can view your earnings and pending payments in your dashboard.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>How do I track my ad performance?</AccordionTrigger>
                        <AccordionContent>
                          Our platform provides comprehensive analytics for all your ad spaces. You can track
                          impressions, clicks, conversions, and revenue in real-time through your dashboard. We also
                          offer weekly and monthly performance reports that can be exported or automatically emailed to
                          you.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>What if an advertiser doesn't pay?</AccordionTrigger>
                        <AccordionContent>
                          We handle all payment processing and guarantee payment for approved campaigns. If there's any
                          issue with an advertiser's payment, we'll still ensure you receive your earnings for the
                          completed campaign period. This is part of our platform protection policy for advertisers.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Getting Started Guides</CardTitle>
                        <CardDescription>Step-by-step tutorials to help you succeed</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Creating Your First Ad Space Listing
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Learn how to create an effective listing that attracts buyers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Optimizing Your Pricing Strategy
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Tips for setting competitive rates that maximize revenue
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Understanding Analytics & Reports
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              How to use data to improve your ad performance
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="#">
                            View All Guides
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Need More Help?</CardTitle>
                        <CardDescription>Our support team is ready to assist you</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Live Chat Support</p>
                            <p className="text-sm text-muted-foreground">Available Monday-Friday, 9AM-6PM EST</p>
                            <Button size="sm" className="mt-2">
                              Start Chat
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <LifeBuoy className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Email Support</p>
                            <p className="text-sm text-muted-foreground">Get a response within 24 hours</p>
                            <Button variant="outline" size="sm" className="mt-2" asChild>
                              <Link href="/contact">Contact Us</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ad-buyers">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I find the right ad spaces?</AccordionTrigger>
                        <AccordionContent>
                          Our platform offers advanced search and filtering options to help you find the perfect ad
                          spaces. You can filter by audience demographics, platform type, pricing, and more. Our
                          AI-powered recommendation engine also suggests ad spaces based on your campaign goals and
                          target audience.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What ad formats are supported?</AccordionTrigger>
                        <AccordionContent>
                          We support a wide range of ad formats including banner ads, native ads, sponsored content,
                          newsletter placements, podcast mentions, social media posts, and more. Each ad space listing
                          specifies the available formats, dimensions, and technical requirements.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How do I pay for ad placements?</AccordionTrigger>
                        <AccordionContent>
                          We offer secure payment processing through credit cards, PayPal, and bank transfers. Payments
                          are held in escrow until the ad campaign is successfully delivered. For larger campaigns, we
                          also offer invoicing options with net-30 payment terms for qualified businesses.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Can I negotiate prices with advertisers?</AccordionTrigger>
                        <AccordionContent>
                          Yes, our platform allows direct communication with advertisers. You can negotiate prices,
                          discuss custom campaign requirements, or request volume discounts. Many advertisers are open
                          to negotiation, especially for longer-term commitments or larger campaigns.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>How do I track campaign performance?</AccordionTrigger>
                        <AccordionContent>
                          Our platform provides real-time analytics for all your campaigns. You can track impressions,
                          clicks, conversions, and ROI through your dashboard. We also offer integration with popular
                          analytics tools like Google Analytics, Facebook Pixel, and more for advanced tracking.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Getting Started Guides</CardTitle>
                        <CardDescription>Step-by-step tutorials to help you succeed</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Creating Your First Ad Campaign
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Learn how to set up effective campaigns that drive results
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Targeting the Right Audience
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              How to find ad spaces that reach your ideal customers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Measuring Campaign Success
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Understanding key metrics and optimizing performance
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="#">
                            View All Guides
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Need More Help?</CardTitle>
                        <CardDescription>Our support team is ready to assist you</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Live Chat Support</p>
                            <p className="text-sm text-muted-foreground">Available Monday-Friday, 9AM-6PM EST</p>
                            <Button size="sm" className="mt-2">
                              Start Chat
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <LifeBuoy className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Email Support</p>
                            <p className="text-sm text-muted-foreground">Get a response within 24 hours</p>
                            <Button variant="outline" size="sm" className="mt-2" asChild>
                              <Link href="/contact">Contact Us</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="affiliates">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How does the affiliate program work?</AccordionTrigger>
                        <AccordionContent>
                          Our affiliate program allows you to earn commissions by promoting ad spaces and connecting
                          advertisers with ad buyers. You'll receive unique tracking links for each ad space or
                          advertiser you promote. When someone signs up or makes a purchase through your link, you earn
                          a commission on the transaction.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What commission rates do you offer?</AccordionTrigger>
                        <AccordionContent>
                          Commission rates vary based on your affiliate level and the type of transaction. Basic
                          affiliates earn 10-15% on ad space bookings, while Pro and Elite affiliates can earn up to
                          20-25%. We also offer performance bonuses for high-volume affiliates and special promotions
                          for specific campaigns.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>When and how do I get paid?</AccordionTrigger>
                        <AccordionContent>
                          Affiliate commissions are paid on the 15th of each month for the previous month's earnings. We
                          offer multiple payout methods including PayPal, direct deposit, and cryptocurrency. The
                          minimum payout threshold is $50. You can track your earnings, conversions, and pending
                          payments in your affiliate dashboard.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>What marketing materials are available?</AccordionTrigger>
                        <AccordionContent>
                          We provide a variety of marketing materials including banners, email templates, social media
                          posts, and product descriptions. You can access these resources in your affiliate dashboard.
                          We also offer custom materials for high-performing affiliates and can create specific assets
                          upon request.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>How long do affiliate cookies last?</AccordionTrigger>
                        <AccordionContent>
                          Our affiliate cookies have a 30-day tracking period. This means if someone clicks your
                          affiliate link and makes a purchase within 30 days, you'll receive credit for the referral.
                          For subscription services, you'll continue to earn commissions on recurring payments for as
                          long as the customer remains active.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Getting Started Guides</CardTitle>
                        <CardDescription>Step-by-step tutorials to help you succeed</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Affiliate Marketing Basics
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Learn the fundamentals of successful affiliate marketing
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Promoting Ad Spaces Effectively
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Strategies to maximize your conversion rates
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <Link href="#" className="font-medium hover:underline">
                              Tracking & Optimizing Performance
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              How to use analytics to increase your earnings
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="#">
                            View All Guides
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Need More Help?</CardTitle>
                        <CardDescription>Our support team is ready to assist you</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Live Chat Support</p>
                            <p className="text-sm text-muted-foreground">Available Monday-Friday, 9AM-6PM EST</p>
                            <Button size="sm" className="mt-2">
                              Start Chat
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <LifeBuoy className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Email Support</p>
                            <p className="text-sm text-muted-foreground">Get a response within 24 hours</p>
                            <Button variant="outline" size="sm" className="mt-2" asChild>
                              <Link href="/contact">Contact Us</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-8">Our team is here to help you with any questions or concerns</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#">Schedule a Demo</Link>
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

