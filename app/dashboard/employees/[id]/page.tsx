"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PermissionGuard } from "@/components/common/permission-guard"

// Mock data
const mockEmployee = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
  role: "ADMIN",
  department: "IT",
  status: "active",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "2024-01-15",
  lastLogin: "2024-01-20",
  address: "123 Main St, New York, NY 10001",
  emergencyContact: {
    name: "Jane Doe",
    phone: "+1 (555) 987-6543",
    relationship: "Spouse",
  },
  permissions: ["User Management", "Product Management", "Order Management"],
  recentActivity: [
    { action: "Updated product inventory", timestamp: "2024-01-20 14:30" },
    { action: "Created new user account", timestamp: "2024-01-20 10:15" },
    { action: "Processed order #12345", timestamp: "2024-01-19 16:45" },
  ],
}

export default function EmployeeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [employee] = useState(mockEmployee)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={employee.avatar || "/placeholder.svg"}
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback className="text-lg">
                {employee.firstName.charAt(0)}
                {employee.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-muted-foreground">
                {employee.role} • {employee.department}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission="User" subPermission="edit">
            <Button onClick={() => router.push(`/dashboard/employees/${employee.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="User" subPermission="delete">
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{employee.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={employee.status === "active" ? "default" : "secondary"} className="mt-1">
                {employee.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p className="font-medium">{new Date(employee.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium">{new Date(employee.lastLogin).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{employee.emergencyContact.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{employee.emergencyContact.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relationship</p>
              <p className="font-medium">{employee.emergencyContact.relationship}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employee.permissions.map((permission) => (
                <Badge key={permission} variant="outline">
                  {permission}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employee.recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-start">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
