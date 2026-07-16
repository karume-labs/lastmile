"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/features/auth/services/mutations";
import { useSession } from "@/features/auth/services/queries";

export const SidebarUserNav = () => {
  const { data: session } = useSession();
  const signOutMutation = useSignOut();

  const userRole = session?.user?.role;

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted group-data-[collapsible=icon]:justify-center"
          />
        }
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback className="rounded-none text-xs font-semibold">
              {session?.user?.name?.slice(0, 2)?.toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden flex-1 text-left">
          <span className="text-sm font-semibold text-foreground truncate leading-tight">
            {session?.user?.name || "Administrator"}
          </span>
          <span className="text-xs text-muted-foreground truncate leading-tight">
            {session?.user?.email}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
        align="end"
        side="right"
        sideOffset={12}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-0">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted overflow-hidden">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                  <AvatarFallback className="rounded-none text-xs font-semibold">
                    {session?.user?.name?.slice(0, 2)?.toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col flex-1 leading-none overflow-hidden text-left">
                <span className="font-semibold truncate">
                  {session?.user?.name || "Administrator"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Role
          </span>
          <p className="text-sm font-semibold mt-0.5 capitalize">{userRole}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={handleSignOut}
          disabled={signOutMutation.isPending}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
