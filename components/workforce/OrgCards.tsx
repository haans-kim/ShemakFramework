"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OrgUnit, MetricType } from "@/lib/data/workforce-matrix-data";

interface OrgCardsProps {
  units: OrgUnit[];
  metric: MetricType;
  linkPrefix: string;
}

function getMetricValue(unit: OrgUnit, metric: MetricType): number {
  if (metric === "efficiency") return unit.avgWorkEfficiency;
  if (metric === "weeklyClaimedHours") return unit.avgWeeklyClaimedHours;
  return unit.avgAdjustedWeeklyWorkHours;
}

function formatValue(value: number, metric: MetricType): string {
  if (metric === "efficiency") return `${value.toFixed(1)}%`;
  return `${value.toFixed(1)}h`;
}

function getMetricLabel(metric: MetricType): string {
  if (metric === "efficiency") return "효율성";
  if (metric === "weeklyClaimedHours") return "주간 근태시간";
  return "주간 근무추정시간";
}

function calculateThresholds(values: number[]): { low: number; high: number } | null {
  if (values.length < 3) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return {
    low: sorted[Math.floor(sorted.length * 0.2)],
    high: sorted[Math.floor(sorted.length * 0.8)],
  };
}

function getIndicator(value: number, thresholds: { low: number; high: number } | null): {
  icon: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
} {
  if (!thresholds) {
    return { icon: "", bgColor: "bg-neutral-50", borderColor: "border-neutral-200", textColor: "text-neutral-700", iconColor: "text-neutral-400" };
  }
  if (value >= thresholds.high) {
    return { icon: "▲", bgColor: "bg-red-50", borderColor: "border-red-300", textColor: "text-red-800", iconColor: "text-red-600" };
  }
  if (value <= thresholds.low) {
    return { icon: "▼", bgColor: "bg-blue-50", borderColor: "border-blue-300", textColor: "text-blue-800", iconColor: "text-blue-600" };
  }
  return { icon: "●", bgColor: "bg-green-50", borderColor: "border-green-300", textColor: "text-green-800", iconColor: "text-green-600" };
}

export function OrgCards({ units, metric, linkPrefix }: OrgCardsProps) {
  const values = units.map((u) => getMetricValue(u, metric));
  const thresholds = calculateThresholds(values);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {units.map((unit) => {
        const value = getMetricValue(unit, metric);
        const ind = getIndicator(value, thresholds);

        return (
          <Link
            key={unit.orgCode}
            href={`${linkPrefix}?parent=${unit.orgCode}`}
            className={cn(
              "block rounded-xl border-2 p-5 transition-all hover:shadow-lg hover:scale-[1.02]",
              ind.borderColor,
              ind.bgColor
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">{unit.orgName}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{unit.headcount.toLocaleString()}명</p>
              </div>
              <span className={cn("text-xl font-bold", ind.iconColor)}>{ind.icon}</span>
            </div>
            <div className="mt-2">
              <p className="text-xs text-neutral-500">{getMetricLabel(metric)}</p>
              <p className={cn("text-2xl font-bold mt-0.5", ind.textColor)}>
                {formatValue(value, metric)}
              </p>
            </div>
            {/* Progress bar */}
            <div className="mt-3 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  value >= (thresholds?.high ?? 100) ? "bg-red-400" :
                  value <= (thresholds?.low ?? 0) ? "bg-blue-400" : "bg-green-400"
                )}
                style={{ width: `${metric === "efficiency" ? value : Math.min(value / 50 * 100, 100)}%` }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
