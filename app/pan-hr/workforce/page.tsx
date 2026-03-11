import Link from "next/link";
import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Activity,
} from "lucide-react";
import { WorkforceEfficiencyChart } from "@/components/workforce/WorkforceCharts";
import {
  CenterLevelGrid,
  type CenterMetrics,
  type TeamMetrics,
  type CompanyTotals,
} from "@/components/workforce/CenterLevelGrid";

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

interface CenterRow {
  org_code: string;
  org_name: string;
  headcount: number;
}

interface TeamWithCenter {
  org_code: string;
  org_name: string;
  parent_center_code: string;
  parent_center_name: string;
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

export default function WorkforcePage() {
  // ─── Team-level data (latest month) ────────────────────────────────────────
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

  // ─── Center-level aggregation ──────────────────────────────────────────────
  const centerRows = db
    .prepare(
      `SELECT org_code, org_name, headcount
       FROM org_units
       WHERE org_level = 'center'
       ORDER BY display_order`
    )
    .all() as CenterRow[];

  if (centerRows.length === 0) {
    throw new Error("No center-level org_units found");
  }

  // Get teams with their parent center info
  const teamsWithCenter = db
    .prepare(
      `SELECT
         t.org_code,
         t.org_name,
         c.org_code AS parent_center_code,
         c.org_name AS parent_center_name,
         w.headcount,
         w.avg_efficiency,
         w.avg_work_hours,
         w.overtime_ratio,
         w.burnout_risk_level
       FROM workforce_summary w
       JOIN org_units t ON w.org_code = t.org_code
       JOIN org_units d ON t.parent_org_code = d.org_code
       JOIN org_units c ON d.parent_org_code = c.org_code
       WHERE w.year_month = '2025-12'
         AND t.org_level = 'team'
       ORDER BY c.display_order, t.display_order`
    )
    .all() as TeamWithCenter[];

  if (teamsWithCenter.length === 0) {
    throw new Error("No team-level workforce data found for 2025-12");
  }

  // Aggregate center metrics from team data
  const centers: CenterMetrics[] = centerRows.map((cr) => {
    const centerTeams = teamsWithCenter.filter(
      (t) => t.parent_center_code === cr.org_code
    );
    if (centerTeams.length === 0) {
      throw new Error(
        `No teams found for center ${cr.org_code} (${cr.org_name})`
      );
    }

    const totalHC = centerTeams.reduce((s, t) => s + t.headcount, 0);
    // Weighted average by headcount
    const weightedEfficiency =
      centerTeams.reduce((s, t) => s + t.avg_efficiency * t.headcount, 0) /
      totalHC;
    const weightedWorkHours =
      centerTeams.reduce((s, t) => s + t.avg_work_hours * t.headcount, 0) /
      totalHC;
    const weightedOvertime =
      centerTeams.reduce((s, t) => s + t.overtime_ratio * t.headcount, 0) /
      totalHC;

    return {
      centerCode: cr.org_code,
      centerName: cr.org_name,
      headcount: totalHC,
      avgEfficiency: Math.round(weightedEfficiency * 10) / 10,
      avgWorkHours: Math.round(weightedWorkHours * 10) / 10,
      overtimeRatio: Math.round(weightedOvertime * 10) / 10,
    };
  });

  // Build team metrics array
  const teams: TeamMetrics[] = teamsWithCenter.map((t) => ({
    orgCode: t.org_code,
    orgName: t.org_name,
    parentCenterCode: t.parent_center_code,
    parentCenterName: t.parent_center_name,
    headcount: t.headcount,
    avgEfficiency: t.avg_efficiency,
    avgWorkHours: t.avg_work_hours,
    overtimeRatio: t.overtime_ratio,
    burnoutRiskLevel: t.burnout_risk_level,
  }));

  // Company totals (weighted)
  const totalHC = teams.reduce((s, t) => s + t.headcount, 0);
  const companyTotals: CompanyTotals = {
    totalHeadcount: totalHC,
    avgEfficiency:
      Math.round(
        (teams.reduce((s, t) => s + t.avgEfficiency * t.headcount, 0) /
          totalHC) *
          10
      ) / 10,
    avgWorkHours:
      Math.round(
        (teams.reduce((s, t) => s + t.avgWorkHours * t.headcount, 0) /
          totalHC) *
          10
      ) / 10,
    avgOvertimeRatio:
      Math.round(
        (teams.reduce((s, t) => s + t.overtimeRatio * t.headcount, 0) /
          totalHC) *
          10
      ) / 10,
  };

  // ─── Trend data ────────────────────────────────────────────────────────────
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

  // B-1-1 burnout data
  const b11Data = latestData.find((r) => r.org_code === "B-1-1");
  if (!b11Data) {
    throw new Error("B-1-1 team data not found in workforce_summary");
  }

  // Build trend chart data
  const months = [...new Set(trendRows.map((r) => r.year_month))].sort();
  const teamCodes = [...new Set(latestData.map((r) => r.org_code))];
  const trendData = months.map((month) => {
    const point: { month: string; [teamCode: string]: string | number } = {
      month,
    };
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
          <Link
            href="/pan-hr"
            className="hover:text-neutral-700 transition-colors"
          >
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

      {/* ═══ CENTER LEVEL GRID (Signature Feature) ═══ */}
      <CenterLevelGrid
        centers={centers}
        teams={teams}
        companyTotals={companyTotals}
      />

      {/* Burnout Alert Banner */}
      <div className="mt-8 mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-800">
            B-1-1팀 번아웃 위험 HIGH
          </p>
          <p className="text-sm text-red-700 mt-0.5">
            초과근무 {b11Data.overtime_ratio}% ▲, 효율 {b11Data.avg_efficiency}%
            ▼ -- 즉각적인 인력 보충 및 업무 재배분이 필요합니다.
          </p>
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
