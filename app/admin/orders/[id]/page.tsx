import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getOrderById } from "@/lib/orders"
import { formatINR } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderStatusSelect } from "@/components/order-status-select"
import { OrderRefundButton } from "@/components/order-refund-button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const { id } = await params
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Order Not Found</h1>
          <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
        </div>
        <Link href="/admin/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order ID: {order.id}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.qty} × {formatINR(item.priceINR)}
                      </p>
                    </div>
                    <p className="font-medium">{formatINR(item.priceINR * item.qty)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-lg font-bold">{formatINR(order.totalPriceINR)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Result */}
          {order.paymentResult && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Payment ID:</span> {order.paymentResult.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> {order.paymentResult.status}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Updated:</span> {order.paymentResult.updateTime}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refund Info */}
          {order.isRefunded && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardHeader>
                <CardTitle className="text-red-900 dark:text-red-100">Refund Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Refund Amount:</span> {formatINR(order.refundAmountINR || 0)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span> {order.refundReason || "N/A"}
                  </p>
                  {order.refundedAt && (
                    <p className="text-sm">
                      <span className="font-medium">Refunded At:</span>{" "}
                      {new Date(order.refundedAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Current Status</label>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Payment Status</p>
                {order.isPaid ? (
                  <Badge className="bg-green-100 text-green-800">Paid</Badge>
                ) : (
                  <Badge variant="secondary">Unpaid</Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Payment Method</p>
                <Badge variant="outline">{order.paymentMethod.toUpperCase()}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Order Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-sm font-medium mb-2">Paid At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.paidAt).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {order.isPaid && !order.isRefunded && (
            <Card>
              <CardHeader>
                <CardTitle>Refund Order</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderRefundButton orderId={order.id} orderTotal={order.totalPriceINR} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

