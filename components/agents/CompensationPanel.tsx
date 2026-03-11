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
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
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

interface CompensationPanelProps {
  results: AgentResult[];
  orgUnits: OrgUnit[];
}

function getOrgName(orgUnits: OrgUnit[], orgCode: string): string {
  if (orgCode === "COMP") return "전사";
  const unit = orgUnits.find((u) => u.org_code === orgCode);
  if (!unit) {
    throw new Error(`Org unit not found for code: ${orgCode}`);
  }
  return unit.org_name;
}

function GaugeCircle({
  value,
  max,
  label,
  color,
  suffix,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  suffix: string;
}) {
  const circumference = 2 * Math.PI * 45;
  const pct = value / max;
  const dashOffset = circumference - pct * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg
          className="w-36 h-36 transform -rotate-90"
          viewBox="0 0 100 100"
        >
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
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {value}
            {suffix}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  );
}

function SalarySimulationCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as {
    market_ratio: number;
    satisfaction: number;
  };
  const marketPct = Math.round(data.market_ratio * 100);
  const marketColor =
    marketPct >= 95 ? "#10b981" : marketPct >= 85 ? "#f59e0b" : "#ef4444";
  const satColor =
    data.satisfaction >= 3.5
      ? "#10b981"
      : data.satisfaction >= 3.0
        ? "#f59e0b"
        : "#ef4444";

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-orange-200 text-orange-700 bg-orange-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <GaugeCircle
              value={marketPct}
              max={100}
              label="시장 대비 급여 수준"
              color={marketColor}
              suffix="%"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">보상 분석 상세</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">시장 대비 비율</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: marketColor }}
                >
                  {marketPct}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">보상 만족도</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: satColor }}
                >
                  {data.satisfaction.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">평가</span>
                <span className="text-sm font-medium text-gray-700">
                  {marketPct >= 95
                    ? "적정"
                    : marketPct >= 85
                      ? "소폭 하회"
                      : "대폭 하회"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI 권고사항
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function CorrelationCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as { correlation: number };
  const corr = data.correlation;
  const corrPct = Math.round(corr * 100);
  const corrColor =
    corr >= 0.7 ? "#10b981" : corr >= 0.4 ? "#3b82f6" : "#f59e0b";
  const corrLabel =
    corr >= 0.7 ? "강한 양의 상관" : corr >= 0.4 ? "보통 양의 상관" : "약한 상관";

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-blue-200 text-blue-700 bg-blue-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Correlation Visual */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full border-4 border-gray-100 flex items-center justify-center">
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
                style={{ backgroundColor: `${corrColor}15` }}
              >
                <span
                  className="text-3xl font-bold"
                  style={{ color: corrColor }}
                >
                  {corr.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  상관계수(r)
                </span>
              </div>
            </div>
            <p className="text-sm font-medium mt-3" style={{ color: corrColor }}>
              {corrLabel}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">분석 상세</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">상관계수</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: corrColor }}
                >
                  r = {corr.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">설명력 (r^2)</span>
                <span className="text-sm font-medium text-gray-700">
                  {(corr * corr * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">해석</span>
                <span className="text-sm font-medium text-gray-700">
                  평가가 높을수록 몰입도 {corrLabel === "강한 양의 상관" ? "높음" : "증가 경향"}
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>0</span>
                <span>상관계수 강도</span>
                <span>1</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${corrPct}%`,
                    backgroundColor: corrColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI 권고사항
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function BenchmarkCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as { overall_ratio: number };
  const overallPct = Math.round(data.overall_ratio * 100);
  const overallColor =
    overallPct >= 95 ? "#10b981" : overallPct >= 85 ? "#f59e0b" : "#ef4444";

  const benchmarkItems = [
    { label: "기술직군", ratio: 97, color: "#10b981" },
    { label: "관리직군", ratio: 93, color: "#f59e0b" },
    { label: "연구직군", ratio: 91, color: "#f59e0b" },
    { label: "영업직군", ratio: 96, color: "#10b981" },
  ];

  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <GaugeCircle
              value={overallPct}
              max={100}
              label="전사 보상 수준 (시장 대비)"
              color={overallColor}
              suffix="%"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              직군별 시장 대비 수준
            </h4>
            <div className="space-y-3">
              {benchmarkItems.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span
                      className="font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.ratio}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.ratio}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            AI 권고사항
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompensationPanel({
  results,
  orgUnits,
}: CompensationPanelProps) {
  const salaryResult = results.find(
    (r) => r.result_title === "급여 시뮬레이션"
  );
  const correlationResult = results.find(
    (r) => r.result_title === "평가-몰입 분석"
  );
  const benchmarkResult = results.find(
    (r) => r.result_title === "전사 보상 벤치마크"
  );

  if (!salaryResult || !correlationResult || !benchmarkResult) {
    throw new Error(
      "Missing required agent results for compensation. Expected: 급여 시뮬레이션, 평가-몰입 분석, 전사 보상 벤치마크"
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
        <span className="text-gray-900">보상 Agent</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">보상 Agent</h1>
        <p className="text-sm text-gray-500 mt-1">
          급여 시뮬레이션, 평가-몰입 분석, 보상 벤치마크
        </p>
      </div>

      {/* Agent Status Bar */}
      <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <Bot className="w-5 h-5 text-orange-600" />
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
        <SalarySimulationCard
          result={salaryResult}
          orgName={getOrgName(orgUnits, salaryResult.target_org)}
        />
        <CorrelationCard
          result={correlationResult}
          orgName={getOrgName(orgUnits, correlationResult.target_org)}
        />
        <BenchmarkCard
          result={benchmarkResult}
          orgName={getOrgName(orgUnits, benchmarkResult.target_org)}
        />
      </div>
    </div>
  );
}
