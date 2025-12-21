import Link from "next/link"
import { ArrowLeft, Truck, MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FreeShippingPage() {
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
              <Truck className="h-8 w-8 text-[#0b5ed7]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Free Shipping</h1>
              <p className="text-lg text-gray-600 mt-1">On orders above ₹499</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-8">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Free Shipping Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                At Zippy Cart, we offer <strong>FREE shipping</strong> on all orders above ₹499. 
                This means you can shop for your favorite products without worrying about delivery charges, 
                making your shopping experience more convenient and affordable.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Minimum Order Value</p>
                    <p className="text-sm text-green-700">Order value must be ₹499 or more to qualify for free shipping</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside">
                <li className="text-gray-700">
                  <strong>Add items to cart:</strong> Browse our wide selection of products and add items worth ₹499 or more to your cart.
                </li>
                <li className="text-gray-700">
                  <strong>Automatic application:</strong> Once your cart total reaches ₹499, free shipping is automatically applied at checkout.
                </li>
                <li className="text-gray-700">
                  <strong>Order confirmation:</strong> You'll see "Free Shipping" reflected in your order summary before payment.
                </li>
                <li className="text-gray-700">
                  <strong>Fast delivery:</strong> Your order will be processed and shipped using our standard delivery methods at no extra cost.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Supported Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Supported Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Free shipping is available to the following locations:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  All major cities across India
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Tier 1, Tier 2, and Tier 3 cities
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Suburban and rural areas (with standard delivery times)
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Note: Delivery times may vary based on your location. Standard delivery takes 3-7 business days.
              </p>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What if my order is less than ₹499?</h3>
                <p className="text-gray-700">
                  Orders below ₹499 will incur a standard shipping charge. The shipping fee will be calculated and displayed 
                  at checkout before you complete your purchase.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I combine multiple items to reach ₹499?</h3>
                <p className="text-gray-700">
                  Yes! You can add multiple products to your cart to reach the ₹499 minimum order value and qualify for free shipping.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is free shipping available for international orders?</h3>
                <p className="text-gray-700">
                  Currently, free shipping is only available for orders within India. International orders may have different shipping terms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What about express or premium shipping?</h3>
                <p className="text-gray-700">
                  Free shipping applies to standard delivery. If you choose express or premium shipping options, additional charges may apply.
                </p>
              </div>
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

