"use client";

import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  status: "danger" | "warning" | "success" | "info";
}

const statusStyles = {
  danger: {
    border: "border-l-red-500",
    bg: "bg-gradient-to-br from-red-50 to-white",
  },
  warning: {
    border: "border-l-amber-500",
    bg: "bg-gradient-to-br from-amber-50 to-white",
  },
  success: {
    border: "border-l-green-500",
    bg: "bg-gradient-to-br from-green-50 to-white",
  },
  info: {
    border: "border-l-blue-500",
    bg: "bg-gradient-to-br from-blue-50 to-white",
  },
};

export function KpiCard({ title, value, subtitle, status }: KpiCardProps) {
  const styles = statusStyles[status];

  return (
    <div
      className={cn(
        "rounded-lg p-4 border-2 border-gray-300 border-l-4 shadow-sm",
        styles.border,
        styles.bg
      )}
    >
      <p className="text-sm text-neutral-600">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
