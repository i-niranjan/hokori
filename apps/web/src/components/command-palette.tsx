import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  LayoutTemplate,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAppDispatch } from "@/app/store";
import { logout } from "@/models/auth/features/authSlice";

const navItems = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Templates", url: "/templates", icon: LayoutTemplate },
  { label: "Insights", url: "/insights", icon: BarChart3 },
  { label: "Settings", url: "/settings", icon: Settings },
];

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => run(() => navigate(item.url))}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() =>
              run(async () => {
                await dispatch(logout()).unwrap();
                navigate("/auth/login");
              })
            }
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPaletteShortcut(setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useCommandPaletteShortcut(setOpen);
  return { open, setOpen };
}
