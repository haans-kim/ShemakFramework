"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrgCards } from "@/components/workforce/OrgCards";
import { MetricSelector } from "@/components/workforce/MetricSelector";
import {
  orgUnits,
  getChildrenOf,
  getOrgByCode,
  getAncestorPath,
  type MetricType,
} from "@/lib/data/workforce-matrix-data";

function GroupsPage() {
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

  // 특정 팀의 그룹 또는 전체 그룹
  const groups = parentCode
    ? getChildrenOf(parentCode).filter((u) => u.orgLevel === "group")
    : orgUnits.filter((u) => u.orgLevel === "group");

  // 전체 보기 시 팀별 그룹핑
  const teamGroups = !parentCode
    ? orgUnits
        .filter((u) => u.orgLevel === "team")
        .map((team) => ({
          team,
          groups: getChildrenOf(team.orgCode).filter((u) => u.orgLevel === "group"),
        }))
        .filter((g) => g.groups.length > 0)
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
          <span className="text-neutral-900 font-medium">그룹별 분석</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {parent ? `${parent.orgName} - 그룹별 현황` : "그룹별 분석"}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {parent
                ? `${parent.headcount.toLocaleString()}명 · 그룹 ${groups.length}개`
                : `전체 그룹 ${groups.length}개`}
            </p>
          </div>
          <MetricSelector selectedMetric={selectedMetric} onMetricChange={handleMetricChange} />
        </div>
      </div>

      {/* Cards */}
      {teamGroups ? (
        <div className="space-y-8">
          {teamGroups.map(({ team, groups: gs }) => (
            <div key={team.orgCode}>
              <h2 className="text-lg font-bold text-neutral-800 mb-3">
                {team.orgName}
                <span className="text-sm font-normal text-neutral-500 ml-2">{team.headcount.toLocaleString()}명</span>
              </h2>
              {/* Groups는 최하위 - 카드 클릭 시 이동 없음 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gs.map((g) => {
                  const value = selectedMetric === "efficiency" ? g.avgWorkEfficiency
                    : selectedMetric === "weeklyClaimedHours" ? g.avgWeeklyClaimedHours
                    : g.avgAdjustedWeeklyWorkHours;
                  return (
                    <div
                      key={g.orgCode}
                      className="rounded-xl border-2 border-neutral-200 bg-white p-5"
                    >
                      <h3 className="text-sm font-bold text-neutral-900">{g.orgName}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{g.headcount}명</p>
                      <p className="text-2xl font-bold text-neutral-800 mt-2">
                        {selectedMetric === "efficiency" ? `${value.toFixed(1)}%` : `${value.toFixed(1)}h`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map((g) => {
            const value = selectedMetric === "efficiency" ? g.avgWorkEfficiency
              : selectedMetric === "weeklyClaimedHours" ? g.avgWeeklyClaimedHours
              : g.avgAdjustedWeeklyWorkHours;
            return (
              <div
                key={g.orgCode}
                className="rounded-xl border-2 border-neutral-200 bg-white p-5"
              >
                <h3 className="text-sm font-bold text-neutral-900">{g.orgName}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{g.headcount}명</p>
                <p className="text-2xl font-bold text-neutral-800 mt-2">
                  {selectedMetric === "efficiency" ? `${value.toFixed(1)}%` : `${value.toFixed(1)}h`}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-neutral-500">이 조직에는 그룹 데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-neutral-500">로딩 중...</div>}>
      <GroupsPage />
    </Suspense>
  );
}
