import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DropzoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  options?: DropzoneOptions;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, options, icon, title, subtitle, ...props }, ref) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone(options);

    return (
      <div
        ref={ref}
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-primary/50",
          className
        )}
        {...props}
      >
        <input {...getInputProps()} />
        {icon || <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />}
        <p className="text-sm font-medium mb-1">{title || "Drag and drop your files here"}</p>
        {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
        <Button variant="outline" type="button" className="pointer-events-none">
          Browse Files
        </Button>
      </div>
    );
  }
);
Dropzone.displayName = "Dropzone";
