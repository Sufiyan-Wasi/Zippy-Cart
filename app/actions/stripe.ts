"use server"

import { stripe } from "@/lib/stripe"
import { getProductById } from "@/lib/products"
import { getSession } from "@/lib/auth"
import { createOrder, markOrderAsPaid } from "@/lib/orders"
import type { ShippingAddress } from "@/lib/types"

interface CartItemInput {
  productId: string
  qty: number
}

export async function startCheckoutSession(items: CartItemInput[], shippingAddress: ShippingAddress) {
  const session = await getSession()

  if (!session) {
    throw new Error("You must be logged in to checkout")
  }

  // Validate and get products
  const lineItems = []
  const orderItems = []
  let totalPriceINR = 0

  for (const item of items) {
    const product = getProductById(item.productId)
    if (!product) {
      throw new Error(`Product with id "${item.productId}" not found`)
    }
    if (product.stock < item.qty) {
      throw new Error(`Not enough stock for "${product.title}"`)
    }

    // Convert INR to USD cents for Stripe (approximate conversion)
    // Using 1 USD = 83 INR as approximate rate
    const priceInUSDCents = Math.round((product.priceINR / 83) * 100)

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          description: product.description.slice(0, 500),
        },
        unit_amount: priceInUSDCents,
      },
      quantity: item.qty,
    })

    orderItems.push({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      qty: item.qty,
    })

    totalPriceINR += product.priceINR * item.qty
  }

  // Add shipping if total < 499
  if (totalPriceINR < 499) {
    totalPriceINR += 49
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping",
          description: "Standard delivery",
        },
        unit_amount: Math.round((49 / 83) * 100), // ~$0.59
      },
      quantity: 1,
    })
  }

  // Create order in database
  const order = createOrder({
    userId: session.id,
    userEmail: session.email,
    orderItems,
    shippingAddress,
    paymentMethod: "stripe",
    totalPriceINR,
  })

  // Create Stripe Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    metadata: {
      orderId: order.id,
      userId: session.id,
    },
  })

  return {
    clientSecret: checkoutSession.client_secret,
    orderId: order.id,
  }
}

export async function confirmPayment(orderId: string, paymentIntentId: string) {
  const order = markOrderAsPaid(orderId, {
    id: paymentIntentId,
    status: "succeeded",
    updateTime: new Date().toISOString(),
  })

  if (!order) {
    throw new Error("Order not found")
  }

  return order
}
