import db from "@/lib/db";
import DiagnosisCharts from "@/components/optic-view/DiagnosisCharts";

export const dynamic = "force-dynamic";

interface WorkforceRow {
  org_code: string;
  avg_efficiency: number;
  avg_work_hours: number;
  overtime_ratio: number;
}

interface EngagementRow {
  org_code: string;
  engagement_score: number;
}

interface SkillRow {
  org_code: string;
  skill_category: string;
  avg_proficiency: number;
  required_level: number;
  gap: number;
}

interface OrgUnit {
  org_code: string;
  org_name: string;
}

function normalizeEfficiency(value: number): number {
  // 60-100 range -> 0-100
  return Math.max(0, Math.min(100, ((value - 60) / 40) * 100));
}

function normalizeWorkHours(value: number): number {
  // Lower is better. 35-55 range -> 100-0
  return Math.max(0, Math.min(100, ((55 - value) / 20) * 100));
}

function normalizeOvertime(value: number): number {
  // Lower is better. 0-40 range -> 100-0
  return Math.max(0, Math.min(100, ((40 - value) / 40) * 100));
}

function normalizeEngagement(value: number): number {
  // 1-5 range -> 0-100
  return Math.max(0, Math.min(100, ((value - 1) / 4) * 100));
}

function normalizeSkillLevel(avgProficiency: number): number {
  // 0-5 range -> 0-100
  return Math.max(0, Math.min(100, (avgProficiency / 5) * 100));
}

function getGrade(composite: number): string {
  if (composite >= 80) return "A";
  if (composite >= 65) return "B";
  if (composite >= 50) return "C";
  return "D";
}

function getMainIssue(
  efficiency: number,
  overtime: number,
  engagement: number,
  skillLevel: number
): string {
  const issues: Array<{ score: number; label: string }> = [
    { score: efficiency, label: "낮은 근무효율" },
    { score: overtime, label: "과도한 초과근무" },
    { score: engagement, label: "낮은 몰입도" },
    { score: skillLevel, label: "스킬 부족" },
  ];
  issues.sort((a, b) => a.score - b.score);
  const worst = issues[0];
  if (worst.score >= 70) return "양호";
  return worst.label;
}

export default function HRDiagnosisPage() {
  const workforceRows = db
    .prepare(
      `SELECT w.org_code, w.avg_efficiency, w.avg_work_hours, w.overtime_ratio
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
      `SELECT e.org_code, e.engagement_score
       FROM engagement_summary e
       JOIN org_units o ON e.org_code = o.org_code
       WHERE o.org_level = 'team'`
    )
    .all() as EngagementRow[];

  if (engagementRows.length === 0) {
    throw new Error("engagement_summary 데이터가 없습니다");
  }

  const skillRows = db
    .prepare(
      `SELECT s.org_code, s.skill_category, s.avg_proficiency, s.required_level, s.gap
       FROM skill_summary s
       JOIN org_units o ON s.org_code = o.org_code
       WHERE o.org_level = 'team'`
    )
    .all() as SkillRow[];

  if (skillRows.length === 0) {
    throw new Error("skill_summary 데이터가 없습니다");
  }

  const orgUnits = db
    .prepare(`SELECT org_code, org_name FROM org_units WHERE org_level = 'team'`)
    .all() as OrgUnit[];

  const orgNameMap = new Map(orgUnits.map((o) => [o.org_code, o.org_name]));
  const engagementMap = new Map(
    engagementRows.map((e) => [e.org_code, e])
  );

  // Group skills by org_code, compute avg proficiency across categories
  const skillByOrg = new Map<string, number>();
  const skillGrouped = new Map<string, SkillRow[]>();
  for (const s of skillRows) {
    const existing = skillGrouped.get(s.org_code);
    if (existing) {
      existing.push(s);
    } else {
      skillGrouped.set(s.org_code, [s]);
    }
  }
  for (const [orgCode, skills] of skillGrouped) {
    const avgProf =
      skills.reduce((sum, s) => sum + s.avg_proficiency, 0) / skills.length;
    skillByOrg.set(orgCode, avgProf);
  }

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
    const avgSkill = skillByOrg.get(w.org_code);
    if (avgSkill === undefined) {
      throw new Error(
        `skill data not found for org_code: ${w.org_code}`
      );
    }

    const efficiency = normalizeEfficiency(w.avg_efficiency);
    const workHours = normalizeWorkHours(w.avg_work_hours);
    const overtime = normalizeOvertime(w.overtime_ratio);
    const engagementNorm = normalizeEngagement(engagement.engagement_score);
    const skillLevel = normalizeSkillLevel(avgSkill);

    // Composite: weighted average
    const composite =
      efficiency * 0.2 +
      workHours * 0.1 +
      overtime * 0.2 +
      engagementNorm * 0.3 +
      skillLevel * 0.2;

    return {
      org_code: w.org_code,
      org_name: orgName,
      efficiency,
      work_hours: workHours,
      overtime,
      engagement: engagementNorm,
      skill_level: skillLevel,
      composite_score: composite,
      grade: getGrade(composite),
      main_issue: getMainIssue(efficiency, overtime, engagementNorm, skillLevel),
    };
  });

  // Sort by composite descending
  teams.sort((a, b) => b.composite_score - a.composite_score);

  // Radar data: B-1-1 vs company average
  const b11 = teams.find((t) => t.org_code === "B-1-1");
  const avgEfficiency =
    teams.reduce((s, t) => s + t.efficiency, 0) / teams.length;
  const avgWorkHours =
    teams.reduce((s, t) => s + t.work_hours, 0) / teams.length;
  const avgOvertime =
    teams.reduce((s, t) => s + t.overtime, 0) / teams.length;
  const avgEngagement =
    teams.reduce((s, t) => s + t.engagement, 0) / teams.length;
  const avgSkillLevel =
    teams.reduce((s, t) => s + t.skill_level, 0) / teams.length;

  const radarData = [
    {
      dimension: "근무효율",
      b11_value: b11 ? b11.efficiency : 0,
      company_avg: avgEfficiency,
    },
    {
      dimension: "근무시간",
      b11_value: b11 ? b11.work_hours : 0,
      company_avg: avgWorkHours,
    },
    {
      dimension: "초과근무",
      b11_value: b11 ? b11.overtime : 0,
      company_avg: avgOvertime,
    },
    {
      dimension: "몰입도",
      b11_value: b11 ? b11.engagement : 0,
      company_avg: avgEngagement,
    },
    {
      dimension: "스킬수준",
      b11_value: b11 ? b11.skill_level : 0,
      company_avg: avgSkillLevel,
    },
  ];

  // SHAP-style factor importance (mockup based on real data spread)
  const shapFactors = [
    { factor: "초과근무", importance: 92, direction: "negative" as const },
    { factor: "낮은 몰입도", importance: 78, direction: "negative" as const },
    { factor: "스킬 갭", importance: 65, direction: "negative" as const },
    { factor: "높은 근무시간", importance: 54, direction: "negative" as const },
    { factor: "낮은 효율성", importance: 48, direction: "negative" as const },
    { factor: "리더십 부재", importance: 41, direction: "caution" as const },
  ];

  const companyHealthScore =
    teams.reduce((s, t) => s + t.composite_score, 0) / teams.length;
  const diagnosisAreaCount = 5; // 근무효율, 근무시간, 초과근무, 몰입도, 스킬수준
  const improvementTeamCount = teams.filter(
    (t) => t.grade === "C" || t.grade === "D"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Optic View</span>
          <span>/</span>
          <span className="text-gray-900">인력수준 진단</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          인력수준 진단 대시보드
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          조직 건강성, SHAP 요인 분석, 종합 진단
        </p>
      </div>

      <DiagnosisCharts
        teams={teams}
        radarData={radarData}
        shapFactors={shapFactors}
        companyHealthScore={companyHealthScore}
        diagnosisAreaCount={diagnosisAreaCount}
        improvementTeamCount={improvementTeamCount}
      />
    </div>
  );
}
