"use client";

import {
  AlertTriangle,
  ClipboardList,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarUserNav } from "@/features/shared/components/SidebarUserNav";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard, id: "tour-dashboard" },
  { title: "Deliveries", url: "/admin/deliveries", icon: Send, id: "tour-deliveries" },
  { title: "Programmes", url: "/admin/programmes", icon: FolderOpen, id: "tour-programmes" },
  {
    title: "Stagnant Funds",
    url: "/admin/stagnant-funds",
    icon: AlertTriangle,
    id: "tour-stagnant-funds",
  },
  { title: "Audits", url: "/admin/audits", icon: ClipboardList, id: "tour-audits" },
  { title: "Proxies", url: "/admin/proxies", icon: Users, id: "tour-proxies" },
  { title: "Participants", url: "/admin/participants", icon: Users, id: "tour-participants" },
  { title: "Tours & Help", url: "/admin/tours", icon: HelpCircle, id: "tour-help" },
  { title: "SMS", url: "/admin/sms", icon: MessageSquare, id: "tour-sms" },
  { title: "Staff", url: "/admin/staff", icon: Users, id: "tour-staff" },
] as const;

const AppSidebar = () => {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-border">
      <SidebarHeader className="border-b border-border/50">
        <div
          className="flex flex-col justify-center gap-0.5 py-6 transition-all duration-200 px-6 group-data-[collapsible=icon]:px-2 items-start group-data-[collapsible=icon]:items-center h-20"
          style={{}}
        >
          <span
            className={cn(
              "text-lg font-semibold tracking-tight",
              isCollapsed && !isMobile ? "hidden" : "block",
            )}
          >
            Last Mile
          </span>
          <span
            className={cn(
              "text-lg font-bold tracking-tight text-primary",
              isCollapsed && !isMobile ? "block" : "hidden",
            )}
          >
            LM
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.url} id={item.id}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      size="lg"
                      className={cn(
                        "transition-all duration-300 py-7 px-5 group-data-[collapsible=icon]:p-2 rounded-2xl group",
                        isActive
                          ? "bg-primary/10 hover:bg-primary/10 dark:bg-primary/20 dark:hover:bg-primary/20 text-primary hover:text-primary font-semibold"
                          : "hover:bg-transparent text-muted-foreground",
                      )}
                      render={
                        <Link
                          href={item.url}
                          className="flex items-center w-full gap-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0!"
                        />
                      }
                    >
                      <item.icon
                        className={cn(
                          "size-6 transition-transform duration-300 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarUserNav />
      </SidebarFooter>
    </Sidebar>
  );
};

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background transition-colors">
          <div className="max-w-6xl mx-auto space-y-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
