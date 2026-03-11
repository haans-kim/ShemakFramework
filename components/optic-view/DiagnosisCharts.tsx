"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stethoscope,
  AlertTriangle,
  Target,
  Layers,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface TeamDiagnosis {
  org_code: string;
  org_name: string;
  efficiency: number;
  work_hours: number;
  overtime: number;
  engagement: number;
  skill_level: number;
  composite_score: number;
  grade: string;
  main_issue: string;
}

interface RadarDimension {
  dimension: string;
  b11_value: number;
  company_avg: number;
}

interface ShapFactor {
  factor: string;
  importance: number;
  direction: string;
}

interface DiagnosisChartsProps {
  teams: TeamDiagnosis[];
  radarData: RadarDimension[];
  shapFactors: ShapFactor[];
  companyHealthScore: number;
  diagnosisAreaCount: number;
  improvementTeamCount: number;
}

function getGradeStyle(grade: string): { bg: string; text: string } {
  switch (grade) {
    case "A":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "B":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "C":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    case "D":
      return { bg: "bg-red-100", text: "text-red-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-700";
  if (score >= 50) return "text-amber-700";
  return "text-red-700";
}

export default function DiagnosisCharts({
  teams,
  radarData,
  shapFactors,
  companyHealthScore,
  diagnosisAreaCount,
  improvementTeamCount,
}: DiagnosisChartsProps) {
  const b11 = teams.find((t) => t.org_code === "B-1-1");

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-neutral-600">
                전사 건강 점수
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {companyHealthScore.toFixed(0)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              100점 만점 종합 점수
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-neutral-600">진단 영역 수</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {diagnosisAreaCount}개
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              분석 대상 진단 차원
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-red-600" />
              <span className="text-sm text-neutral-600">
                개선 필요 팀 수
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {improvementTeamCount}팀
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              종합등급 C 이하
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart - B-1-1 vs Company Average */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5 text-teal-600" />
            B-1-1팀 vs 전사 평균 -- 조직 건강성 레이더
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 12, fill: "#374151" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="전사 평균"
                  dataKey="company_avg"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="B-1-1팀"
                  dataKey="b11_value"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Legend />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toFixed(0) : String(value),
                    String(name),
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            ※ 0~100 정규화 점수. B-1-1팀이 전사 평균 대비 전 영역에서 하회.
          </p>
        </CardContent>
      </Card>

      {/* SHAP-style Factor Importance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="w-5 h-5 text-purple-600" />
            리스크 요인 중요도 (SHAP 분석)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shapFactors}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "중요도 (%)",
                    position: "bottom",
                    offset: 0,
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="factor"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${typeof value === "number" ? value.toFixed(0) : String(value)}%`,
                    "중요도",
                  ]}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {shapFactors.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.direction === "negative"
                          ? "#ef4444"
                          : "#f59e0b"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: "#ef4444" }}
              />
              위험 증가 요인
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: "#f59e0b" }}
              />
              주의 요인
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            ※ ML 모델 기반 요인 중요도 분석 결과 (SHAP value mockup)
          </p>
        </CardContent>
      </Card>

      {/* Team Diagnosis Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            팀별 종합 진단
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
                    종합등급
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    근무효율
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    몰입도
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-neutral-600">
                    스킬수준
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-600">
                    주요 이슈
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const gradeStyle = getGradeStyle(team.grade);
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${gradeStyle.bg} ${gradeStyle.text}`}
                        >
                          {team.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={getScoreColor(team.efficiency)}>
                          {team.efficiency.toFixed(0)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={getScoreColor(team.engagement)}>
                          {team.engagement.toFixed(0)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={getScoreColor(team.skill_level)}>
                          {team.skill_level.toFixed(0)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-700">
                        {team.main_issue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            ※ 점수는 0~100 정규화. 등급: A(80+), B(65~80), C(50~65), D(50
            미만)
          </p>
        </CardContent>
      </Card>

      {/* B-1-1 Improvement Recommendations */}
      {b11 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-800">
              <Lightbulb className="w-5 h-5 text-red-600" />
              B-1-1팀 개선 권고사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    업무량 즉시 재분배
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    초과근무율 {b11.overtime.toFixed(0)}점(정규화) -- 전사 최고
                    수준. 업무 프로세스 점검 및 인력 충원 검토 필요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    리더십 역량 강화 프로그램
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    리더십 스킬 갭 1.6 (목표 3.5 vs 실제 1.9) -- 전사 최대 갭.
                    리더십 코칭 및 관리자 교육 즉시 실행.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    몰입도 개선 TF 운영
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    몰입도 점수 {b11.engagement.toFixed(0)}점(정규화), 전사
                    최저. 조직문화 진단, 1:1 면담, 동기부여 프로그램 도입 권장.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    기술 역량 집중 교육
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    기술 스킬 갭 2.0 (목표 4.0 vs 실제 2.0). 필수 기술 교육
                    과정 수립 및 멘토링 프로그램 운영.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Link
          href="/agents"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          HR Agent 분석 요청
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
