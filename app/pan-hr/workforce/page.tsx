"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { CenterLevelGrid } from "@/components/workforce/CenterLevelGrid";
import { MetricSelector } from "@/components/workforce/MetricSelector";
import { SummaryCards } from "@/components/workforce/SummaryCards";
import { dashboardData, type MetricType } from "@/lib/data/workforce-matrix-data";

export default function WorkforcePage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("hrDashboard.selectedMetric") as MetricType | null;
      if (saved) return saved;
    }
    return "efficiency";
  });

  const handleMetricChange = (metric: MetricType) => {
    setSelectedMetric(metric);
    try {
      window.localStorage.setItem("hrDashboard.selectedMetric", metric);
    } catch {
      // localStorage 접근 불가 시 무시
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">
            Pan HR
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">인력관리</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              인력관리 대시보드
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              센터별 · 직급별 근무현황 매트릭스 분석 (익명화 요약 데이터)
            </p>
          </div>
          <MetricSelector
            selectedMetric={selectedMetric}
            onMetricChange={handleMetricChange}
          />
        </div>
      </div>

      {/* ═══ Signature Matrix Dashboard ═══ */}
      <CenterLevelGrid
        centers={dashboardData.centers}
        gradeMatrix={dashboardData.gradeMatrix}
        weeklyClaimedHoursMatrix={dashboardData.weeklyClaimedHoursMatrix}
        adjustedWeeklyWorkHoursMatrix={dashboardData.adjustedWeeklyWorkHoursMatrix}
        avgEfficiency={dashboardData.avgEfficiency}
        avgWeeklyClaimedHours={dashboardData.avgWeeklyClaimedHours}
        avgAdjustedWeeklyWorkHours={dashboardData.avgAdjustedWeeklyWorkHours}
        selectedMetric={selectedMetric}
        thresholds={dashboardData.thresholds}
      />

      {/* ═══ Summary Cards (Threshold Legend) ═══ */}
      <SummaryCards
        selectedMetric={selectedMetric}
        thresholds={dashboardData.thresholds}
      />

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <Link
          href="/pan-hr/planning"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          인력계획 현황 보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
