"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Brain,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import Link from "next/link";

interface OrgUnit {
  org_code: string;
  org_name: string;
}

interface AgentResult {
  id: number;
  agent_type: string;
  target_org: string;
  result_title: string;
  result_summary: string;
  result_data: Record<string, unknown>;
  recommendations: string[];
}

interface PerformanceSkillPanelProps {
  results: AgentResult[];
  orgUnits: OrgUnit[];
}

function getOrgName(orgUnits: OrgUnit[], orgCode: string): string {
  const unit = orgUnits.find((u) => u.org_code === orgCode);
  if (!unit) {
    throw new Error(`Org unit not found for code: ${orgCode}`);
  }
  return unit.org_name;
}

function OCADiagnosisCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as {
    scores: { technical: number; leadership: number; domain: number };
  };
  const scores = data.scores;

  const radarData = [
    {
      subject: "기술역량",
      value: scores.technical,
      fullMark: 5,
    },
    {
      subject: "리더십",
      value: scores.leadership,
      fullMark: 5,
    },
    {
      subject: "도메인 전문성",
      value: scores.domain,
      fullMark: 5,
    },
  ];

  const lowScores = radarData.filter((d) => d.value < 2.5);

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-indigo-200 text-indigo-700 bg-indigo-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <Radar
                  name="역량 점수"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">역량 점수 상세</h4>
            {radarData.map((item) => {
              const isLow = item.value < 2.5;
              const pct = (item.value / 5) * 100;
              return (
                <div key={item.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.subject}</span>
                    <span
                      className={
                        isLow
                          ? "text-red-600 font-semibold"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {item.value.toFixed(1)} / 5.0
                      {isLow && (
                        <AlertTriangle className="w-3.5 h-3.5 inline ml-1 text-red-500" />
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isLow ? "bg-red-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {lowScores.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-center gap-1.5 text-sm text-red-700 font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {lowScores.map((s) => s.subject).join(", ")} 역량 부족
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI 권고사항
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function RACIMatrixCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as { clarity_score: number };
  const score = data.clarity_score;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (score / 100) * circumference;
  const scoreColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-amber-200 text-amber-700 bg-amber-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>
                  {score}
                </span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">역할 명확도 점수</p>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">진단 결과</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">역할 명확도</span>
                <span className="text-sm font-semibold" style={{ color: scoreColor }}>
                  {score >= 80 ? "양호" : score >= 60 ? "보통" : "미흡"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">R/A 구분 수준</span>
                <span className="text-sm font-medium text-amber-600">개선 필요</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">업무 중복도</span>
                <span className="text-sm font-medium text-gray-700">
                  {100 - score}% 중복 영역
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI 권고사항
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillGapCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as {
    gaps: { skill: string; current: number; required: number }[];
  };
  const gaps = data.gaps;

  const chartData = gaps.map((g) => ({
    skill: g.skill,
    "현재 수준": g.current,
    "필요 수준": g.required,
  }));

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-red-200 text-red-700 bg-red-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  type="category"
                  dataKey="skill"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="현재 수준" fill="#fca5a5" radius={[0, 4, 4, 0]} />
                <Bar dataKey="필요 수준" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">스킬 갭 상세</h4>
            {gaps.map((g) => {
              const gapValue = g.required - g.current;
              return (
                <div
                  key={g.skill}
                  className="p-3 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {g.skill}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      GAP: -{gapValue.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>현재 {g.current.toFixed(1)}</span>
                    <span>{"-->"}</span>
                    <span>필요 {g.required.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI 권고사항
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PerformanceSkillPanel({
  results,
  orgUnits,
}: PerformanceSkillPanelProps) {
  const ocaResult = results.find((r) => r.result_title === "OCA 진단 결과");
  const raciResult = results.find((r) => r.result_title === "RACI 매트릭스");
  const skillGapResult = results.find(
    (r) => r.result_title === "스킬 갭 리포트"
  );

  if (!ocaResult || !raciResult || !skillGapResult) {
    throw new Error(
      "Missing required agent results for performance_skill. Expected: OCA 진단 결과, RACI 매트릭스, 스킬 갭 리포트"
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/agents" className="hover:text-gray-700 transition-colors">
          HR Agents
        </Link>
        <span>/</span>
        <span className="text-gray-900">성과/스킬 Agent</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">성과/스킬 Agent</h1>
        <p className="text-sm text-gray-500 mt-1">
          조직역량 진단(OCA), 역할 분석(RACI), 스킬 갭 리포트
        </p>
      </div>

      {/* Agent Status Bar */}
      <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <Bot className="w-5 h-5 text-indigo-600" />
        <span className="text-sm text-gray-600">AI 분석 결과</span>
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          AI 분석 완료
        </Badge>
        <span className="text-xs text-gray-400 ml-auto">
          {results.length}건 분석 완료
        </span>
      </div>

      {/* Result Cards */}
      <div className="space-y-6">
        <OCADiagnosisCard
          result={ocaResult}
          orgName={getOrgName(orgUnits, ocaResult.target_org)}
        />
        <RACIMatrixCard
          result={raciResult}
          orgName={getOrgName(orgUnits, raciResult.target_org)}
        />
        <SkillGapCard
          result={skillGapResult}
          orgName={getOrgName(orgUnits, skillGapResult.target_org)}
        />
      </div>
    </div>
  );
}
