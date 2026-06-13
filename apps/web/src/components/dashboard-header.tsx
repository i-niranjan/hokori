import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search } from "lucide-react";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { CommandPalette, useCommandPalette } from "@/components/command-palette";
import { buildCrumbs } from "@/lib/breadcrumbs";
import { useAppDispatch } from "@/app/store";
import { useAppSelector } from "@/lib/hooks";
import { logout } from "@/models/auth/features/authSlice";

export function DashboardHeader() {
  const { pathname } = useLocation();
  const crumbs = buildCrumbs(pathname);
  const { open, setOpen } = useCommandPalette();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogOut = async () => {
    await dispatch(logout()).unwrap();
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            crumbs.map((c) => (
              <Fragment key={c.href}>
                <BreadcrumbItem>
                  {c.isLast ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={c.href}>{c.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!c.isLast && <BreadcrumbSeparator />}
              </Fragment>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 gap-2 text-muted-foreground sm:inline-flex"
          onClick={() => setOpen(true)}
        >
          <Search className="size-3.5" />
          <span className="text-xs">Search</span>
          <kbd className="ml-2 hidden rounded border bg-muted px-1.5 font-mono text-[10px] leading-none text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setOpen(true)}
          aria-label="Search"
        >
          <Search className="size-4" />
        </Button>
        <ModeToggle />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="rounded-full outline-none ring-ring/50 transition-shadow hover:ring-2 focus-visible:ring-2"
            >
              <Avatar className="size-8">
                <AvatarImage src="" alt={user?.firstName ?? ""} />
                <AvatarFallback className="text-[11px]">
                  {(user?.firstName?.[0] ?? "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {[user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Guest"}
                </span>
                <span
                  className="truncate text-xs text-muted-foreground"
                  title={user?.email ?? undefined}
                >
                  {user?.email ?? ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              <IconUser className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <IconSettings className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogOut}>
              <IconLogout className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={open} setOpen={setOpen} />
    </header>
  );
}
