"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, HelpCircle, X } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/page-container"
import { AnimatedContent } from "@/components/animated-content"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageContainer>
        <AnimatedContent>
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Pricing Plans</h1>
              <p className="text-gray-300 mb-8">
                Choose the perfect plan for your advertising needs
              </p>
            </div>
          </div>
        </AnimatedContent>
        
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Choose the plan that's right for your advertising needs
              </p>

              <Tabs defaultValue="advertisers" className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
                  <TabsTrigger value="ad-buyers">Ad Buyers</TabsTrigger>
                  <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="advertisers" className="w-full">
              <TabsContent value="advertisers" className="mt-0">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Basic Plan */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Basic</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$0</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>Perfect for getting started with monetizing your platform</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>List up to 3 ad spaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Basic analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Standard support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Featured listings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Priority support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="flex flex-col border-primary/50 shadow-md relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                    <CardHeader>
                      <CardTitle>Pro</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$49</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>Ideal for growing your advertising revenue</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>List up to 15 ad spaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Featured listings (3/month)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Custom branding</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">API access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Enterprise Plan */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Enterprise</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$199</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>For large publishers and media companies</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Unlimited ad spaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Enterprise analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Dedicated account manager</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Featured listings (unlimited)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>White-label solution</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>API access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/contact">Contact Sales</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ad-buyers" className="mt-0">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Basic Plan */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Basic</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$0</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>Perfect for small businesses just getting started</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Browse all ad spaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Basic campaign analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Standard support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">AI-powered recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Advanced targeting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Priority placement</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="flex flex-col border-primary/50 shadow-md relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                    <CardHeader>
                      <CardTitle>Pro</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$99</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>For growing businesses with regular ad campaigns</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Browse all ad spaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Advanced campaign analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>AI-powered recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Advanced targeting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Priority placement</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Enterprise Plan */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Enterprise</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$299</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>For large companies with extensive ad campaigns</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Browse all ad spaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Enterprise-level analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Dedicated account manager</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>AI-powered recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Advanced targeting & optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Priority placement</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/contact">Contact Sales</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="affiliates" className="mt-0">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Basic Plan */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Basic</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$0</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>Perfect for affiliate marketers just getting started</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Access to affiliate marketplace</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Basic tracking tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Standard commission rates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Priority access to campaigns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Custom tracking links</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="flex flex-col border-primary/50 shadow-md relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                    <CardHeader>
                      <CardTitle>Pro</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$39</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>For serious affiliate marketers looking to scale</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Access to affiliate marketplace</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Advanced tracking tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Enhanced commission rates (+2%)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Priority access to campaigns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Custom tracking links</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Elite Plan */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Elite</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">$99</span>
                        <span className="text-muted-foreground mb-1">/month</span>
                      </div>
                      <CardDescription>For professional affiliate marketers and agencies</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Access to affiliate marketplace</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Premium tracking tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Maximum commission rates (+5%)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Enterprise-level analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Early access to exclusive campaigns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Custom tracking links & API access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

              <div className="space-y-6">
                {[
                  {
                    question: "How does the billing work?",
                    answer:
                      "We offer monthly and annual billing options. Annual plans come with a 20% discount. You can upgrade, downgrade, or cancel your plan at any time.",
                  },
                  {
                    question: "Are there any transaction fees?",
                    answer:
                      "We charge a 5% transaction fee on the Basic plan, 3% on the Pro plan, and 2% on the Enterprise plan. These fees help us maintain the platform and provide quality service.",
                  },
                  {
                    question: "Can I change my plan later?",
                    answer:
                      "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle.",
                  },
                  {
                    question: "Do you offer refunds?",
                    answer:
                      "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact us within 14 days of your purchase for a full refund.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer:
                      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
                  },
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">Still have questions?</p>
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
      <Footer />
    </div>
  )
}

