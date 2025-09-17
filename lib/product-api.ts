import api from "./api"

export interface ProductCreateData {
  name: string
  description: string
  categoryId: string
  subCategoryId: string
  price: number
  sku: string
  status: "active" | "inactive"
}

export interface ProductUpdateData extends ProductCreateData {
  id: string
}

/**
 * Create product without images
 */
export const createProduct = async (productData: ProductCreateData) => {
  try {
    console.log("Creating product:", productData)
    const response = await api.post("/v1/products/create", productData)

    return {
      success: true,
      productId: response.data.id,
      message: "Product created successfully",
      data: response.data,
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("Invalid product data. Please check all fields.")
    } else if (error.response?.status === 409) {
      throw new Error("Product with this SKU already exists.")
    } else {
      throw new Error("Failed to create product. Please try again.")
    }
  }
}

/**
 * Update product without images
 */
export const updateProduct = async (productData: ProductUpdateData) => {
  try {
    const { id, ...updateData } = productData
    console.log("Updating product:", id)

    const response = await api.put(`/v1/products/${id}`, updateData)

    return {
      success: true,
      productId: id,
      message: "Product updated successfully",
      data: response.data,
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Product not found.")
    } else if (error.response?.status === 409) {
      throw new Error("Product with this SKU already exists.")
    } else {
      throw new Error("Failed to update product. Please try again.")
    }
  }
}

/**
 * Upload images to existing product
 */
export const uploadProductImages = async (productId: string, images: File[]) => {
  try {
    if (images.length === 0) {
      throw new Error("No images selected for upload.")
    }

    console.log(`Uploading ${images.length} images for product ${productId}`)

    const formData = new FormData()
    images.forEach((file) => {
      formData.append("images", file)
    })

    await api.put(`/v1/products/${productId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return {
      success: true,
      message: `Successfully uploaded ${images.length} image(s)`,
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Product not found. Please refresh and try again.")
    } else if (error.response?.status === 413) {
      throw new Error("Images are too large. Please use smaller images (max 5MB each).")
    } else if (error.response?.status === 415) {
      throw new Error("Unsupported image format. Please use JPG, PNG, or WebP.")
    } else if (error.response?.status === 400) {
      throw new Error("Invalid images. Please check your files and try again.")
    } else {
      throw new Error("Failed to upload images. Please try again.")
    }
  }
}

/**
 * Delete specific product images
 */
export const deleteProductImages = async (productId: string, imageUrls: string[]) => {
  try {
    await api.delete(`/v1/products/${productId}/images`, {
      data: { imageUrls },
    })
    return {
      success: true,
      message: `Successfully deleted ${imageUrls.length} image(s)`,
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Product or images not found.")
    } else {
      throw new Error("Failed to delete images. Please try again.")
    }
  }
}

/**
 * Get product images
 */
export const getProductImages = async (productId: string) => {
  try {
    const response = await api.get(`/v1/products/${productId}/images`)
    return {
      success: true,
      images: response.data.images || [],
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Product not found.")
    } else {
      throw new Error("Failed to load product images.")
    }
  }
}
