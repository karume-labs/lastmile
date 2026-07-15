"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataToolbarProps {
  title?: string;
  description?: string;
  searchKey?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  actions?: React.ReactNode;
  gridClassName?: string;
  className?: string;
}

export const DataToolbar = ({
  title = "Filters",
  description = "Refine results",
  searchKey,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onClear,
  clearLabel = "Clear All",
  actions,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 gap-4",
  className,
}: DataToolbarProps) => {
  const hasControls = Boolean(searchKey || filters);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-base font-semibold leading-none tracking-tight">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onClear && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClear}
              className="shrink-0 h-8 px-3 font-medium"
            >
              <X className="size-3.5 mr-1.5" />
              {clearLabel}
            </Button>
          )}
        </div>
      </div>

      {hasControls && (
        <div className={cn("pt-1", gridClassName)}>
          {searchKey && (
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-8 w-full bg-background"
              />
            </div>
          )}
          {filters}
        </div>
      )}
    </div>
  );
};

