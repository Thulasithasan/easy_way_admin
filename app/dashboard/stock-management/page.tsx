"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { PermissionGuard } from "@/components/common/permission-guard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockStock = [
  {
    id: "1",
    productName: "iPhone 15 Pro",
    sku: "IPH15PRO001",
    category: "Electronics",
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    unitCost: 800.0,
    totalValue: 36000.0,
    supplier: "Apple Inc.",
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-01-20",
  },
  {
    id: "2",
    productName: "Samsung Galaxy S24",
    sku: "SGS24001",
    category: "Electronics",
    currentStock: 8,
    minStock: 10,
    maxStock: 80,
    reorderPoint: 15,
    unitCost: 700.0,
    totalValue: 5600.0,
    supplier: "Samsung",
    location: "Warehouse A",
    status: "low_stock",
    lastUpdated: "2024-01-19",
  },
  {
    id: "3",
    productName: "MacBook Pro 16",
    sku: "MBP16001",
    category: "Electronics",
    currentStock: 0,
    minStock: 5,
    maxStock: 25,
    reorderPoint: 8,
    unitCost: 2000.0,
    totalValue: 0.0,
    supplier: "Apple Inc.",
    location: "Warehouse B",
    status: "out_of_stock",
    lastUpdated: "2024-01-18",
  },
]

export default function StockManagementPage() {
  const router = useRouter()
  const [stock] = useState(mockStock)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "default"
      case "low_stock":
        return "destructive"
      case "out_of_stock":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStockIcon = (currentStock: number, minStock: number) => {
    if (currentStock === 0) return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (currentStock <= minStock) return <TrendingDown className="h-4 w-4 text-yellow-500" />
    return <TrendingUp className="h-4 w-4 text-green-500" />
  }

  const columns = [
    {
      key: "productName",
      label: "Product",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: "currentStock",
      label: "Current Stock",
      render: (value: number, row: any) => (
        <div className="flex items-center gap-2">
          {getStockIcon(value, row.minStock)}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">Min: {row.minStock}</div>
          </div>
        </div>
      ),
    },
    {
      key: "totalValue",
      label: "Total Value",
      render: (value: number) => <div className="font-medium">${value.toLocaleString()}</div>,
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.location}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={getStatusColor(value)}>{value.replace("_", " ")}</Badge>,
    },
    {
      key: "lastUpdated",
      label: "Last Updated",
      render: (value: string) => new Date(value).toLocaleDateString(),
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
            <PermissionGuard permission="Inventory" subPermission="view">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/stock-management/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Inventory" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/stock-management/${row.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Adjust Stock
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Inventory" subPermission="create">
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Reorder Stock
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
        { value: "in_stock", label: "In Stock" },
        { value: "low_stock", label: "Low Stock" },
        { value: "out_of_stock", label: "Out of Stock" },
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
    {
      key: "location",
      label: "Location",
      options: [
        { value: "Warehouse A", label: "Warehouse A" },
        { value: "Warehouse B", label: "Warehouse B" },
        { value: "Store Front", label: "Store Front" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Stock Management"
        description="Monitor and manage inventory levels"
        data={stock}
        columns={columns}
        searchPlaceholder="Search stock items..."
        filters={filters}
        actions={
          <div className="flex gap-2">
            <PermissionGuard permission="Inventory" subPermission="create">
              <Button onClick={() => router.push("/dashboard/stock-management/adjust")}>
                <Edit className="h-4 w-4 mr-2" />
                Adjust Stock
              </Button>
            </PermissionGuard>
            <PermissionGuard permission="Inventory" subPermission="view">
              <Button variant="outline" onClick={() => router.push("/dashboard/stock-management/reports")}>
                View Reports
              </Button>
            </PermissionGuard>
          </div>
        }
      />
    </div>
  )
}
