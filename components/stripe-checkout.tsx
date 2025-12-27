"use client"

import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { startCheckoutSession, confirmPayment } from "@/app/actions/stripe"
import type { ShippingAddress } from "@/lib/types"

// Initialize Stripe promise only if the key exists
const stripePromise = (function() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return Promise.resolve(null);
})();

interface StripeCheckoutProps {
  items: Array<{ productId: string; qty: number }>
  shippingAddress: ShippingAddress
  onSuccess: (orderId: string) => void
}

export function StripeCheckout({ items, shippingAddress, onSuccess }: StripeCheckoutProps) {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const result = await startCheckoutSession(items, shippingAddress)
      setOrderId(result.orderId)
      return result.clientSecret
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initialize checkout"
      setError(message)
      throw err
    }
  }, [items, shippingAddress])

  const handleComplete = useCallback(async () => {
    if (orderId) {
      try {
        await confirmPayment(orderId, `pi_${Date.now()}`)
        onSuccess(orderId)
      } catch (err) {
        console.error("Failed to confirm payment:", err)
      }
    }
  }, [orderId, onSuccess])

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div id="checkout" className="min-h-[400px]">
      {stripePromise ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            fetchClientSecret,
            onComplete: handleComplete,
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div className="rounded-lg bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.</p>
        </div>
      )}
    </div>
  )
}
