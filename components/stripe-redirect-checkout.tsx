'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { ShippingAddress } from '@/lib/types';

interface StripeRedirectCheckoutProps {
  items: Array<{ productId: string; qty: number }>;
  shippingAddress: ShippingAddress;
  onSuccess: (orderId: string) => void;
}

export function StripeRedirectCheckout({ items, shippingAddress, onSuccess }: StripeRedirectCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingAddress,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server error: Non-JSON response received');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert(`Payment error: ${error.message || 'An unknown error occurred'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button 
        onClick={handleCheckout} 
        disabled={isLoading}
        className="w-full py-6 text-lg"
      >
        {isLoading ? 'Processing...' : 'Pay Now with Stripe'}
      </Button>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Secure payment powered by Stripe
      </p>
    </div>
  );
}