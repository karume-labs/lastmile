"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataToolbarProps {
  searchKey?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
}

export const DataToolbar = ({
  searchKey,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
}: DataToolbarProps) => {
  return (
    <div className="flex items-center gap-2">
      {searchKey && (
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-8"
          />
        </div>
      )}
      {filters}
    </div>
  );
};
