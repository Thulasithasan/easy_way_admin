// components/ui/toaster.tsx
"use client"

import { Toaster as Sonner } from "sonner"

export function CustomToaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      theme="system"
      closeButton
    />
  )
}
