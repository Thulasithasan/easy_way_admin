"use client"

import { useState, useCallback } from "react"

export interface ImageFile {
  file: File
  preview: string
  id: string
}

export const useImageUpload = (maxImages = 5) => {
  const [images, setImages] = useState<ImageFile[]>([])
  const [uploading, setUploading] = useState(false)

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const newImages: ImageFile[] = []

      fileArray.forEach((file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.warn(`Skipping non-image file: ${file.name}`)
          return
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          console.warn(`Skipping large file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
          return
        }

        if (images.length + newImages.length < maxImages) {
          const preview = URL.createObjectURL(file)
          newImages.push({
            file,
            preview,
            id: `${Date.now()}-${Math.random()}`,
          })
        }
      })

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages])
      }
    },
    [images.length, maxImages],
  )

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id)
      // Clean up object URL to prevent memory leaks
      const removed = prev.find((img) => img.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }, [])

  const clearImages = useCallback(() => {
    // Clean up all object URLs
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
  }, [images])

  const getFiles = useCallback(() => {
    return images.map((img) => img.file)
  }, [images])

  return {
    images,
    addImages,
    removeImage,
    clearImages,
    getFiles,
    uploading,
    setUploading,
    canAddMore: images.length < maxImages,
  }
}
