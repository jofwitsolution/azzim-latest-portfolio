"use client";

/**
 * Dashboard chrome: collapsible sidebar (nav + brand + footer actions) and a
 * sticky header with the sidebar trigger, page title, theme toggle and a link
 * back to the public site. Wraps the routed page content in `SidebarInset`.
 */
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { RESOURCES } from "@/lib/dashboard/config";

const OVERVIEW = { title: "Overview", href: "/dashboard", icon: LayoutDashboard };
const BLOG = { title: "Blog", href: "/blog/manage", icon: Newspaper };

function pageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";
  const key = pathname.split("/")[2];
  const res = RESOURCES.find((r) => r.key === key);
  if (res) return res.title;
  if (pathname.startsWith("/blog")) return "Blog";
  return "Dashboard";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">Azzim CMS</p>
              <p className="text-muted-foreground truncate text-xs">
                Content dashboard
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === OVERVIEW.href}
                    tooltip={OVERVIEW.title}
                  >
                    <Link href={OVERVIEW.href}>
                      <OVERVIEW.icon />
                      <span>{OVERVIEW.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {RESOURCES.map((res) => {
                  const href = `/dashboard/${res.key}`;
                  return (
                    <SidebarMenuItem key={res.key}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === href}
                        tooltip={res.title}
                      >
                        <Link href={href}>
                          <res.icon />
                          <span>{res.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/blog/manage")}
                    tooltip={BLOG.title}
                  >
                    <Link href={BLOG.href}>
                      <BLOG.icon />
                      <span>{BLOG.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="View site">
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  <span>View site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <LogoutButton className="w-full group-data-[collapsible=icon]:hidden" />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <div className="bg-border h-5 w-px" />
          <h2 className="text-sm font-medium">{pageTitle(pathname)}</h2>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                View site
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
