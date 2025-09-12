"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Package, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard } from "@/components/common/permission-guard"

// Mock data - in real app, fetch based on ID
const mockSubcategory = {
  id: "1",
  name: "Smartphones",
  description: "Mobile phones and accessories including cases, chargers, and screen protectors",
  category: "Electronics",
  categoryId: "1",
  status: "active",
  productCount: 25,
  totalValue: 125000.0,
  products: [
    { id: "1", name: "iPhone 15 Pro", price: 999.99, stock: 45 },
    { id: "2", name: "Samsung Galaxy S24", price: 899.99, stock: 30 },
    { id: "3", name: "Google Pixel 8", price: 699.99, stock: 20 },
    { id: "4", name: "OnePlus 12", price: 799.99, stock: 15 },
  ],
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
}

export default function SubcategoryDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [subcategory] = useState(mockSubcategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Tag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{subcategory.name}</h1>
              <p className="text-muted-foreground">
                {subcategory.category} → {subcategory.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission="Product" subPermission="edit">
            <Button onClick={() => router.push(`/dashboard/subcategories/${subcategory.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Subcategory
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parent Category</label>
              <p className="mt-1 font-medium">{subcategory.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={subcategory.status === "active" ? "default" : "secondary"}>{subcategory.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1">{new Date(subcategory.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1">{new Date(subcategory.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{subcategory.productCount}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold">${subcategory.totalValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{subcategory.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Products in this Subcategory */}
      <Card>
        <CardHeader>
          <CardTitle>Products in this Subcategory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {subcategory.products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{product.name}</h4>
                  <Badge variant="outline">{product.stock} in stock</Badge>
                </div>
                <p className="text-lg font-bold text-primary">${product.price}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-transparent"
                  onClick={() => router.push(`/dashboard/products/${product.id}`)}
                >
                  View Product
                </Button>
              </div>
            ))}
          </div>
          {subcategory.products.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products in this subcategory yet</p>
              <PermissionGuard permission="Product" subPermission="create">
                <Button className="mt-2" onClick={() => router.push("/dashboard/products/create")}>
                  Add First Product
                </Button>
              </PermissionGuard>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
