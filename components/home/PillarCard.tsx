"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface ModuleItem {
  label: string;
  detail: string;
}

interface PillarCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  color: "blue" | "amber" | "indigo";
  hiItems: ModuleItem[];
  aiItems: ModuleItem[];
  index: number;
}

const colorMap = {
  blue: {
    border: "border-blue-600",
    borderTop: "border-t-blue-700",
    headerBg: "bg-blue-600",
    headerText: "text-white",
    headerSub: "text-blue-100",
    iconBg: "bg-white/20",
    iconText: "text-white",
    tag: "bg-blue-50 text-blue-700 border-blue-300",
    dot: "bg-blue-500",
    line: "bg-blue-200",
    hover: "hover:border-blue-500",
    number: "text-white/30",
  },
  amber: {
    border: "border-amber-600",
    borderTop: "border-t-amber-700",
    headerBg: "bg-amber-600",
    headerText: "text-white",
    headerSub: "text-amber-100",
    iconBg: "bg-white/20",
    iconText: "text-white",
    tag: "bg-amber-50 text-amber-700 border-amber-300",
    dot: "bg-amber-500",
    line: "bg-amber-200",
    hover: "hover:border-amber-500",
    number: "text-white/30",
  },
  indigo: {
    border: "border-gray-800",
    borderTop: "border-t-gray-900",
    headerBg: "bg-gray-900",
    headerText: "text-white",
    headerSub: "text-gray-400",
    iconBg: "bg-white/15",
    iconText: "text-white",
    tag: "bg-gray-100 text-gray-700 border-gray-300",
    dot: "bg-gray-600",
    line: "bg-gray-200",
    hover: "hover:border-gray-600",
    number: "text-white/20",
  },
};

const pillarNumbers = ["I", "III", "II"];

export function PillarCard({
  title,
  subtitle,
  href,
  icon: Icon,
  color,
  hiItems,
  aiItems,
  index,
}: PillarCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.12 }}
      className="flex flex-col"
    >
      <Link href={href} className="group block h-full">
        <div
          className={cn(
            "relative h-full flex flex-col overflow-hidden",
            "bg-white rounded-xl border-2 shadow-sm",
            "transition-all duration-200",
            "hover:shadow-lg hover:-translate-y-1",
            c.border,
            c.hover
          )}
        >
          {/* Color Header */}
          <div className={cn("px-5 py-4", c.headerBg)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.iconBg)}>
                  <Icon className={cn("w-5 h-5", c.iconText)} />
                </div>
                <div>
                  <h3 className={cn("text-lg font-bold", c.headerText)}>{title}</h3>
                  <p className={cn("text-xs mt-0.5", c.headerSub)}>{subtitle}</p>
                </div>
              </div>
              <span className={cn("text-2xl font-light", c.number)}>
                {pillarNumbers[index]}
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1">
            {/* HI Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border", c.tag)}>
                  HI
                </span>
                <div className={cn("flex-1 h-px", c.line)} />
              </div>
              <div className="space-y-2.5">
                {hiItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", c.dot)} />
                    <div>
                      <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      <span className="text-xs text-gray-400 ml-1.5">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="my-3" />

            {/* AI Section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border", c.tag)}>
                  AI
                </span>
                <div className={cn("flex-1 h-px", c.line)} />
              </div>
              <div className="space-y-2.5">
                {aiItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", c.dot)} />
                    <div>
                      <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      <span className="text-xs text-gray-400 ml-1.5">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                자세히 보기
              </span>
              <span className="text-gray-300 group-hover:text-gray-700 transition-all group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
