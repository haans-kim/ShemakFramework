"use client";

import { cn } from "@/lib/utils";
import type { MetricType, ThresholdInfo } from "@/lib/data/workforce-matrix-data";

interface SummaryCardsProps {
  selectedMetric: MetricType;
  thresholds: Record<string, ThresholdInfo>;
}

export function SummaryCards({ selectedMetric, thresholds }: SummaryCardsProps) {
  const currentThresholds = thresholds[selectedMetric];
  if (!currentThresholds) {
    throw new Error(`Thresholds not found for metric: ${selectedMetric}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* 상위 20% - 번아웃 위험 (빨간색) */}
      <div className={cn(
        "rounded-lg p-6 bg-gradient-to-br from-red-50 to-white",
        "border-2 border-gray-300 border-l-4 border-l-red-500 shadow-sm"
      )}>
        <div className="flex items-start space-x-3">
          <div className="text-red-500 text-xl">▲</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">상위</h3>
            <p className="text-sm text-gray-500">상위 20% ({currentThresholds.high})</p>
          </div>
        </div>
      </div>

      {/* 중위 */}
      <div className={cn(
        "rounded-lg p-6 bg-gradient-to-br from-green-50 to-white",
        "border-2 border-gray-300 border-l-4 border-l-green-500 shadow-sm"
      )}>
        <div className="flex items-start space-x-3">
          <div className="text-green-500 text-xl">●</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">중위</h3>
            <p className="text-sm text-gray-500">중간 60% ({currentThresholds.middle})</p>
          </div>
        </div>
      </div>

      {/* 하위 20% - 양호 (파란색) */}
      <div className={cn(
        "rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white",
        "border-2 border-gray-300 border-l-4 border-l-blue-500 shadow-sm"
      )}>
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-xl">▼</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">하위</h3>
            <p className="text-sm text-gray-500">하위 20% ({currentThresholds.low})</p>
          </div>
        </div>
      </div>
    </div>
  );
}
