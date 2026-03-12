"use client";

import { cn } from "@/lib/utils";
import type { MetricType } from "@/lib/data/workforce-matrix-data";

interface MetricSelectorProps {
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

const metrics: { id: MetricType; label: string }[] = [
  { id: 'weeklyClaimedHours', label: '주간 근태시간' },
  { id: 'adjustedWeeklyWorkHours', label: '주간 근무추정시간' },
  { id: 'efficiency', label: '효율성 지표' },
];

export function MetricSelector({ selectedMetric, onMetricChange }: MetricSelectorProps) {
  return (
    <div className="flex bg-white rounded-lg p-1 gap-2">
      {metrics.map((metric) => (
        <button
          key={metric.id}
          onClick={() => onMetricChange(metric.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            selectedMetric === metric.id
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-700 border-2 border-gray-400 hover:border-gray-600"
          )}
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
}
