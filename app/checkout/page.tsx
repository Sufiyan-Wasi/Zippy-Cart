"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatINR } from "@/lib/utils"
import type { SessionUser, ShippingAddress } from "@/lib/types"
import { StripeRedirectCheckout } from "@/components/stripe-redirect-checkout"

type CheckoutStep = "shipping" | "payment" | "success"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<CheckoutStep>("shipping")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  })

  // Check auth
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data?.user || null)
        if (data?.user) {
          setShippingAddress((prev) => ({
            ...prev,
            fullName: data.user.name,
          }))
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const shippingCost = totalPrice >= 499 ? 0 : 49
  const finalTotal = totalPrice + shippingCost

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId)
    setStep("success")
    clearCart()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">Please Login</h1>
          <p className="mb-6 text-muted-foreground">You need to be logged in to checkout.</p>
          <Link href="/login">
            <Button size="lg">Login to Continue</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-muted-foreground">Add some products to checkout.</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Order Placed Successfully!</h1>
          <p className="mb-2 text-muted-foreground">Thank you for your purchase.</p>
          {orderId && <p className="mb-6 font-mono text-sm text-muted-foreground">Order ID: {orderId}</p>}
          <div className="flex flex-col gap-3">
            <Link href="/orders">
              <Button size="lg" className="w-full">
                View My Orders
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href={step === "payment" ? "#" : "/cart"}
        onClick={(e) => {
          if (step === "payment") {
            e.preventDefault()
            setStep("shipping")
          }
        }}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        {step === "payment" ? "Back to Shipping" : "Back to Cart"}
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step === "shipping" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              }`}
            >
              1
            </div>
            <span className={step === "shipping" ? "font-medium" : "text-muted-foreground"}>Shipping</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className={step === "payment" ? "font-medium" : "text-muted-foreground"}>Payment</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address, apartment, etc."
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StripeRedirectCheckout
                  items={items.map((item) => ({ productId: item.product.id, qty: item.qty }))}
                  shippingAddress={shippingAddress}
                  onSuccess={handlePaymentSuccess}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {qty}</p>
                      <p className="text-sm font-medium">{formatINR(product.priceINR * qty)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>{formatINR(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingCost === 0 ? <span className="text-green-600">FREE</span> : formatINR(shippingCost)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatINR(finalTotal)}</span>
              </div>

              {/* Shipping Address Preview */}
              {step === "payment" && shippingAddress.address && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-1">Shipping to:</p>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress.fullName}
                      <br />
                      {shippingAddress.address}
                      <br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                      <br />
                      Phone: {shippingAddress.phone}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
