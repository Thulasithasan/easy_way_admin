"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tr } from "zod/v4/locales";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  description?: string;
  data: any[];
  columns: Column[];
  searchPlaceholder?: string;
  onRowClick?: (row: any) => void;
  actions?: React.ReactNode;
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  // server-side props:
  serverSide?: boolean;
  page?: number;
  pageSize?: number;
  total?: number; // total items in server DB (for pagination)
  onRequestData?: (params: {
    page: number;
    pageSize: number;
    search?: string;
    filters?: Record<string, string>;
  }) => void;
  loading?: boolean;
}

export function DataTable({
  title,
  description,
  data,
  columns,
  searchPlaceholder = "Search...",
  onRowClick,
  actions,
  filters = [],
  // server props
  serverSide = false,
  page = 1,
  pageSize = 5,
  total = 0,
  onRequestData,
  loading = true,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(page || 1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(pageSize || 5);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  // Sync controlled page/pageSize when serverSide
  useEffect(() => {
    if (serverSide) {
      setCurrentPage(page || 1);
      setCurrentPageSize(pageSize || 5);
    }
  }, [page, pageSize, serverSide]);

  // When in server-side mode: call parent (debounce search)
  useEffect(() => {
    if (!serverSide) return;
    const payload = {
      page: currentPage,
      pageSize: currentPageSize,
      search: searchTerm,
      filters: activeFilters,
    };
    const t = setTimeout(() => {
      onRequestData?.(payload);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    serverSide,
    currentPage,
    currentPageSize,
    searchTerm,
    JSON.stringify(activeFilters),
  ]);

  // Client-side filtering / pagination (fallback when not server-side)
  const clientFiltered = React.useMemo(() => {
    if (serverSide) return data; // in server mode data is already page items
    const searchLower = searchTerm.toLowerCase();
    return data.filter((item) => {
      const matchesSearch = Object.values(item).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(searchLower)
      );
      const matchesFilters = Object.entries(activeFilters).every(
        ([key, value]) => {
          if (!value || value === "all") return true;
          return (
            String((item as any)[key]).toLowerCase() === value.toLowerCase()
          );
        }
      );
      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, activeFilters, serverSide]);

  const totalResults = serverSide ? total : clientFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / currentPageSize));

  const paginatedData = serverSide
    ? data // parent should pass the already-paginated page items
    : clientFiltered.slice(
        (currentPage - 1) * currentPageSize,
        (currentPage - 1) * currentPageSize + currentPageSize
      );

  // Handlers
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = Number(newPageSize);
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex-shrink-0">{actions}</div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={activeFilters[filter.key] || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">#</TableHead>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`whitespace-nowrap ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: currentPageSize }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse">
                      <TableCell className="py-3">
                        <div className="h-10 bg-gray-200 rounded w-6"></div>
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell className="py-3" key={col.key}>
                          <div className="h-10 bg-gray-200 rounded w-full"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground">No data found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
                    <TableRow
                      key={(row.id ?? row.categoryId) || index}
                      className={
                        onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                      }
                      onClick={() => onRowClick?.(row)}
                    >
                      <TableCell className="py-3">
                        {(currentPage - 1) * currentPageSize + index + 1}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={`py-3 ${
                            column.align === "center"
                              ? "text-center"
                              : column.align === "right"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {column.render
                            ? column.render((row as any)[column.key], row)
                            : (row as any)[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {Math.min((currentPage - 1) * currentPageSize + 1, totalResults)} to{" "}
            {Math.min(currentPage * currentPageSize, totalResults)} of{" "}
            {totalResults} results
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={currentPageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage(1);
                }}
                disabled={currentPage === 1}
                className="hidden sm:flex"
              >
                First
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <span className="text-sm font-medium px-2">
                  {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex"
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
