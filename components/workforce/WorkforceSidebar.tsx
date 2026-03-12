"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Building2,
  Users,
  UserRound,
  AlertTriangle,
  Activity,
  TrendingUp,
} from "lucide-react";

const sidebarItems = [
  { label: "전체 개요", href: "/pan-hr/workforce", icon: LayoutGrid, exact: true },
  { label: "담당별 분석", href: "/pan-hr/workforce/divisions", icon: Building2 },
  { label: "팀별 분석", href: "/pan-hr/workforce/teams", icon: Users },
  { label: "그룹별 분석", href: "/pan-hr/workforce/groups", icon: UserRound },
  { label: "근무 불균형", href: "/pan-hr/workforce/imbalance", icon: AlertTriangle },
  { label: "근무 패턴분석", href: "/pan-hr/workforce/patterns", icon: Activity },
  { label: "트렌드 분석", href: "/pan-hr/workforce/trends", icon: TrendingUp },
];

export function WorkforceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-sm font-bold text-neutral-900 mb-1">인력관리</h2>
        <p className="text-xs text-neutral-500 mb-4">근무현황 분석</p>
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
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
