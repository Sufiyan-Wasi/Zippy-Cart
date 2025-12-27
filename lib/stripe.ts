import "server-only"
import Stripe from "stripe"

let stripe: Stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export { stripe } = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Use API version that matches your Stripe account
  apiVersion: '2024-04-10.acacia',
  typescript: true,
})
