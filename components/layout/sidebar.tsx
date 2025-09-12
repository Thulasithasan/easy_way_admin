"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Boxes,
  TrendingUp,
  Menu,
  ChevronDown,
  ChevronRight,
  Target,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuthStore } from "@/lib/store"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: null, // Always visible
  },
  {
    name: "User Management",
    icon: Users,
    permission: "User",
    children: [
      { name: "Roles", href: "/dashboard/roles", permission: "User" },
      { name: "Permissions", href: "/dashboard/permissions", permission: "User" },
      { name: "Employees", href: "/dashboard/employees", permission: "User" },
    ],
  },
  {
    name: "Challenges",
    href: "/dashboard/challenges",
    icon: Target,
    permission: "Challenges",
  },
  {
    name: "Catalog Management",
    icon: Package,
    permission: "Product",
    children: [
      { name: "Categories", href: "/dashboard/categories", permission: "Product" },
      { name: "Subcategories", href: "/dashboard/subcategories", permission: "Product" },
      { name: "Products", href: "/dashboard/products", permission: "Product" },
    ],
  },
  {
    name: "Inventory",
    icon: Boxes,
    permission: "Inventory",
    children: [
      { name: "Purchase Bills", href: "/dashboard/purchase-bills", permission: "Inventory" },
      { name: "Stock Income", href: "/dashboard/stock-income", permission: "Inventory" },
      { name: "Stock Management", href: "/dashboard/stock-management", permission: "Inventory" },
      { name: "Stock Outgoing", href: "/dashboard/stock-outgoing", permission: "Inventory" },
    ],
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    permission: "Order",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: TrendingUp,
    permission: "Report",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    permission: null, // Always visible
  },
]

function SidebarContent() {
  const pathname = usePathname()
  const { hasPermission, isSuperAdmin } = useAuthStore()
  const [openItems, setOpenItems] = useState<string[]>(["User Management", "Catalog Management"])

  const toggleItem = (name: string) => {
    setOpenItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const isItemVisible = (item: any) => {
    if (!item.permission) return true // Always show items without permission requirement
    if (isSuperAdmin()) return true // Super admin sees everything
    // return hasPermission(item.permission)
    return true
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
          <Package className="h-6 w-6 text-primary" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {navigation.filter(isItemVisible).map((item) => {
            if (item.children) {
              const visibleChildren = item.children.filter(isItemVisible)
              if (visibleChildren.length === 0) return null

              const isOpen = openItems.includes(item.name)
              return (
                <Collapsible key={item.name} open={isOpen} onOpenChange={() => toggleItem(item.name)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-3">
                      <item.icon className="h-4 w-4" />
                      {item.name}
                      {isOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-6">
                    {visibleChildren.map((child) => (
                      <Button
                        key={child.href}
                        variant={pathname === child.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href={child.href}>{child.name}</Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            return (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 px-3"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SidebarContent />
      </div>
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}
