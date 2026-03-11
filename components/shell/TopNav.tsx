"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Eye,
  Bot,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  {
    label: "Shemak Framework",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Pan HR",
    href: "/pan-hr",
    icon: Users,
    description: "주기적 적정 인력 관리",
  },
  {
    label: "Optic View",
    href: "/optic-view",
    icon: Eye,
    description: "몰입도 예측 및 관리",
  },
  {
    label: "HR Agents",
    href: "/agents",
    icon: Bot,
    description: "AI Agent 기반 HR 운영",
  },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-16 gap-1">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 mr-8 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              Shemak Framework
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - InsightGroup branding */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden lg:block">
              InsightGroup HR AI Demo
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">IG</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
