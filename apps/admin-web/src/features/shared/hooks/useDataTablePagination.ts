"use client";

import { useState, useMemo, useCallback } from "react";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";

interface UseDataTablePaginationOptions {
  pageSize?: number;
  initialSort?: SortingState;
}

export const useDataTablePagination = (
  options: UseDataTablePaginationOptions = {},
) => {
  const { pageSize = 10, initialSort = [] } = options;

  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const state = useMemo(
    () => ({
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    }),
    [sorting, columnFilters, rowSelection, pagination],
  );

  const handlers = useMemo(
    () => ({
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
    }),
    [],
  );

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  return {
    state,
    handlers,
    resetPagination,
    resetSelection,
    selectedRowCount: Object.keys(rowSelection).length,
  };
};
