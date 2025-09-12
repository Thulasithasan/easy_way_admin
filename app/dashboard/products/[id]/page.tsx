"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard } from "@/components/common/permission-guard"

// Mock data - in real app, fetch based on ID
const mockProduct = {
  id: "1",
  name: "iPhone 15 Pro",
  description:
    "The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom. Built for professionals who demand the best in mobile technology.",
  category: "Electronics",
  subcategory: "Smartphones",
  price: 999.99,
  sku: "IPH15PRO001",
  stock: 50,
  status: "active",
  images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  specifications: {
    brand: "Apple",
    model: "iPhone 15 Pro",
    color: "Natural Titanium",
    storage: "128GB",
    display: "6.1-inch Super Retina XDR",
    processor: "A17 Pro chip",
    camera: "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
    battery: "Up to 23 hours video playback",
    os: "iOS 17",
  },
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
}

export default function ProductDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [product] = useState(mockProduct)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission="Product" subPermission="edit">
            <Button onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="Product" subPermission="delete">
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="aspect-square rounded-lg border overflow-hidden">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded border overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-2xl font-bold">${product.price}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock</label>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-2xl font-bold">{product.stock}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p className="mt-1">
                  {product.category} → {product.subcategory}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
