import Link from "next/link"
import { ArrowLeft, CreditCard, Clock, CheckCircle2, Package, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EasyReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[#0b5ed7] hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0b5ed7]/10">
              <CreditCard className="h-8 w-8 text-[#0b5ed7]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Easy Returns</h1>
              <p className="text-lg text-gray-600 mt-1">7-day return policy</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-8">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hassle-Free Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Not satisfied with your purchase? No worries! At Zippy Cart, we offer a simple and straightforward 
                <strong> 7-day return policy</strong> that allows you to return eligible items for a full refund or exchange. 
                Your satisfaction is our priority.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">7-Day Return Window</p>
                    <p className="text-sm text-green-700">
                      You have 7 days from the date of delivery to initiate a return
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Steps */}
          <Card>
            <CardHeader>
              <CardTitle>How to Return an Item</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b5ed7] text-white font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Log into Your Account</h3>
                    <p className="text-gray-700">
                      Go to your order history and select the item you want to return. Click on "Return Item" 
                      and provide the reason for return.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b5ed7] text-white font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Get Return Authorization</h3>
                    <p className="text-gray-700">
                      Once your return request is approved, you'll receive a Return Authorization (RA) number 
                      and a prepaid return shipping label via email.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b5ed7] text-white font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pack the Item</h3>
                    <p className="text-gray-700">
                      Pack the item in its original packaging with all accessories, tags, and documentation. 
                      Include the RA number on the package.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b5ed7] text-white font-semibold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ship It Back</h3>
                    <p className="text-gray-700">
                      Drop off the package at any designated courier location or schedule a pickup using 
                      the provided return label.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b5ed7] text-white font-semibold">
                      5
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Receive Refund</h3>
                    <p className="text-gray-700">
                      Once we receive and inspect the item, your refund will be processed within 5-7 business days 
                      to your original payment method.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Return Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Items Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-green-800 text-sm list-disc list-inside">
                    <li>Items must be in original condition with all tags attached</li>
                    <li>Original packaging and accessories must be included</li>
                    <li>Return must be initiated within 7 days of delivery</li>
                    <li>Personalized or custom-made items may have different policies</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Non-Returnable Items
                  </h3>
                  <ul className="space-y-2 text-red-800 text-sm list-disc list-inside">
                    <li>Items without original packaging or tags</li>
                    <li>Used, damaged, or altered items</li>
                    <li>Gift cards and downloadable software</li>
                    <li>Items returned after 7 days</li>
                    <li>Intimate apparel and personal care items (hygiene reasons)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Refund Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span><strong>Return Received:</strong> 1-2 business days after shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span><strong>Quality Check:</strong> 1-2 business days</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span><strong>Refund Processing:</strong> 5-7 business days to original payment method</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Note: Refund processing times may vary depending on your bank or payment provider.
              </p>
            </CardContent>
          </Card>

          {/* Exchange Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Need a different size or color? We also offer exchanges for eligible items:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Exchanges must be requested within 7 days of delivery</li>
                <li>Item must be unused and in original condition</li>
                <li>Exchanged item will be shipped once the original is received</li>
                <li>Price differences will be adjusted accordingly</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center pt-4">
            <Link href="/products">
              <Button size="lg" className="bg-[#0b5ed7] hover:bg-[#0a4fb8] text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

