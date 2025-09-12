"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { PermissionGuard } from "@/components/common/permission-guard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockChallenges = [
  {
    id: "1",
    title: "30-Day Fitness Challenge",
    description: "Complete daily workouts for 30 consecutive days",
    type: "fitness",
    difficulty: "medium",
    points: 500,
    participants: 1250,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    createdAt: "2023-12-15",
  },
  {
    id: "2",
    title: "Reading Marathon",
    description: "Read 12 books in 3 months",
    type: "education",
    difficulty: "hard",
    points: 1000,
    participants: 850,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    createdAt: "2023-12-10",
  },
  {
    id: "3",
    title: "Daily Meditation",
    description: "Meditate for 10 minutes every day for a week",
    type: "wellness",
    difficulty: "easy",
    points: 200,
    participants: 2100,
    status: "completed",
    startDate: "2023-12-01",
    endDate: "2023-12-07",
    createdAt: "2023-11-25",
  },
]

export default function ChallengesPage() {
  const router = useRouter()
  const [challenges] = useState(mockChallenges)

  const columns = [
    {
      key: "title",
      label: "Challenge",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.type}</div>
          </div>
        </div>
      ),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      render: (value: string) => (
        <Badge variant={value === "easy" ? "secondary" : value === "medium" ? "default" : "destructive"}>{value}</Badge>
      ),
    },
    {
      key: "points",
      label: "Points",
      render: (value: number) => <div className="font-medium">{value.toLocaleString()}</div>,
    },
    {
      key: "participants",
      label: "Participants",
      render: (value: number) => <div className="font-medium">{value.toLocaleString()}</div>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : value === "completed" ? "secondary" : "outline"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
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
            <PermissionGuard permission="Challenges" subPermission="view">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/challenges/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Challenges" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/challenges/${row.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="Challenges" subPermission="delete">
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
        { value: "completed", label: "Completed" },
        { value: "draft", label: "Draft" },
      ],
    },
    {
      key: "difficulty",
      label: "Difficulty",
      options: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
    },
    {
      key: "type",
      label: "Type",
      options: [
        { value: "fitness", label: "Fitness" },
        { value: "education", label: "Education" },
        { value: "wellness", label: "Wellness" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Challenges"
        description="Manage user challenges and competitions"
        data={challenges}
        columns={columns}
        searchPlaceholder="Search challenges..."
        filters={filters}
        actions={
          <PermissionGuard permission="Challenges" subPermission="create">
            <Button onClick={() => router.push("/dashboard/challenges/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </PermissionGuard>
        }
      />
    </div>
  )
}
