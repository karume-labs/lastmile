"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TableMenuAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
  requiresConfirm?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

interface TableMenuActionsProps {
  actions: TableMenuAction[];
}

export const TableMenuActions = ({ actions }: TableMenuActionsProps) => {
  const [alertAction, setAlertAction] = useState<TableMenuAction | null>(null);
  const [confirmAction, setConfirmAction] = useState<TableMenuAction | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="size-8 p-0" />}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <div key={action.label}>
              {index > 0 && action.destructive && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.destructive) {
                    setAlertAction(action);
                  } else if (action.requiresConfirm) {
                    setConfirmAction(action);
                  } else {
                    action.onClick();
                  }
                }}
                className={action.destructive ? "text-destructive" : ""}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={!!alertAction} onOpenChange={(open) => !open && setAlertAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertAction?.confirmTitle || "Are you absolutely sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction?.confirmDescription || (
                <>
                  This action cannot be undone. You are about to perform a destructive action:{" "}
                  <strong>{alertAction?.label}</strong>.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                alertAction?.onClick();
                setAlertAction(null);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.confirmTitle || `Confirm ${confirmAction?.label}`}</DialogTitle>
            <DialogDescription>
              {confirmAction?.confirmDescription || `Are you sure you want to perform: ${confirmAction?.label}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmAction?.onClick();
                setConfirmAction(null);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
