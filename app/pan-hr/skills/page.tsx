import Link from "next/link";
import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Target,
  BookOpen,
  Layers,
  Grid3X3,
  Search,
} from "lucide-react";
import { SkillsRadarChart } from "@/components/skills/SkillsCharts";
import { BFMMatrix } from "@/components/skills/BFMMatrix";
import { HRDBrowser } from "@/components/skills/HRDBrowser";

export const dynamic = "force-dynamic";

interface SkillRow {
  org_code: string;
  org_name: string;
  skill_category: string;
  avg_proficiency: number;
  required_level: number;
  gap: number;
  critical_skills_count: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  technical: "기술역량",
  leadership: "리더십",
  domain: "도메인전문성",
};

function getGapColor(gap: number): string {
  if (gap >= 1.5) return "bg-red-100 text-red-800";
  if (gap >= 0.8) return "bg-amber-100 text-amber-800";
  return "bg-emerald-100 text-emerald-800";
}

function getGapCellColor(gap: number): string {
  if (gap >= 1.5) return "bg-red-100 text-red-700 font-semibold";
  if (gap >= 0.8) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

export default function SkillsPage() {
  const allData = db
    .prepare(
      `SELECT s.org_code, o.org_name, s.skill_category,
              s.avg_proficiency, s.required_level, s.gap, s.critical_skills_count
       FROM skill_summary s
       JOIN org_units o ON s.org_code = o.org_code
       ORDER BY o.display_order, s.skill_category`
    )
    .all() as SkillRow[];

  if (allData.length === 0) {
    throw new Error("skill_summary data not found");
  }

  // KPI calculations
  const avgGap =
    Math.round(
      (allData.reduce((sum, r) => sum + r.gap, 0) / allData.length) * 10
    ) / 10;
  const totalCriticalSkills = allData.reduce(
    (sum, r) => sum + r.critical_skills_count,
    0
  );

  // Find team with largest avg gap
  const teamCodes = [...new Set(allData.map((r) => r.org_code))];
  const teamAvgGaps = teamCodes.map((code) => {
    const teamRows = allData.filter((r) => r.org_code === code);
    const teamAvg =
      teamRows.reduce((sum, r) => sum + r.gap, 0) / teamRows.length;
    const teamName = teamRows[0].org_name;
    return { code, name: teamName, avgGap: Math.round(teamAvg * 10) / 10 };
  });
  teamAvgGaps.sort((a, b) => b.avgGap - a.avgGap);
  const worstTeam = teamAvgGaps[0];
  if (!worstTeam) {
    throw new Error("Could not determine team with largest skill gap");
  }

  // B-1-1 radar data
  const b11Data = allData.filter((r) => r.org_code === "B-1-1");
  if (b11Data.length === 0) {
    throw new Error("B-1-1 skill_summary data not found");
  }
  const radarData = b11Data.map((r) => ({
    category: r.skill_category,
    categoryLabel: CATEGORY_LABELS[r.skill_category] ?? r.skill_category,
    avg_proficiency: r.avg_proficiency,
    required_level: r.required_level,
  }));

  // Heatmap data: unique teams and categories
  const categories = [...new Set(allData.map((r) => r.skill_category))];
  const teamNames = [...new Set(allData.map((r) => r.org_name))];
  const heatmapTeams = teamCodes.map((code) => {
    const teamRows = allData.filter((r) => r.org_code === code);
    const name = teamRows[0].org_name;
    const gapsByCategory: Record<string, number> = {};
    for (const row of teamRows) {
      gapsByCategory[row.skill_category] = row.gap;
    }
    return { code, name, gapsByCategory };
  });

  // B-1-1 critical skills detail
  const b11Technical = b11Data.find((r) => r.skill_category === "technical");
  const b11Domain = b11Data.find((r) => r.skill_category === "domain");

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
          <span className="text-neutral-900 font-medium">스킬관리</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">
          스킬관리 대시보드
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          팀별 스킬 보유 수준, 갭 분석, 핵심 부족 스킬
        </p>
      </div>

      {/* BFM Matrix */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Grid3X3 className="w-5 h-5 text-indigo-600" />
            BFM (Business Function Matrix) 구조도
          </CardTitle>
          <p className="text-sm text-neutral-500">
            책임레벨(Direct/Control/Execute) x 직군 매트릭스 -- 컴포넌트별 직무/스킬 분포
          </p>
        </CardHeader>
        <CardContent>
          <BFMMatrix />
        </CardContent>
      </Card>

      {/* HRD Browser */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5 text-blue-600" />
            현대자동차 R&D 직군 스킬 프레임워크
          </CardTitle>
          <p className="text-sm text-neutral-500">
            직군 선택 &rarr; Task 선택 &rarr; 스킬 선택 &rarr; L1-L5 레벨 정의 확인
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[520px] border-t border-neutral-200">
            <HRDBrowser />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-violet-50 to-white border-l-4 border-l-violet-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-violet-600" />
              <span className="text-sm text-neutral-600">평균 스킬 갭</span>
            </div>
            <p className="text-2xl font-bold text-violet-600">
              {avgGap}
              <span className="text-sm font-normal text-neutral-500 ml-1">
                Level
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white border-l-4 border-l-red-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-red-600" />
              <span className="text-sm text-neutral-600">
                심각한 갭 스킬 수
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {totalCriticalSkills}
              <span className="text-sm font-normal text-neutral-500 ml-1">
                건
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-neutral-600">가장 큰 갭 팀</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {worstTeam.name}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              평균 갭 {worstTeam.avgGap} Level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* B-1-1 Radar Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-lg">
              B-1-1팀 스킬 프로파일
            </CardTitle>
          </div>
          <p className="text-sm text-neutral-500">
            빨간 영역(보유)이 파란 점선(필요) 대비 크게 부족합니다
          </p>
        </CardHeader>
        <CardContent>
          <SkillsRadarChart radarData={radarData} />
        </CardContent>
      </Card>

      {/* Skill Gap Heatmap Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            팀별 스킬 갭 히트맵
          </CardTitle>
          <p className="text-sm text-neutral-500">
            갭 크기별 색상: 녹색(양호) / 노란색(주의) / 빨간색(심각)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    팀
                  </th>
                  {categories.map((cat) => (
                    <th
                      key={cat}
                      className="text-center py-3 px-4 font-semibold text-neutral-700"
                    >
                      {CATEGORY_LABELS[cat] ?? cat}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapTeams.map((team) => (
                  <tr
                    key={team.code}
                    className={`border-b border-neutral-100 ${
                      team.code === "B-1-1" ? "ring-1 ring-red-200" : ""
                    }`}
                  >
                    <td
                      className={`py-3 px-4 font-medium ${
                        team.code === "B-1-1"
                          ? "text-red-700 font-semibold"
                          : ""
                      }`}
                    >
                      {team.name}
                    </td>
                    {categories.map((cat) => {
                      const gap = team.gapsByCategory[cat];
                      if (gap === undefined) {
                        return (
                          <td key={cat} className="py-3 px-4 text-center text-neutral-400">
                            -
                          </td>
                        );
                      }
                      return (
                        <td
                          key={cat}
                          className={`py-3 px-4 text-center ${getGapCellColor(gap)}`}
                        >
                          {gap > 0 ? "+" : ""}{gap}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* B-1-1 Critical Skills Detail */}
      <Card className="mb-8 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-lg">
              B-1-1팀 핵심 부족 스킬
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {b11Technical && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                <div>
                  <p className="font-medium text-neutral-900">공정설계</p>
                  <p className="text-xs text-neutral-500">기술역량 카테고리</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-red-600 font-bold">
                      Level {b11Technical.avg_proficiency}
                    </span>
                    <span className="text-neutral-400 mx-2">&#8594;</span>
                    <span className="text-blue-600 font-bold">
                      필요 {b11Technical.required_level}
                    </span>
                  </p>
                  <Badge className={`text-xs mt-1 ${getGapColor(b11Technical.gap)}`}>
                    갭 {b11Technical.gap}
                  </Badge>
                </div>
              </div>
            )}
            {b11Domain && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                <div>
                  <p className="font-medium text-neutral-900">데이터분석</p>
                  <p className="text-xs text-neutral-500">
                    도메인전문성 카테고리
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-red-600 font-bold">
                      Level {b11Domain.avg_proficiency}
                    </span>
                    <span className="text-neutral-400 mx-2">&#8594;</span>
                    <span className="text-blue-600 font-bold">
                      필요 {b11Domain.required_level}
                    </span>
                  </p>
                  <Badge className={`text-xs mt-1 ${getGapColor(b11Domain.gap)}`}>
                    갭 {b11Domain.gap}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Link
          href="/agents/staffing"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
        >
          Agent에게 채용 요청
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
