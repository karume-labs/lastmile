"use client";

import type { ColumnFiltersState, SortingState, Updater } from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useCallback, useMemo, useState } from "react";

interface UseDataTablePaginationOptions {
  defaultPageSize?: number;
  initialSort?: SortingState;
}

export const useDataTablePagination = (options: UseDataTablePaginationOptions = {}) => {
  const { defaultPageSize = 10, initialSort = [] } = options;

  const [pageIndex, setPageIndex] = useQueryState("page", parseAsInteger.withDefault(0));

  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(defaultPageSize),
  );

  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));

  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const state = useMemo(
    () => ({
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? defaultPageSize,
      },
    }),
    [sorting, columnFilters, rowSelection, pageIndex, pageSize, defaultPageSize],
  );

  const handlers = useMemo(
    () => ({
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onRowSelectionChange: setRowSelection,
      onPaginationChange: (updater: Updater<{ pageIndex: number; pageSize: number }>) => {
        const nextState =
          typeof updater === "function"
            ? updater({ pageIndex: pageIndex ?? 0, pageSize: pageSize ?? defaultPageSize })
            : updater;
        setPageIndex(nextState.pageIndex);
        setPageSize(nextState.pageSize);
      },
    }),
    [pageIndex, pageSize, defaultPageSize, setPageIndex, setPageSize],
  );

  const resetPagination = useCallback(() => {
    setPageIndex(0);
  }, [setPageIndex]);

  const resetSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setColumnFilters([]);
    setSorting(initialSort);
  }, [setSearch, initialSort]);

  return {
    state,
    handlers,
    resetPagination,
    resetSelection,
    search: search ?? "",
    setSearch,
    clearFilters,
    selectedRowCount: Object.keys(rowSelection).length,
  };
};
