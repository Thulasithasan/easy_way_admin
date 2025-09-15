"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Edit, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/data-table";
import { PermissionGuard } from "@/components/common/permission-guard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categoriesAPI } from "@/lib/category-api";
import { toast } from "sonner";
import type { Category } from "@/lib/store";
import { set } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { de } from "zod/v4/locales";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const fetchCategories = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      filters?: Record<string, string>;
    }) => {
      setLoading(true);
      try {
        const p = params?.page ?? page;
        const s = params?.pageSize ?? pageSize;
        const query: any = { pageNumber: p, pageSize: s };

        if (params?.search) query.searchTerm = params.search;
        if (params?.filters?.isActive && params?.filters?.isActive !== "all") {
          query.isActive = params.filters.isActive === "true";
        }

        const response = await categoriesAPI.getByFilter(query);
        const results = response.data?.results?.[0] ?? {};
        setCategories(results.items || []);
        // detect total from common keys your API might return
        const totalCount =
          results.meta?.total ??
          results.totalCount ??
          results.total ??
          results.count ??
          results.totalItems ??
          0;
        setTotal(Number(totalCount));
        setPage(p);
        setPageSize(s);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        toast.error(
          err.response?.data?.results?.[0]?.message ||
            "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setIsEditDialogOpen(true);
  };

  // Archive
  const handleArchive = async (category: Category) => {
    if (!category.categoryId) return;
    setLoading(true);
    try {
      await categoriesAPI.changeStatus(category.categoryId);
      toast.success(
        `Category "${category.name}" ${
          category.isActive ? "deactivated" : "activated"
        } successfully!`
      );
      // re-fetch current page
      setCategories((prev) =>
        prev.map((cat) =>
          cat.categoryId === category.categoryId
            ? { ...cat, isActive: !cat.isActive }
            : cat
        )
      );
      setIsArchiveDialogOpen(false);
    } catch (err: any) {
      toast.error;
      console.error(err);
      toast.error(
        err.response?.data?.results?.[0]?.message ||
          "Failed to change category status"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "name", label: "Category Name", align: "left" },
    { key: "description", label: "Description", align: "left" },
    {
      key: "isActive",
      label: "Status",
      align: "left",
      render: (value: boolean) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "center",
      render: (_: any, row: Category) => (
        <div className="flex items-center gap-2 justify-center">
          <PermissionGuard permission="Category" subPermission="edit">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
              <Edit className="h-4 w-4" />
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="Category" subPermission="delete">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsArchiveDialogOpen(true);
                setCategoryToToggle(row);
              }}
            >
              <Archive
                className={`h-4 w-4 ${
                  row.isActive ? "text-red-600" : "text-green-600"
                }`}
              />
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: "isActive",
      label: "Status",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Archive" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Categories"
        description="Manage your product categories"
        data={categories}
        columns={columns}
        serverSide={true}
        page={page}
        pageSize={pageSize}
        total={total}
        filters={filters}
        searchPlaceholder="Search categories..."
        loading={loading}
        actions={
          <PermissionGuard permission="Category" subPermission="create">
            <Dialog
              open={isEditDialogOpen}
              onOpenChange={(v) => {
                if (!v) setEditingCategory(null);
                setIsEditDialogOpen(v);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: "", description: "", isActive: true });
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      if (editingCategory?.categoryId) {
                        await categoriesAPI.update(
                          editingCategory.categoryId,
                          formData
                        );
                        toast.success("Category updated successfully!");
                        setCategories((prev) =>
                          prev.map((cat) =>
                            cat.categoryId === editingCategory?.categoryId
                              ? { ...cat, ...formData }
                              : cat
                          )
                        );
                      } else {
                        await categoriesAPI.create(formData);
                        toast.success("Category created successfully!");
                        setCategories((prev) => [formData, ...prev]);
                      }
                    } catch (err: any) {
                      console.error(err);
                      toast.error(
                        err.response?.data?.results?.[0]?.message ||
                          "Failed to save category"
                      );
                    } finally {
                      setLoading(false);
                      setIsEditDialogOpen(false);
                    }
                  }}
                  className="space-y-6"
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {editingCategory
                        ? "Update the category information below."
                        : "Create a new category for your products."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <label htmlFor="name">Category Name</label>
                      <Input
                        id="name"
                        placeholder="Enter category name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="description">Description</label>
                      <Textarea
                        id="description"
                        placeholder="Enter category description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="success" type="submit" className="w-full" loading={loading}>
                      {editingCategory ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isArchiveDialogOpen}
              onOpenChange={setIsArchiveDialogOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {categoryToToggle?.isActive
                      ? "Deactivate Category"
                      : "Activate Category"}
                  </DialogTitle>
                  <DialogDescription>
                    {categoryToToggle?.isActive
                      ? `Are you sure you want to deactivate "${categoryToToggle?.name}"?`
                      : `Do you want to activate "${categoryToToggle?.name}"?`}
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsArchiveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={
                      categoryToToggle?.isActive ? "danger" : "success"
                    }
                    onClick={() => handleArchive(categoryToToggle!)}
                    loadingText={
                      categoryToToggle?.isActive ? "deactivate" : "activate"
                    }
                    loading={loading}
                  >
                    {categoryToToggle?.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        }
        onRequestData={({
          page: p = 1,
          pageSize: ps = 5,
          search,
          filters: f,
        }) => {
          setPage(p);
          setPageSize(ps);
          fetchCategories({ page: p, pageSize: ps, search, filters: f });
        }}
      />
    </div>
  );
}
