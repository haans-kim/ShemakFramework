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
  getOrgByCode,
  getAncestorPath,
  type MetricType,
} from "@/lib/data/workforce-matrix-data";

function TeamsPage() {
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

  const parent = parentCode ? getOrgByCode(parentCode) : null;
  const ancestors = parentCode ? getAncestorPath(parentCode) : [];

  // 특정 담당의 팀 또는 전체 팀
  const teams = parentCode
    ? getChildrenOf(parentCode).filter((u) => u.orgLevel === "team")
    : orgUnits.filter((u) => u.orgLevel === "team");

  // 전체 보기 시 담당별 그룹핑
  const divisionGroups = !parentCode
    ? orgUnits
        .filter((u) => u.orgLevel === "division")
        .map((div) => ({
          division: div,
          teams: getChildrenOf(div.orgCode).filter((u) => u.orgLevel === "team"),
        }))
        .filter((g) => g.teams.length > 0)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2 flex-wrap">
          <Link href="/pan-hr" className="hover:text-neutral-700 transition-colors">Pan HR</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/pan-hr/workforce" className="hover:text-neutral-700 transition-colors">인력관리</Link>
          {ancestors.map((a) => (
            <span key={a.orgCode} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-600">{a.orgName}</span>
            </span>
          ))}
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">팀별 분석</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {parent ? `${parent.orgName} - 팀별 현황` : "팀별 분석"}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {parent
                ? `${parent.headcount.toLocaleString()}명 · 팀 ${teams.length}개`
                : `전체 팀 ${teams.length}개`}
            </p>
          </div>
          <MetricSelector selectedMetric={selectedMetric} onMetricChange={handleMetricChange} />
        </div>
      </div>

      {/* Cards */}
      {divisionGroups ? (
        <div className="space-y-8">
          {divisionGroups.map(({ division, teams: ts }) => (
            <div key={division.orgCode}>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">
                {division.orgName}
                <span className="text-sm font-normal text-neutral-500 ml-2">{division.headcount.toLocaleString()}명</span>
              </h2>
              <OrgCards units={ts} metric={selectedMetric} linkPrefix="/pan-hr/workforce/groups" />
            </div>
          ))}
        </div>
      ) : (
        <OrgCards units={teams} metric={selectedMetric} linkPrefix="/pan-hr/workforce/groups" />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-neutral-500">로딩 중...</div>}>
      <TeamsPage />
    </Suspense>
  );
}
