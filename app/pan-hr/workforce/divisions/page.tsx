"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrgCards } from "@/components/workforce/OrgCards";
import { MetricSelector } from "@/components/workforce/MetricSelector";
import {
  dashboardData,
  orgUnits,
  getChildrenOf,
  getCenterByCode,
  type MetricType,
} from "@/lib/data/workforce-matrix-data";

function DivisionsPage() {
  const searchParams = useSearchParams();
  const parentCode = searchParams.get("parent");

  const [selectedMetric, setSelectedMetric] = useState<MetricType>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("hrDashboard.selectedMetric") as MetricType | null;
      if (saved) return saved;
    }
    return "efficiency";
  });

  const handleMetricChange = (metric: MetricType) => {
    setSelectedMetric(metric);
    try { window.localStorage.setItem("hrDashboard.selectedMetric", metric); } catch {}
  };

  // 특정 센터 선택 시 해당 센터의 담당만, 아니면 모든 담당 표시
  const center = parentCode ? getCenterByCode(parentCode) : null;
  const divisions = parentCode
    ? getChildrenOf(parentCode).filter((u) => u.orgLevel === "division")
    : orgUnits.filter((u) => u.orgLevel === "division");

  // 센터별 그룹핑 (전체 보기 시)
  const centerGroups = !parentCode
    ? dashboardData.centers.map((c) => ({
        center: c,
        divisions: getChildrenOf(c.orgCode).filter((u) => u.orgLevel === "division"),
      }))
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">Pan HR</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/pan-hr/workforce" className="hover:text-neutral-700 transition-colors">인력관리</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">
            {center ? `${center.orgName} 담당` : "담당별 분석"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {center ? `${center.orgName} - 담당별 현황` : "담당별 분석"}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {center
                ? `${center.headcount.toLocaleString()}명 · 담당 ${divisions.length}개`
                : `전체 ${dashboardData.totalEmployees.toLocaleString()}명`}
            </p>
          </div>
          <MetricSelector selectedMetric={selectedMetric} onMetricChange={handleMetricChange} />
        </div>
      </div>

      {/* Cards */}
      {centerGroups ? (
        // 전체 보기: 센터별 그룹핑
        <div className="space-y-8">
          {centerGroups.map(({ center: c, divisions: divs }) => (
            <div key={c.orgCode}>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">
                {c.orgName}
                <span className="text-sm font-normal text-neutral-500 ml-2">{c.headcount.toLocaleString()}명</span>
              </h2>
              <OrgCards units={divs} metric={selectedMetric} linkPrefix="/pan-hr/workforce/teams" />
            </div>
          ))}
        </div>
      ) : (
        <OrgCards units={divisions} metric={selectedMetric} linkPrefix="/pan-hr/workforce/teams" />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-neutral-500">로딩 중...</div>}>
      <DivisionsPage />
    </Suspense>
  );
}
