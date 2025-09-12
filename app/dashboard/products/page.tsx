"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { PermissionGuard } from "@/components/common/permission-guard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced features",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 999.99,
    sku: "IPH15PRO001",
    stock: 50,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    description: "Premium Android smartphone",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 899.99,
    sku: "SGS24001",
    stock: 30,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "MacBook Pro 16",
    description: "Professional laptop for developers",
    category: "Electronics",
    subcategory: "Laptops",
    price: 2499.99,
    sku: "MBP16001",
    stock: 0,
    status: "inactive",
    createdAt: "2024-01-05",
  },
]

export default function ProductsPage() {
  const router = useRouter()
  const [products] = useState(mockProducts)

  const columns = [
    {
      key: "name",
      label: "Product Name",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.sku}</div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value: string, row: any) => (
        <div>
          <div>{value}</div>
          <div className="text-sm text-muted-foreground">{row.subcategory}</div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: number) => (
        <Badge variant={value > 0 ? "default" : "destructive"}>
          {value > 0 ? `${value} in stock` : "Out of stock"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PermissionGuard permission="Product" subPermission="view">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Product" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${row.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Product" subPermission="delete">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "category",
      label: "Category",
      options: [
        { value: "Electronics", label: "Electronics" },
        { value: "Clothing", label: "Clothing" },
        { value: "Books", label: "Books" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Products"
        description="Manage your product catalog"
        data={products}
        columns={columns}
        searchPlaceholder="Search products..."
        filters={filters}
        actions={
          <PermissionGuard permission="Product" subPermission="create">
            <Button onClick={() => router.push("/dashboard/products/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </PermissionGuard>
        }
      />
    </div>
  )
}
