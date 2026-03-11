"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface CaseCardProps {
  href: string;
  client: string;
  title: string;
  description: string;
  icon: LucideIcon;
  metrics: { label: string; value: string }[];
  tags: { text: string; variant: "danger" | "warning" | "success" | "info" | "default" }[];
  accentColor: string;
}

export function CaseCard({
  href,
  client,
  title,
  description,
  icon: Icon,
  metrics,
  tags,
  accentColor,
}: CaseCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={cn(
        "rounded-lg p-6 border-2 border-gray-200 shadow-sm",
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        "bg-gradient-to-br from-white to-gray-50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {title} <span className="text-sm font-normal text-gray-400">({client})</span>
          </h3>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            accentColor
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-lg font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-500">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Badge key={t.text} variant={t.variant}>
            {t.text}
          </Badge>
        ))}
      </div>
    </div>
  );
}
