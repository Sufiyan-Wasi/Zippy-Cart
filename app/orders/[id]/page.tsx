import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { getOrderById } from "@/lib/orders"
import { getProductById } from "@/lib/products"
import { formatINR } from "@/lib/utils"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const order = getOrderById(id)

  if (!order || (order.userId !== session.id && session.role !== "admin")) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  // Calculate subtotal
  const subtotal = order.orderItems.reduce((sum, item) => sum + item.priceINR * item.qty, 0)
  const shipping = order.totalPriceINR - subtotal

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="font-mono text-muted-foreground">{order.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`gap-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </Badge>
          {order.isPaid ? (
            <Badge className="bg-green-100 text-green-800">Paid</Badge>
          ) : (
            <Badge variant="secondary">Unpaid</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Order Items ({order.orderItems.reduce((sum, item) => sum + item.qty, 0)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {order.orderItems.map((item, index) => {
                  const product = getProductById(item.productId)
                  return (
                    <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="flex-1">
                        {product ? (
                          <Link
                            href={`/products/${product.slug}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <span className="font-medium">{item.title}</span>
                        )}
                        <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatINR(item.priceINR * item.qty)}</p>
                        <p className="text-sm text-muted-foreground">{formatINR(item.priceINR)} each</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatINR(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatINR(order.totalPriceINR)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid On</span>
                    <span>{new Date(order.paidAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
