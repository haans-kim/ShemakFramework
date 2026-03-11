"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  AlertTriangle,
  Flame,
  Clock,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface TeamRiskData {
  org_code: string;
  org_name: string;
  headcount: number;
  burnout_risk_level: string;
  overtime_ratio: number;
  avg_efficiency: number;
  engagement_score: number;
  risk_pct: number;
  avg_work_hours: number;
}

interface OrgRiskChartsProps {
  teams: TeamRiskData[];
  highRiskCount: number;
  burnoutCount: number;
  avgOvertimeRatio: number;
  companyRiskScore: number;
}

function getRiskCellColor(
  metric: string,
  value: number | string
): { bg: string; text: string } {
  switch (metric) {
    case "burnout":
      if (value === "high") return { bg: "bg-red-100", text: "text-red-800" };
      if (value === "medium")
        return { bg: "bg-amber-100", text: "text-amber-800" };
      return { bg: "bg-green-100", text: "text-green-800" };
    case "overtime": {
      const ot = Number(value);
      if (ot >= 30) return { bg: "bg-red-100", text: "text-red-800" };
      if (ot >= 15) return { bg: "bg-amber-100", text: "text-amber-800" };
      return { bg: "bg-green-100", text: "text-green-800" };
    }
    case "efficiency": {
      const eff = Number(value);
      if (eff < 70) return { bg: "bg-red-100", text: "text-red-800" };
      if (eff < 80) return { bg: "bg-amber-100", text: "text-amber-800" };
      return { bg: "bg-green-100", text: "text-green-800" };
    }
    case "engagement": {
      const eng = Number(value);
      if (eng < 3.0) return { bg: "bg-red-100", text: "text-red-800" };
      if (eng < 3.5) return { bg: "bg-amber-100", text: "text-amber-800" };
      return { bg: "bg-green-100", text: "text-green-800" };
    }
    case "risk_pct": {
      const rp = Number(value);
      if (rp >= 30) return { bg: "bg-red-100", text: "text-red-800" };
      if (rp >= 20) return { bg: "bg-amber-100", text: "text-amber-800" };
      return { bg: "bg-green-100", text: "text-green-800" };
    }
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

function getBurnoutCellColor(level: string): {
  bg: string;
  text: string;
  label: string;
} {
  if (level === "high")
    return { bg: "bg-red-100", text: "text-red-800", label: "▲ 고위험" };
  if (level === "medium")
    return { bg: "bg-amber-100", text: "text-amber-800", label: "● 주의" };
  return { bg: "bg-green-100", text: "text-green-800", label: "▼ 정상" };
}

function getBubbleColor(level: string): string {
  if (level === "high") return "#ef4444";
  if (level === "medium") return "#f59e0b";
  return "#3b82f6";
}

export default function OrgRiskCharts({
  teams,
  highRiskCount,
  burnoutCount,
  avgOvertimeRatio,
  companyRiskScore,
}: OrgRiskChartsProps) {
  const b11 = teams.find((t) => t.org_code === "B-1-1");

  const scatterData = teams.map((t) => ({
    x: t.overtime_ratio,
    y: t.risk_pct,
    z: t.headcount,
    name: t.org_name,
    org_code: t.org_code,
    burnout: t.burnout_risk_level,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-sm text-neutral-600">고위험 팀 수</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {highRiskCount}팀
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              위험군 비율 30% 이상
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-neutral-600">
                번아웃 위험 팀 수
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {burnoutCount}팀
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              번아웃 위험도 high/medium
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-neutral-600">
                평균 초과근무율
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgOvertimeRatio.toFixed(1)}%
            </p>
            <p className="text-xs text-neutral-500 mt-1">전사 팀 평균</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-neutral-600">
                전사 위험 점수
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {companyRiskScore.toFixed(0)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              100점 만점 (낮을수록 양호)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Heatmap Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-5 h-5 text-red-600" />
            리스크 히트맵
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
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    번아웃 위험
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    초과근무율
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    효율성
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    몰입도
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    위험군 비율
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const burnoutStyle = getBurnoutCellColor(
                    team.burnout_risk_level
                  );
                  const overtimeStyle = getRiskCellColor(
                    "overtime",
                    team.overtime_ratio
                  );
                  const efficiencyStyle = getRiskCellColor(
                    "efficiency",
                    team.avg_efficiency
                  );
                  const engagementStyle = getRiskCellColor(
                    "engagement",
                    team.engagement_score
                  );
                  const riskPctStyle = getRiskCellColor(
                    "risk_pct",
                    team.risk_pct
                  );
                  return (
                    <tr
                      key={team.org_code}
                      className={`border-b border-gray-100 ${
                        team.org_code === "B-1-1" ? "bg-red-50/50" : ""
                      }`}
                    >
                      <td className="py-2 px-3 font-medium">
                        {team.org_name}
                        {team.org_code === "B-1-1" && (
                          <AlertTriangle className="inline w-3.5 h-3.5 text-red-500 ml-1" />
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${burnoutStyle.bg} ${burnoutStyle.text}`}
                        >
                          {burnoutStyle.label}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${overtimeStyle.bg} ${overtimeStyle.text}`}
                        >
                          {team.overtime_ratio.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${efficiencyStyle.bg} ${efficiencyStyle.text}`}
                        >
                          {team.avg_efficiency.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${engagementStyle.bg} ${engagementStyle.text}`}
                        >
                          {team.engagement_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${riskPctStyle.bg} ${riskPctStyle.text}`}
                        >
                          {team.risk_pct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-red-100" />
              위험
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-amber-100" />
              주의
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-green-100" />
              양호
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Scatter Chart - Overtime vs Risk with bubble size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            초과근무율 vs 위험군 비율 (버블: 인원수)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="초과근무율"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "초과근무율 (%)",
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
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[80, 300]}
                  name="인원수"
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "초과근무율") return [`${Number(value).toFixed(1)}%`, name];
                    if (name === "위험군 비율") return [`${Number(value).toFixed(1)}%`, name];
                    return [`${value}명`, name];
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
                      fill={getBubbleColor(entry.burnout)}
                      fillOpacity={0.7}
                      stroke={getBubbleColor(entry.burnout)}
                      strokeWidth={entry.org_code === "B-1-1" ? 2 : 1}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#ef4444" }}
              />
              번아웃 고위험
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#f59e0b" }}
              />
              주의
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#3b82f6" }}
              />
              정상
            </span>
            <span className="text-neutral-400">|</span>
            <span>버블 크기 = 팀 인원수</span>
          </div>
        </CardContent>
      </Card>

      {/* B-1-1 Detailed Risk Profile */}
      {b11 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              B-1-1팀 상세 리스크 프로필
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">번아웃 위험</p>
                <p className="text-lg font-bold text-red-700">
                  ▲ {b11.burnout_risk_level.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">초과근무율</p>
                <p className="text-lg font-bold text-red-700">
                  {b11.overtime_ratio.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">근무 효율</p>
                <p className="text-lg font-bold text-red-700">
                  {b11.avg_efficiency.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">몰입도</p>
                <p className="text-lg font-bold text-red-700">
                  {b11.engagement_score.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">위험군 비율</p>
                <p className="text-lg font-bold text-red-700">
                  {b11.risk_pct.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-red-200">
              <p className="text-sm text-red-800">
                B-1-1팀은 전사에서 유일한 번아웃 고위험 팀으로, 초과근무율
                {b11.overtime_ratio.toFixed(1)}%, 효율성{" "}
                {b11.avg_efficiency.toFixed(1)}%로 전사 최저 수준입니다. 평균
                근무시간 {b11.avg_work_hours.toFixed(1)}시간으로 과도한 업무량이
                확인되며, 즉각적인 업무 재분배 및 인력 충원이 필요합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Link
          href="/optic-view/hr-diagnosis"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          인력수준 진단
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
