"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Table2,
  LayoutGrid,
  Search,
  Car,
  Activity,
  BarChart2,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "BFM 구조도", href: "/pan-hr/skills/matrix", icon: Table2 },
  { label: "BFM 탐색", href: "/pan-hr/skills/browser", icon: LayoutGrid },
  { label: "스킬 검색", href: "/pan-hr/skills/search", icon: Search },
];

const SECONDARY_NAV_ITEMS = [
  { label: "Automotive R&D BFM", href: "/pan-hr/skills/rd-bfm", icon: Car },
  { label: "R&D 역량대시보드", href: "/pan-hr/skills/rd-dashboard", icon: Activity },
  { label: "Staffing 대시보드", href: "/pan-hr/skills/staffing", icon: BarChart2 },
];

export function SkillsSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/pan-hr/skills") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-sm font-bold text-neutral-900 mb-1">스킬관리</h2>
        <p className="text-xs text-neutral-500 mb-4">BFM 스킬 탐색 시스템</p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="my-3 border-t border-neutral-200" />

          {SECONDARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
