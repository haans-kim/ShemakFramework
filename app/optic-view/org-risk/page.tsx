import db from "@/lib/db";
import OrgRiskCharts from "@/components/optic-view/OrgRiskCharts";

export const dynamic = "force-dynamic";

interface WorkforceRow {
  org_code: string;
  headcount: number;
  avg_efficiency: number;
  avg_work_hours: number;
  overtime_ratio: number;
  burnout_risk_level: string;
}

interface EngagementRow {
  org_code: string;
  engagement_score: number;
  risk_pct: number;
}

interface OrgUnit {
  org_code: string;
  org_name: string;
}

export default function OrgRiskPage() {
  const workforceRows = db
    .prepare(
      `SELECT w.org_code, w.headcount, w.avg_efficiency, w.avg_work_hours,
              w.overtime_ratio, w.burnout_risk_level
       FROM workforce_summary w
       JOIN org_units o ON w.org_code = o.org_code
       WHERE o.org_level = 'team' AND w.year_month = '2025-12'
       ORDER BY o.display_order`
    )
    .all() as WorkforceRow[];

  if (workforceRows.length === 0) {
    throw new Error("workforce_summary 2025-12 데이터가 없습니다");
  }

  const engagementRows = db
    .prepare(
      `SELECT e.org_code, e.engagement_score, e.risk_pct
       FROM engagement_summary e
       JOIN org_units o ON e.org_code = o.org_code
       WHERE o.org_level = 'team'`
    )
    .all() as EngagementRow[];

  if (engagementRows.length === 0) {
    throw new Error("engagement_summary 데이터가 없습니다");
  }

  const orgUnits = db
    .prepare(`SELECT org_code, org_name FROM org_units WHERE org_level = 'team'`)
    .all() as OrgUnit[];

  const orgNameMap = new Map(orgUnits.map((o) => [o.org_code, o.org_name]));
  const engagementMap = new Map(
    engagementRows.map((e) => [e.org_code, e])
  );

  const teams = workforceRows.map((w) => {
    const orgName = orgNameMap.get(w.org_code);
    if (!orgName) {
      throw new Error(`org_name not found for org_code: ${w.org_code}`);
    }
    const engagement = engagementMap.get(w.org_code);
    if (!engagement) {
      throw new Error(
        `engagement data not found for org_code: ${w.org_code}`
      );
    }
    return {
      org_code: w.org_code,
      org_name: orgName,
      headcount: w.headcount,
      burnout_risk_level: w.burnout_risk_level,
      overtime_ratio: w.overtime_ratio,
      avg_efficiency: w.avg_efficiency,
      avg_work_hours: w.avg_work_hours,
      engagement_score: engagement.engagement_score,
      risk_pct: engagement.risk_pct,
    };
  });

  const highRiskCount = teams.filter((t) => t.risk_pct >= 30).length;
  const burnoutCount = teams.filter(
    (t) => t.burnout_risk_level === "high" || t.burnout_risk_level === "medium"
  ).length;
  const avgOvertimeRatio =
    teams.reduce((sum, t) => sum + t.overtime_ratio, 0) / teams.length;

  // Composite risk score: weighted average of normalized risk factors
  const companyRiskScore =
    teams.reduce((sum, t) => {
      const overtimeNorm = Math.min(t.overtime_ratio / 40, 1) * 30;
      const riskPctNorm = Math.min(t.risk_pct / 50, 1) * 30;
      const efficiencyNorm = Math.max(0, (100 - t.avg_efficiency) / 40) * 20;
      const engagementNorm =
        Math.max(0, (5 - t.engagement_score) / 2) * 20;
      return sum + overtimeNorm + riskPctNorm + efficiencyNorm + engagementNorm;
    }, 0) / teams.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Optic View</span>
          <span>/</span>
          <span className="text-gray-900">조직 리스크</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          조직 리스크 대시보드
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          번아웃, 이직 위험, 조직 건강성 종합 분석
        </p>
      </div>

      <OrgRiskCharts
        teams={teams}
        highRiskCount={highRiskCount}
        burnoutCount={burnoutCount}
        avgOvertimeRatio={avgOvertimeRatio}
        companyRiskScore={companyRiskScore}
      />
    </div>
  );
}
