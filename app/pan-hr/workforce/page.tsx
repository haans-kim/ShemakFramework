import Link from "next/link";
import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  AlertTriangle,
  Clock,
  Activity,
  Flame,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { WorkforceEfficiencyChart } from "@/components/workforce/WorkforceCharts";

export const dynamic = "force-dynamic";

interface WorkforceRow {
  org_code: string;
  org_name: string;
  year_month: string;
  headcount: number;
  avg_efficiency: number;
  avg_work_hours: number;
  overtime_ratio: number;
  burnout_risk_level: string;
}

interface TrendRow {
  org_code: string;
  year_month: string;
  avg_efficiency: number;
}

function getBurnoutBorderColor(level: string): string {
  if (level === "high") return "border-l-red-500";
  if (level === "medium") return "border-l-amber-500";
  return "border-l-emerald-500";
}

function getBurnoutBadgeClass(level: string): string {
  if (level === "high") return "bg-red-100 text-red-700 border-red-200";
  if (level === "medium") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function getBurnoutLabel(level: string): string {
  if (level === "high") return "HIGH";
  if (level === "medium") return "MEDIUM";
  return "LOW";
}

export default function WorkforcePage() {
  const latestData = db
    .prepare(
      `SELECT w.org_code, o.org_name, w.year_month, w.headcount,
              w.avg_efficiency, w.avg_work_hours, w.overtime_ratio, w.burnout_risk_level
       FROM workforce_summary w
       JOIN org_units o ON w.org_code = o.org_code
       WHERE w.year_month = '2025-12'
       ORDER BY o.display_order`
    )
    .all() as WorkforceRow[];

  if (latestData.length === 0) {
    throw new Error("workforce_summary data not found for 2025-12");
  }

  const trendRows = db
    .prepare(
      `SELECT w.org_code, w.year_month, w.avg_efficiency
       FROM workforce_summary w
       JOIN org_units o ON w.org_code = o.org_code
       WHERE o.org_level = 'team'
       ORDER BY w.year_month, o.display_order`
    )
    .all() as TrendRow[];

  if (trendRows.length === 0) {
    throw new Error("workforce_summary trend data not found");
  }

  // KPI calculations
  const totalHeadcount = latestData.reduce((sum, r) => sum + r.headcount, 0);
  const avgEfficiency =
    Math.round(
      (latestData.reduce((sum, r) => sum + r.avg_efficiency, 0) /
        latestData.length) *
        10
    ) / 10;
  const avgWorkHours =
    Math.round(
      (latestData.reduce((sum, r) => sum + r.avg_work_hours, 0) /
        latestData.length) *
        10
    ) / 10;
  const burnoutTeamCount = latestData.filter(
    (r) => r.burnout_risk_level === "high"
  ).length;

  // B-1-1 burnout data
  const b11Data = latestData.find((r) => r.org_code === "B-1-1");
  if (!b11Data) {
    throw new Error("B-1-1 team data not found in workforce_summary");
  }

  // Build trend chart data
  const months = [...new Set(trendRows.map((r) => r.year_month))].sort();
  const teamCodes = [...new Set(latestData.map((r) => r.org_code))];
  const trendData = months.map((month) => {
    const point: { month: string; [teamCode: string]: string | number } = { month };
    for (const code of teamCodes) {
      const row = trendRows.find(
        (r) => r.year_month === month && r.org_code === code
      );
      if (row) {
        point[code] = row.avg_efficiency;
      }
    }
    return point;
  });

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
        <h1 className="text-xl font-semibold text-neutral-900">
          인력관리 대시보드
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          팀별 근무 효율, 초과근무 현황, 번아웃 위험 분석
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-neutral-600">총 인원</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {totalHeadcount}
              <span className="text-sm font-normal text-neutral-500 ml-1">명</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white border-l-4 border-l-emerald-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-neutral-600">평균 효율</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {avgEfficiency}
              <span className="text-sm font-normal text-neutral-500 ml-1">%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-white border-l-4 border-l-violet-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-violet-600" />
              <span className="text-sm text-neutral-600">평균 근무시간</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {avgWorkHours}
              <span className="text-sm font-normal text-neutral-500 ml-1">h</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white border-l-4 border-l-red-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-red-600" />
              <span className="text-sm text-neutral-600">번아웃 위험 팀</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {burnoutTeamCount}
              <span className="text-sm font-normal text-neutral-500 ml-1">팀</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Burnout Alert Banner */}
      <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-800">
            B-1-1팀 번아웃 위험 HIGH
          </p>
          <p className="text-sm text-red-700 mt-0.5">
            초과근무 {b11Data.overtime_ratio}% ▲, 효율{" "}
            {b11Data.avg_efficiency}% ▼ -- 즉각적인 인력 보충 및 업무 재배분이
            필요합니다.
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          팀별 현황 (2025-12)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {latestData.map((team) => (
            <Card
              key={team.org_code}
              className={`border-l-4 ${getBurnoutBorderColor(team.burnout_risk_level)} hover:shadow-md transition-all ${
                team.org_code === "B-1-1"
                  ? "bg-gradient-to-br from-red-50 to-white ring-1 ring-red-200"
                  : "bg-white"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {team.org_name}
                  </CardTitle>
                  <Badge
                    className={`text-xs ${getBurnoutBadgeClass(team.burnout_risk_level)}`}
                  >
                    {getBurnoutLabel(team.burnout_risk_level)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">인원</span>
                    <span className="font-medium">{team.headcount}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">효율</span>
                    <span
                      className={`font-medium ${
                        team.avg_efficiency < 70
                          ? "text-red-600"
                          : team.avg_efficiency < 80
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }`}
                    >
                      {team.avg_efficiency}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">근무시간</span>
                    <span className="font-medium">{team.avg_work_hours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">초과근무</span>
                    <span
                      className={`font-medium ${
                        team.overtime_ratio > 30
                          ? "text-red-600"
                          : team.overtime_ratio > 15
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }`}
                    >
                      {team.overtime_ratio}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Efficiency Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            월별 효율 추이 (2025)
          </CardTitle>
          <p className="text-sm text-neutral-500">
            B-1-1팀(빨간선)이 지속적으로 낮은 효율을 보이고 있습니다
          </p>
        </CardHeader>
        <CardContent>
          <WorkforceEfficiencyChart
            trendData={trendData}
            teamCodes={teamCodes}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Link
          href="/pan-hr/planning"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          인력 보충이 필요한 팀 확인
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
