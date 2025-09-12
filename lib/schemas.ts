import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const subCategorySchema = z.object({
  name: z.string().min(2, "Subcategory name must be at least 2 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().min(1, "Please select a subcategory"),
  price: z.number().min(0, "Price must be positive"),
  sku: z.string().min(1, "SKU is required"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type SubCategoryFormData = z.infer<typeof subCategorySchema>
export type ProductFormData = z.infer<typeof productSchema>
