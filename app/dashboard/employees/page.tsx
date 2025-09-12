"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/common/data-table"
import { PermissionGuard } from "@/components/common/permission-guard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockEmployees = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    role: "ADMIN",
    department: "IT",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1 (555) 234-5678",
    role: "MANAGER",
    department: "Sales",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789",
    role: "EMPLOYEE",
    department: "Support",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-05",
    lastLogin: "2024-01-18",
  },
]

export default function EmployeesPage() {
  const router = useRouter()
  const [employees] = useState(mockEmployees)

  const columns = [
    {
      key: "name",
      label: "Employee",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.avatar || "/placeholder.svg"} alt={`${row.firstName} ${row.lastName}`} />
            <AvatarFallback>
              {row.firstName.charAt(0)}
              {row.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: string, row: any) => (
        <div>
          <Badge variant="outline">{value}</Badge>
          <div className="text-sm text-muted-foreground mt-1">{row.department}</div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3" />
          {value}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "lastLogin",
      label: "Last Login",
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
            <PermissionGuard permission="User" subPermission="view">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/employees/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="User" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/employees/${row.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="User" subPermission="delete">
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
      key: "role",
      label: "Role",
      options: [
        { value: "ADMIN", label: "Admin" },
        { value: "MANAGER", label: "Manager" },
        { value: "EMPLOYEE", label: "Employee" },
      ],
    },
    {
      key: "department",
      label: "Department",
      options: [
        { value: "IT", label: "IT" },
        { value: "Sales", label: "Sales" },
        { value: "Support", label: "Support" },
        { value: "HR", label: "HR" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Employees"
        description="Manage company employees and their access"
        data={employees}
        columns={columns}
        searchPlaceholder="Search employees..."
        filters={filters}
        actions={
          <PermissionGuard permission="User" subPermission="create">
            <Button onClick={() => router.push("/dashboard/employees/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </PermissionGuard>
        }
      />
    </div>
  )
}
