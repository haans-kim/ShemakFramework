"use client";

import { cn } from "@/lib/utils";

interface MonthSelectorProps {
  selectedMonth: number; // 1-12
  onMonthChange: (month: number) => void;
}

const months = [
  { value: 1, label: "1월" },
  { value: 2, label: "2월" },
  { value: 3, label: "3월" },
  { value: 4, label: "4월" },
  { value: 5, label: "5월" },
  { value: 6, label: "6월" },
  { value: 7, label: "7월" },
  { value: 8, label: "8월" },
  { value: 9, label: "9월" },
  { value: 10, label: "10월" },
  { value: 11, label: "11월" },
  { value: 12, label: "12월" },
];

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {months.map((m) => (
        <button
          key={m.value}
          onClick={() => onMonthChange(m.value)}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
            selectedMonth === m.value
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
