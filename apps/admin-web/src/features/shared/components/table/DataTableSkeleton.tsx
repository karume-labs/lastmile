import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export const DataTableSkeleton = ({ columnCount, rowCount = 5 }: DataTableSkeletonProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
              <TableHead key={`skel-header-${i}`}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
            <TableRow key={`skel-row-${rowIndex}`}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
                <TableCell key={`skel-cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
