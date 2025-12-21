import Link from "next/link"
import { ArrowLeft, Shield, Lock, CreditCard, Smartphone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SecurePaymentPage() {
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
              <Shield className="h-8 w-8 text-[#0b5ed7]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Secure Payment</h1>
              <p className="text-lg text-gray-600 mt-1">100% secure checkout</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-8">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Payment Security is Our Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                At Zippy Cart, we take your financial security seriously. We use industry-leading encryption 
                and security protocols to ensure that your payment information is always protected. 
                Your transactions are safe, secure, and encrypted from start to finish.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">SSL Encryption</p>
                    <p className="text-sm text-blue-700">
                      All payment data is encrypted using 256-bit SSL encryption technology
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Accepted Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-8 w-8 text-[#0b5ed7]" />
                  <div>
                    <p className="font-semibold text-gray-900">Credit & Debit Cards</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, RuPay, Amex</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Smartphone className="h-8 w-8 text-[#0b5ed7]" />
                  <div>
                    <p className="font-semibold text-gray-900">Digital Wallets</p>
                    <p className="text-sm text-gray-600">UPI, Paytm, Google Pay, PhonePe</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-8 w-8 text-[#0b5ed7]" />
                  <div>
                    <p className="font-semibold text-gray-900">Net Banking</p>
                    <p className="text-sm text-gray-600">All major banks supported</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Smartphone className="h-8 w-8 text-[#0b5ed7]" />
                  <div>
                    <p className="font-semibold text-gray-900">Buy Now, Pay Later</p>
                    <p className="text-sm text-gray-600">EMI options available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Our Safety Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">PCI DSS Compliance</p>
                    <p className="text-sm text-gray-700">
                      We are fully compliant with Payment Card Industry Data Security Standards (PCI DSS) Level 1.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment Gateway</p>
                    <p className="text-sm text-gray-700">
                      All transactions are processed through trusted, secure payment gateways with advanced fraud detection.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">No Card Storage</p>
                    <p className="text-sm text-gray-700">
                      We never store your complete card details on our servers. All payment information is handled by secure third-party processors.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-700">
                      Additional security layers including OTP verification for sensitive transactions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Real-time Fraud Monitoring</p>
                    <p className="text-sm text-gray-700">
                      Advanced algorithms continuously monitor transactions to detect and prevent fraudulent activities.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We are committed to protecting your personal and financial information. Our privacy policy ensures:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Your payment data is encrypted and never shared with unauthorized parties</li>
                <li>We comply with all applicable data protection regulations</li>
                <li>You have full control over your personal information</li>
                <li>Regular security audits and updates to maintain the highest security standards</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center pt-4">
            <Link href="/products">
              <Button size="lg" className="bg-[#0b5ed7] hover:bg-[#0a4fb8] text-white">
                Shop Securely Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

