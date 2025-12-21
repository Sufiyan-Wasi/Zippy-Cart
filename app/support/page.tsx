import Link from "next/link"
import { ArrowLeft, Headphones, Mail, MessageCircle, Clock, CheckCircle2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
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
              <Headphones className="h-8 w-8 text-[#0b5ed7]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">24/7 Support</h1>
              <p className="text-lg text-gray-600 mt-1">Dedicated support team</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-8">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>We're Here to Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                At Zippy Cart, customer satisfaction is our top priority. Our dedicated support team is available 
                <strong> 24/7</strong> to assist you with any questions, concerns, or issues you may have. 
                Whether you need help with your order, have a product inquiry, or need technical assistance, 
                we're just a message or call away.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">24/7 Availability</p>
                    <p className="text-sm text-blue-700">
                      Our support team is available round the clock to assist you
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4 p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                    <Mail className="h-6 w-6 text-[#0b5ed7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Send us an email and we'll respond within 24 hours
                    </p>
                    <a href="mailto:support@zippycart.com" className="text-[#0b5ed7] hover:underline text-sm font-medium">
                      support@zippycart.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                    <Phone className="h-6 w-6 text-[#0b5ed7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Call us anytime for immediate assistance
                    </p>
                    <a href="tel:+911800123456" className="text-[#0b5ed7] hover:underline text-sm font-medium">
                      +91 1800-123-456
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                    <MessageCircle className="h-6 w-6 text-[#0b5ed7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Chat with our support team in real-time
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">
                      Start Chat
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                    <Headphones className="h-6 w-6 text-[#0b5ed7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Help Center</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Browse our FAQ and help articles
                    </p>
                    <Link href="/support" className="text-[#0b5ed7] hover:underline text-sm font-medium">
                      Visit Help Center →
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Email Support</span>
                  <span className="text-sm text-gray-600">24/7 (Response within 24 hours)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Phone Support</span>
                  <span className="text-sm text-gray-600">24/7</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Live Chat</span>
                  <span className="text-sm text-gray-600">24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Common Support Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Management</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Track your order</li>
                    <li>• Modify or cancel orders</li>
                    <li>• Order history</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Returns & Refunds</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Initiate a return</li>
                    <li>• Refund status</li>
                    <li>• Exchange requests</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Issues</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Payment failed</li>
                    <li>• Refund processing</li>
                    <li>• Billing questions</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Account & Profile</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Update account details</li>
                    <li>• Password reset</li>
                    <li>• Account settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Promise */}
          <Card>
            <CardHeader>
              <CardTitle>Our Support Promise</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Fast Response Times</p>
                    <p className="text-sm text-gray-700">
                      We aim to respond to all inquiries within 24 hours, with most responses within 4-6 hours.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Knowledgeable Team</p>
                    <p className="text-sm text-gray-700">
                      Our support team is trained and equipped to handle a wide range of issues and questions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Customer-First Approach</p>
                    <p className="text-sm text-gray-700">
                      Your satisfaction is our priority. We go the extra mile to resolve your concerns.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Multiple Channels</p>
                    <p className="text-sm text-gray-700">
                      Reach us through email, phone, or live chat - whatever is most convenient for you.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center pt-4">
            <Link href="/products">
              <Button size="lg" className="bg-[#0b5ed7] hover:bg-[#0a4fb8] text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

