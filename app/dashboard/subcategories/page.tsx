"use client";

import { use, useCallback, useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { subcategoriesAPI } from "@/lib/subcategory-api"; // <-- changed to subcategory API
import { toast } from "sonner";
import type { Subcategory } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesAPI } from "@/lib/category-api";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategories, setActiveCategories] = useState<any[]>([]);

  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [subcategoryToToggle, setSubcategoryToToggle] =
    useState<Subcategory | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchActiveCategories();
  }, []);

  const fetchActiveCategories = async () => {
    try {
      const response = await categoriesAPI.getActive();
      const categories = response.data?.results || [];
      setActiveCategories(categories); // store in state
    } catch (err) {
      console.error("Failed to fetch active categories:", err);
    }
  };

  const fetchSubcategories = useCallback(
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

        const response = await subcategoriesAPI.getByFilter(query);
        const results = response.data?.results?.[0] ?? {};
        setSubcategories(results.items || []);
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
        console.error("Failed to fetch subcategories:", err);
        toast.error(
          err.response?.data?.results?.[0]?.message ||
            "Failed to fetch subcategories"
        );
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      isActive: subcategory.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleArchive = async (subcategory: Subcategory) => {
    if (!subcategory.subcategoryId) return;
    setLoading(true);
    try {
      await subcategoriesAPI.changeStatus(subcategory.subcategoryId);
      toast.success(
        `Subcategory "${subcategory.name}" ${
          subcategory.isActive ? "deactivated" : "activated"
        } successfully!`
      );
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub.subcategoryId === subcategory.subcategoryId
            ? { ...sub, isActive: !sub.isActive }
            : sub
        )
      );
      setIsArchiveDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.results?.[0]?.message ||
          "Failed to change subcategory status"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "name", label: "Subcategory Name", align: "left" },
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
      render: (_: any, row: Subcategory) => (
        <div className="flex items-center gap-2 justify-center">
          <PermissionGuard permission="Subcategory" subPermission="edit">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
              <Edit className="h-4 w-4" />
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="Subcategory" subPermission="delete">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsArchiveDialogOpen(true);
                setSubcategoryToToggle(row);
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
    { 
      key: "categoryId",
      label: "Category",
      options: activeCategories.map(cat => ({ value: String(cat.categoryId), label: cat.name }))
    }
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Subcategories"
        description="Manage your product subcategories"
        data={subcategories}
        columns={columns}
        serverSide={true}
        page={page}
        pageSize={pageSize}
        total={total}
        filters={filters}
        searchPlaceholder="Search subcategories..."
        loading={loading}
        actions={
          <PermissionGuard permission="Subcategory" subPermission="create">
            <Dialog
              open={isEditDialogOpen}
              onOpenChange={(v) => {
                if (!v) setEditingSubcategory(null);
                setIsEditDialogOpen(v);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingSubcategory(null);
                    setFormData({ name: "", description: "", isActive: true });
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subcategory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      if (editingSubcategory?.subcategoryId) {
                        await subcategoriesAPI.update(
                          editingSubcategory.subcategoryId,
                          formData
                        );
                        toast.success("Subcategory updated successfully!");
                        setSubcategories((prev) =>
                          prev.map((sub) =>
                            sub.subcategoryId ===
                            editingSubcategory?.subcategoryId
                              ? { ...sub, ...formData }
                              : sub
                          )
                        );
                      } else {
                        await subcategoriesAPI.create(formData);
                        toast.success("Subcategory created successfully!");
                        setSubcategories((prev) => [formData, ...prev]);
                      }
                    } catch (err: any) {
                      console.error(err);
                      toast.error(
                        err.response?.data?.results?.[0]?.message ||
                          "Failed to save subcategory"
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
                      {editingSubcategory
                        ? "Edit Subcategory"
                        : "Add New Subcategory"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {editingSubcategory
                        ? "Update the subcategory information below."
                        : "Create a new subcategory for your products."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <label htmlFor="name">Subcategory Name</label>
                      <Input
                        id="name"
                        placeholder="Enter subcategory name"
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
                        placeholder="Enter subcategory description"
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

                    <div className="grid gap-2">
                      <label htmlFor="categoryId">Parent Category</label>
                      <Select
                        // value={formData.categoryId ? String(formData.categoryId) : undefined}
                        // onValueChange={(value) => setValue("categoryId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* {errors.categoryId && (
                        <p className="text-sm text-destructive">
                          {errors.categoryId.message}
                        </p>
                      )} */}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="success"
                      type="submit"
                      className="w-full"
                      loading={loading}
                    >
                      {editingSubcategory ? "Update" : "Create"}
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
                    {subcategoryToToggle?.isActive
                      ? "Deactivate Subcategory"
                      : "Activate Subcategory"}
                  </DialogTitle>
                  <DialogDescription>
                    {subcategoryToToggle?.isActive
                      ? `Are you sure you want to deactivate "${subcategoryToToggle?.name}"?`
                      : `Do you want to activate "${subcategoryToToggle?.name}"?`}
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
                      subcategoryToToggle?.isActive ? "danger" : "success"
                    }
                    onClick={() => handleArchive(subcategoryToToggle!)}
                    loadingText={
                      subcategoryToToggle?.isActive ? "deactivate" : "activate"
                    }
                    loading={loading}
                  >
                    {subcategoryToToggle?.isActive ? "Deactivate" : "Activate"}
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
          fetchSubcategories({ page: p, pageSize: ps, search, filters: f });
        }}
      />
    </div>
  );
}
