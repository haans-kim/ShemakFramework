import Link from "next/link";
import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  AlertTriangle,
  UserMinus,
  ArrowRight,
  ChevronRight,
  Users,
  Target,
} from "lucide-react";
import { FteGapBarChart } from "@/components/planning/PlanningCharts";

export const dynamic = "force-dynamic";

interface PlanningRow {
  org_code: string;
  org_name: string;
  year: number;
  current_headcount: number;
  forecast_headcount: number;
  fte_required: number;
  fte_actual: number;
  gap_status: string;
}

function getGapBadgeClass(status: string): string {
  if (status === "shortage") return "bg-red-100 text-red-700 border-red-200";
  if (status === "surplus") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function getGapLabel(status: string): string {
  if (status === "shortage") return "부족";
  if (status === "surplus") return "여유";
  return "균형";
}

export default function PlanningPage() {
  const allData = db
    .prepare(
      `SELECT p.org_code, o.org_name, p.year, p.current_headcount,
              p.forecast_headcount, p.fte_required, p.fte_actual, p.gap_status
       FROM planning_summary p
       JOIN org_units o ON p.org_code = o.org_code
       ORDER BY o.display_order, p.year`
    )
    .all() as PlanningRow[];

  if (allData.length === 0) {
    throw new Error("planning_summary data not found");
  }

  // 2025 data for KPIs and bar chart
  const data2025 = allData.filter((r) => r.year === 2025);
  if (data2025.length === 0) {
    throw new Error("planning_summary data not found for year 2025");
  }

  // KPI calculations
  const shortageCount = data2025.filter(
    (r) => r.gap_status === "shortage"
  ).length;
  const avgFteGap =
    Math.round(
      (data2025.reduce((sum, r) => sum + (r.fte_required - r.fte_actual), 0) /
        data2025.length) *
        10
    ) / 10;
  const totalAdditionalNeeded = data2025
    .filter((r) => r.gap_status === "shortage")
    .reduce(
      (sum, r) => sum + Math.ceil(r.fte_required - r.fte_actual),
      0
    );

  // Bar chart data (2025)
  const fteBarData = data2025.map((r) => ({
    team: r.org_name,
    org_code: r.org_code,
    fte_required: r.fte_required,
    fte_actual: r.fte_actual,
    gap_status: r.gap_status,
  }));

  // B-1-1 3-year forecast
  const b11Forecast = allData.filter((r) => r.org_code === "B-1-1");
  if (b11Forecast.length === 0) {
    throw new Error("B-1-1 planning_summary data not found");
  }

  // Scenario data for B-1-1 (computed from DB values)
  const b11Current = b11Forecast.find((r) => r.year === 2025);
  if (!b11Current) {
    throw new Error("B-1-1 2025 planning data not found");
  }
  const currentGap = b11Current.fte_required - b11Current.fte_actual;

  const scenarios = [
    {
      name: "현재 유지",
      description: "추가 채용 없이 현 인원 유지",
      additionalHires: 0,
      projectedGap: Math.round(currentGap * 10) / 10,
      gapStatus: "shortage" as const,
      borderColor: "border-l-red-500",
      bgColor: "from-red-50 to-white",
    },
    {
      name: "2명 추가 채용",
      description: "공정설계 + 데이터분석 전문가",
      additionalHires: 2,
      projectedGap: Math.round((currentGap - 2) * 10) / 10,
      gapStatus: (currentGap - 2 > 1 ? "shortage" : "balanced") as "shortage" | "balanced",
      borderColor:
        currentGap - 2 > 1 ? "border-l-amber-500" : "border-l-emerald-500",
      bgColor:
        currentGap - 2 > 1 ? "from-amber-50 to-white" : "from-emerald-50 to-white",
    },
    {
      name: "3명 추가 + 교육",
      description: "3명 채용 + 기존 인원 스킬업 교육",
      additionalHires: 3,
      projectedGap: Math.round((currentGap - 3.5) * 10) / 10,
      gapStatus: (currentGap - 3.5 > 1 ? "shortage" : "balanced") as "shortage" | "balanced",
      borderColor: "border-l-emerald-500",
      bgColor: "from-emerald-50 to-white",
    },
  ];

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
          <span className="text-neutral-900 font-medium">인력계획</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">
          인력계획 대시보드
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          인원 예측, FTE 갭 분석, 시나리오 비교
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-red-50 to-white border-l-4 border-l-red-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <UserMinus className="w-4 h-4 text-red-600" />
              <span className="text-sm text-neutral-600">인력 부족 팀</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {shortageCount}
              <span className="text-sm font-normal text-neutral-500 ml-1">
                팀
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-neutral-600">평균 FTE 갭</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {avgFteGap > 0 ? "+" : ""}
              {avgFteGap}
              <span className="text-sm font-normal text-neutral-500 ml-1">
                FTE
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-neutral-600">
                총 필요 추가 인원
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {totalAdditionalNeeded}
              <span className="text-sm font-normal text-neutral-500 ml-1">
                명
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FTE Gap Bar Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            팀별 FTE 갭 분석 (2025)
          </CardTitle>
          <p className="text-sm text-neutral-500">
            빨간색 막대는 인력 부족 팀을 나타냅니다
          </p>
        </CardHeader>
        <CardContent>
          <FteGapBarChart fteData={fteBarData} />
        </CardContent>
      </Card>

      {/* B-1-1 3-Year Forecast */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-neutral-900">
            B-1-1팀 3개년 인력 예측
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                  연도
                </th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                  현재 인원
                </th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                  예측 인원
                </th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                  필요 FTE
                </th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                  실제 FTE
                </th>
                <th className="text-center py-3 px-4 font-semibold text-neutral-700">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {b11Forecast.map((row) => (
                <tr
                  key={row.year}
                  className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{row.year}</td>
                  <td className="py-3 px-4 text-right">
                    {row.current_headcount}명
                  </td>
                  <td className="py-3 px-4 text-right">
                    {row.forecast_headcount}명
                  </td>
                  <td className="py-3 px-4 text-right">{row.fte_required}</td>
                  <td className="py-3 px-4 text-right">{row.fte_actual}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={`text-xs ${getGapBadgeClass(row.gap_status)}`}>
                      {getGapLabel(row.gap_status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          B-1-1팀 시나리오 비교
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.name}
              className={`border-l-4 ${scenario.borderColor} bg-gradient-to-br ${scenario.bgColor} hover:shadow-md transition-all`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{scenario.name}</CardTitle>
                <p className="text-xs text-neutral-500">
                  {scenario.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">추가 채용</span>
                    <span className="font-medium">
                      {scenario.additionalHires}명
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">예상 갭</span>
                    <span
                      className={`font-bold ${
                        scenario.projectedGap > 1
                          ? "text-red-600"
                          : scenario.projectedGap > 0
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }`}
                    >
                      {scenario.projectedGap > 0 ? "+" : ""}
                      {scenario.projectedGap} FTE
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">상태</span>
                    <Badge
                      className={`text-xs ${getGapBadgeClass(scenario.gapStatus)}`}
                    >
                      {getGapLabel(scenario.gapStatus)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Link
          href="/pan-hr/skills"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          부족 스킬 확인
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
