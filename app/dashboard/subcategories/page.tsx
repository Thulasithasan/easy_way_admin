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
const mockSubcategories = [
  {
    id: "1",
    name: "Smartphones",
    description: "Mobile phones and accessories",
    category: "Electronics",
    categoryId: "1",
    status: "active",
    productCount: 25,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Laptops",
    description: "Portable computers and accessories",
    category: "Electronics",
    categoryId: "1",
    status: "active",
    productCount: 18,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "T-Shirts",
    description: "Casual wear t-shirts",
    category: "Clothing",
    categoryId: "2",
    status: "inactive",
    productCount: 0,
    createdAt: "2024-01-05",
  },
]

export default function SubcategoriesPage() {
  const router = useRouter()
  const [subcategories] = useState(mockSubcategories)

  const columns = [
    {
      key: "name",
      label: "Subcategory Name",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.category}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (value: string) => <div className="max-w-[300px] truncate">{value}</div>,
    },
    {
      key: "productCount",
      label: "Products",
      render: (value: number) => <Badge variant="outline">{value} products</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "createdAt",
      label: "Created",
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
            <PermissionGuard permission="Product" subPermission="view">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/subcategories/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Product" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/subcategories/${row.id}/edit`)}>
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
        title="Subcategories"
        description="Manage product subcategories"
        data={subcategories}
        columns={columns}
        searchPlaceholder="Search subcategories..."
        filters={filters}
        actions={
          <PermissionGuard permission="Product" subPermission="create">
            <Button onClick={() => router.push("/dashboard/subcategories/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </PermissionGuard>
        }
      />
    </div>
  )
}
