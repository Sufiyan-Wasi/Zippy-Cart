"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatINR } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface OrderRefundButtonProps {
  orderId: string
  orderTotal: number
}

export function OrderRefundButton({ orderId, orderTotal }: OrderRefundButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState(orderTotal.toString())
  const [reason, setReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleRefund = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      setError("Please enter a valid refund amount")
      return
    }

    if (parseFloat(refundAmount) > orderTotal) {
      setError(`Refund amount cannot exceed order total of ${formatINR(orderTotal)}`)
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refundAmountINR: parseFloat(refundAmount),
          reason: reason || "Admin processed refund",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to process refund")
        setIsProcessing(false)
        return
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Process Refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>Refund amount for order {orderId}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="refundAmount">Refund Amount (₹)</Label>
            <Input
              id="refundAmount"
              type="number"
              min="0"
              max={orderTotal}
              step="0.01"
              value={refundAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefundAmount(e.target.value)}
              placeholder="Enter refund amount"
            />
            <p className="text-xs text-muted-foreground">
              Order total: {formatINR(orderTotal)}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              placeholder="Enter refund reason"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRefund} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Process Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

