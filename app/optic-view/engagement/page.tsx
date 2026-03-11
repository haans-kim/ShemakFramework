import db from "@/lib/db";
import EngagementCharts from "@/components/optic-view/EngagementCharts";

export const dynamic = "force-dynamic";

interface EngagementRow {
  org_code: string;
  survey_date: string;
  engagement_score: number;
  high_engagement_pct: number;
  risk_pct: number;
  top_factor: string;
}

interface OrgUnit {
  org_code: string;
  org_name: string;
}

export default function EngagementPage() {
  const engagementRows = db
    .prepare(
      `SELECT e.org_code, e.survey_date, e.engagement_score, e.high_engagement_pct,
              e.risk_pct, e.top_factor
       FROM engagement_summary e
       JOIN org_units o ON e.org_code = o.org_code
       WHERE o.org_level = 'team'
       ORDER BY e.engagement_score DESC`
    )
    .all() as EngagementRow[];

  if (engagementRows.length === 0) {
    throw new Error("engagement_summary 데이터가 없습니다");
  }

  const orgUnits = db
    .prepare(`SELECT org_code, org_name FROM org_units WHERE org_level = 'team'`)
    .all() as OrgUnit[];

  const orgNameMap = new Map(orgUnits.map((o) => [o.org_code, o.org_name]));

  const data = engagementRows.map((row) => {
    const orgName = orgNameMap.get(row.org_code);
    if (!orgName) {
      throw new Error(`org_name not found for org_code: ${row.org_code}`);
    }
    return {
      org_code: row.org_code,
      org_name: orgName,
      survey_date: row.survey_date,
      engagement_score: row.engagement_score,
      high_engagement_pct: row.high_engagement_pct,
      risk_pct: row.risk_pct,
      top_factor: row.top_factor,
    };
  });

  const totalTeams = data.length;
  const avgEngagement =
    data.reduce((sum, d) => sum + d.engagement_score, 0) / totalTeams;
  const avgHighPct =
    data.reduce((sum, d) => sum + d.high_engagement_pct, 0) / totalTeams;
  const avgRiskPct =
    data.reduce((sum, d) => sum + d.risk_pct, 0) / totalTeams;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Optic View</span>
          <span>/</span>
          <span className="text-gray-900">몰입도 예측</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          몰입도 예측 대시보드
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          팀별 몰입도 점수, 고몰입 비율, 위험 요인 분석
        </p>
      </div>

      <EngagementCharts
        data={data}
        avgEngagement={avgEngagement}
        avgHighPct={avgHighPct}
        avgRiskPct={avgRiskPct}
      />
    </div>
  );
}
