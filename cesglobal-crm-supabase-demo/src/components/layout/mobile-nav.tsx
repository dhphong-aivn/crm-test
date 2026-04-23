"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", icon: "dashboard", label: "Home" },
  { href: "/leads", icon: "group", label: "Leads" },
  { href: "/calendar", icon: "calendar_today", label: "Events" },
  { href: "/reports", icon: "analytics", label: "Reports" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-parchment border-t border-border-cream flex justify-around items-center py-3 z-[100]">
      {ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              active ? "text-terracotta" : "text-olive-gray",
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined",
                active && "filled",
              )}
            >
              {item.icon}
            </span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
