import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  LayoutTemplate,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import HokoriMark from "@/components/hokori-mark";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/app/store";
import { useAppSelector } from "@/lib/hooks";
import { logout } from "@/models/auth/features/authSlice";
import { useNavigate } from "react-router";

const items = [
  { name: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { name: "Templates", icon: LayoutTemplate, url: "/templates" },
  { name: "Insights", icon: BarChart3, url: "/insights" },
  { name: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogOut = async () => {
    await dispatch(logout()).unwrap();
    navigate("/auth/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-14 justify-center px-3">
        <Link to="/dashboard" className="flex items-center">
          <HokoriMark size="md" />
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-display tracking-wider text-[11px] uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.name}
                      className="relative data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[2px] data-[active=true]:before:bg-primary data-[active=true]:before:rounded-r"
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-8">
            <AvatarImage src="" alt={user?.firstName ?? ""} />
            <AvatarFallback className="text-[11px]">
              {(user?.firstName?.[0] ?? "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName ?? "Guest"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleLogOut}
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
