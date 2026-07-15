"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataToolbarProps {
  searchKey?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onClear?: () => void;
}

export const DataToolbar = ({
  searchKey,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onClear,
}: DataToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {searchKey && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
        </div>
        {onClear && (
          <Button variant="outline" onClick={onClear} className="shrink-0 h-9">
            <X className="size-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {filters && (
        <>
          <div className="h-px bg-border w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{filters}</div>
        </>
      )}
    </div>
  );
};
