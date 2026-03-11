"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  ZAxis,
  ReferenceLine,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Users,
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";

interface EngagementRow {
  org_code: string;
  org_name: string;
  survey_date: string;
  engagement_score: number;
  high_engagement_pct: number;
  risk_pct: number;
  top_factor: string;
}

interface EngagementChartsProps {
  data: EngagementRow[];
  avgEngagement: number;
  avgHighPct: number;
  avgRiskPct: number;
}

function getScoreColor(score: number): string {
  if (score >= 3.5) return "#10b981";
  if (score >= 3.0) return "#f59e0b";
  return "#ef4444";
}

function getScoreBg(score: number): string {
  if (score >= 3.5) return "bg-green-50";
  if (score >= 3.0) return "bg-amber-50";
  return "bg-red-50";
}

function getScoreText(score: number): string {
  if (score >= 3.5) return "text-green-700";
  if (score >= 3.0) return "text-amber-700";
  return "text-red-700";
}

export default function EngagementCharts({
  data,
  avgEngagement,
  avgHighPct,
  avgRiskPct,
}: EngagementChartsProps) {
  const sortedByScore = [...data].sort(
    (a, b) => b.engagement_score - a.engagement_score
  );

  const scatterData = data.map((d) => ({
    x: d.engagement_score,
    y: d.risk_pct,
    name: d.org_name,
    org_code: d.org_code,
  }));

  const factorCounts: Record<string, { count: number; teams: string[] }> = {};
  for (const row of data) {
    if (!factorCounts[row.top_factor]) {
      factorCounts[row.top_factor] = { count: 0, teams: [] };
    }
    factorCounts[row.top_factor].count += 1;
    factorCounts[row.top_factor].teams.push(row.org_name);
  }
  const factorEntries = Object.entries(factorCounts).sort(
    (a, b) => b[1].count - a[1].count
  );

  const b11 = data.find((d) => d.org_code === "B-1-1");

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-neutral-600">
                전사 평균 몰입도
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgEngagement.toFixed(2)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">5점 만점 기준</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-neutral-600">
                고몰입 비율 평균
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgHighPct.toFixed(1)}%
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              고몰입(상위) 직원 비율
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-neutral-600">
                위험군 비율 평균
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgRiskPct.toFixed(1)}%
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              몰입도 하위 위험군
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Bar Chart - Engagement Score per Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-5 h-5 text-amber-600" />
            팀별 몰입도 점수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedByScore}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="org_name"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toFixed(1),
                    "몰입도 점수",
                  ]}
                />
                <ReferenceLine
                  x={avgEngagement}
                  stroke="#6b7280"
                  strokeDasharray="3 3"
                  label={{
                    value: `전사 평균 ${avgEngagement.toFixed(1)}`,
                    position: "top",
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />
                <Bar dataKey="engagement_score" radius={[0, 4, 4, 0]}>
                  {sortedByScore.map((entry) => (
                    <Cell
                      key={entry.org_code}
                      fill={getScoreColor(entry.engagement_score)}
                      stroke={
                        entry.org_code === "B-1-1" ? "#ef4444" : "transparent"
                      }
                      strokeWidth={entry.org_code === "B-1-1" ? 2 : 0}
                    />
                  ))}
                  <LabelList
                    dataKey="engagement_score"
                    position="right"
                    formatter={(value) => Number(value).toFixed(1)}
                    style={{ fontSize: 11, fill: "#374151" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: "#10b981" }}
              />
              3.5 이상 (양호)
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: "#f59e0b" }}
              />
              3.0~3.5 (주의)
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: "#ef4444" }}
              />
              3.0 미만 (위험)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Scatter Chart - Engagement vs Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-5 h-5 text-blue-600" />
            몰입도 vs 위험군 비율
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[2.5, 4.5]}
                  name="몰입도"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "몰입도 점수",
                    position: "bottom",
                    offset: 0,
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="위험군 비율"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "위험군 비율 (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 12,
                  }}
                />
                <ZAxis range={[120, 120]} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "몰입도") return [Number(value).toFixed(1), "몰입도"];
                    return [`${Number(value).toFixed(1)}%`, "위험군 비율"];
                  }}
                  labelFormatter={(_unknown, payload) => {
                    const items = payload as unknown as Array<{ payload?: { name?: string } }>;
                    const item = items[0];
                    if (item?.payload?.name) return item.payload.name;
                    return "";
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry) => (
                    <Cell
                      key={entry.org_code}
                      fill={
                        entry.org_code === "B-1-1" ? "#ef4444" : "#3b82f6"
                      }
                      stroke={
                        entry.org_code === "B-1-1" ? "#dc2626" : "#2563eb"
                      }
                      strokeWidth={entry.org_code === "B-1-1" ? 2 : 1}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            ※ 좌상단일수록 위험 (낮은 몰입, 높은 위험군) -- B-1-1팀 주목
          </p>
        </CardContent>
      </Card>

      {/* Factor Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="w-5 h-5 text-rose-500" />
            주요 영향 요인 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-600">
                    팀
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-600">
                    몰입도
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-600">
                    위험군 비율
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-600">
                    주요 영향 요인
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedByScore.map((row) => (
                  <tr
                    key={row.org_code}
                    className={`border-b border-gray-100 ${
                      row.org_code === "B-1-1" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">
                      {row.org_name}
                      {row.org_code === "B-1-1" && (
                        <AlertTriangle className="inline w-3.5 h-3.5 text-red-500 ml-1" />
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getScoreBg(row.engagement_score)} ${getScoreText(row.engagement_score)}`}
                      >
                        {row.engagement_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={
                          row.risk_pct >= 30
                            ? "text-red-600 font-medium"
                            : "text-gray-700"
                        }
                      >
                        {row.risk_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-700">
                      {row.top_factor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">
              요인별 빈도
            </p>
            <div className="flex flex-wrap gap-2">
              {factorEntries.map(([factor, info]) => (
                <span
                  key={factor}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                >
                  {factor}
                  <span className="font-semibold text-gray-900">
                    {info.count}팀
                  </span>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B-1-1 Alert */}
      {b11 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">
                  B-1-1팀 몰입도 위험
                </p>
                <p className="text-sm text-red-700 mt-1">
                  몰입도 점수 {b11.engagement_score.toFixed(1)}, 위험군 비율{" "}
                  {b11.risk_pct.toFixed(1)}% -- 전사 최저 수준. 주요 영향 요인:{" "}
                  {b11.top_factor}. 즉각적인 조직 진단 및 개선 조치 필요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Link
          href="/optic-view/org-risk"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          조직 리스크 분석
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
