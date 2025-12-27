import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/auth';
import { getProductById } from '@/lib/products';
import { createOrder } from '@/lib/orders';
import type { ShippingAddress } from '@/lib/types';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY in environment variables');
}

interface CartItem {
  productId: string;
  qty: number;
}

export async function POST(req: NextRequest) {
  try {
    let session;
    try {
      session = await getSession();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return Response.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, shippingAddress }: { items: CartItem[]; shippingAddress: ShippingAddress } = await req.json();

    // Validate and get products
    const lineItems = [];
    const orderItems = [];
    let totalPriceINR = 0;

    for (const item of items) {
      let product;
      try {
        product = getProductById(item.productId);
      } catch (productError) {
        console.error('Product retrieval error:', productError);
        return Response.json({ error: `Error retrieving product with id "${item.productId}"` }, { status: 500 });
      }
      
      if (!product) {
        return Response.json({ error: `Product with id "${item.productId}" not found` }, { status: 400 });
      }
      if (product.stock < item.qty) {
        return Response.json({ error: `Not enough stock for "${product.title}"` }, { status: 400 });
      }

      // Convert INR to USD cents for Stripe (approximate conversion)
      // Using 1 USD = 83 INR as approximate rate
      const priceInUSDCents = Math.round((product.priceINR / 83) * 100);

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: product.description?.slice(0, 500) || '',
          },
          unit_amount: priceInUSDCents,
        },
        quantity: item.qty,
      });

      orderItems.push({
        productId: product.id,
        title: product.title,
        priceINR: product.priceINR,
        qty: item.qty,
      });

      totalPriceINR += product.priceINR * item.qty;
    }

    // Add shipping if total < 499
    if (totalPriceINR < 499) {
      totalPriceINR += 49;
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard delivery',
          },
          unit_amount: Math.round((49 / 83) * 100), // ~$0.59
        },
        quantity: 1,
      });
    }

    // Create order in database
    let order;
    try {
      order = createOrder({
        userId: session.id,
        userEmail: session.email,
        orderItems,
        shippingAddress,
        paymentMethod: 'stripe',
        totalPriceINR,
      });
    } catch (orderError) {
      console.error('Order creation error:', orderError);
      return Response.json({ error: 'Error creating order' }, { status: 500 });
    }
    
    if (!order) {
      return Response.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create Stripe Checkout Session
    let checkoutSession;
    try {
      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.nextUrl.origin}/checkout?success=true&orderId=${order.id}`,
        cancel_url: `${req.nextUrl.origin}/checkout?canceled=true`,
        metadata: {
          orderId: order.id,
          userId: session.id,
        },
      });
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);
      return Response.json({ 
        error: 'Payment processing error: ' + (stripeError.message || 'Unknown error') 
      }, { status: 500 });
    }

    return Response.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}