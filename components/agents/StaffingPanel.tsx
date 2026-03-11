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
  Users,
  Building2,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  UserPlus,
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

interface StaffingPanelProps {
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

function HiringRequirementsCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as {
    positions: number;
    skills: string[];
  };

  return (
    <Card className="border-l-4 border-l-cyan-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-cyan-200 text-cyan-700 bg-cyan-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Positions Visual */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 rounded-full border-4 border-cyan-100 flex items-center justify-center bg-cyan-50">
              <div className="text-center">
                <span className="text-4xl font-bold text-cyan-700">
                  {data.positions}
                </span>
                <p className="text-xs text-cyan-600 mt-1">충원 필요 인원</p>
              </div>
            </div>
          </div>

          {/* Skills & Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">필요 스킬</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-sm px-3 py-1.5 border-cyan-200 text-cyan-700 bg-cyan-50"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">충원 유형</span>
                <span className="text-sm font-medium text-cyan-700">
                  경력직 우선
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">긴급도</span>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                  높음
                </Badge>
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
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkloadCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as { workload_index: number };
  const indexPct = Math.round(data.workload_index * 100);
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (indexPct / 100) * circumference;

  const statusColor =
    indexPct >= 90
      ? "#ef4444"
      : indexPct >= 80
        ? "#f59e0b"
        : indexPct >= 60
          ? "#10b981"
          : "#3b82f6";
  const statusLabel =
    indexPct >= 90
      ? "과부하"
      : indexPct >= 80
        ? "적정"
        : indexPct >= 60
          ? "여유"
          : "저활용";

  return (
    <Card className="border-l-4 border-l-violet-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-violet-200 text-violet-700 bg-violet-50"
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
              <svg
                className="w-40 h-40 transform -rotate-90"
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
                  stroke={statusColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold"
                  style={{ color: statusColor }}
                >
                  {indexPct}%
                </span>
                <span className="text-xs text-gray-500 mt-1">워크로드</span>
              </div>
            </div>
            <Badge
              className="mt-2 text-xs"
              style={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
                borderColor: `${statusColor}30`,
              }}
            >
              {statusLabel}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">워크로드 상세</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">워크로드 지수</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: statusColor }}
                >
                  {data.workload_index.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">상태</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: statusColor }}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">인력 조정 필요</span>
                <span className="text-sm font-medium text-gray-700">
                  {indexPct >= 90 ? "증원 필요" : "현 수준 유지"}
                </span>
              </div>
            </div>

            {/* Scale indicator */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>저활용</span>
                <span>적정</span>
                <span>과부하</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 relative">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${indexPct}%`,
                    backgroundColor: statusColor,
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
                <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function OrgStructureCard({
  result,
  orgName,
}: {
  result: AgentResult;
  orgName: string;
}) {
  const data = result.result_data as { scenarios: string[] };

  const scenarioDetails: Record<
    string,
    { description: string; pros: string[]; cons: string[]; color: string }
  > = {
    "현상유지": {
      description: "현재 조직 구조 유지, 점진적 업무 조정",
      pros: ["변화 리스크 최소", "안정적 운영 지속", "비용 절감"],
      cons: ["성장 제약", "업무 과부하 지속 가능"],
      color: "#3b82f6",
    },
    "확대": {
      description: "팀 규모 확대 및 기능 강화",
      pros: ["역량 강화", "업무 분산", "성장 대응 가능"],
      cons: ["인건비 증가", "조직 관리 복잡도 증가"],
      color: "#10b981",
    },
    "분리": {
      description: "기능별 팀 분리 및 전문화",
      pros: ["전문성 극대화", "책임 명확화", "스케일 용이"],
      cons: ["협업 비용 증가", "분리 과도기 리스크"],
      color: "#f59e0b",
    },
  };

  return (
    <Card className="border-l-4 border-l-teal-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base">{result.result_title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-teal-200 text-teal-700 bg-teal-50"
          >
            {orgName}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{result.result_summary}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.scenarios.map((scenario) => {
            const detail = scenarioDetails[scenario];
            if (!detail) {
              throw new Error(`Unknown scenario: ${scenario}`);
            }
            const isRecommended = scenario === "확대";
            return (
              <div
                key={scenario}
                className={`rounded-lg border p-4 space-y-3 ${
                  isRecommended
                    ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5
                    className="text-sm font-semibold"
                    style={{ color: detail.color }}
                  >
                    {scenario}
                  </h5>
                  {isRecommended && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                      권장
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{detail.description}</p>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      &#9650; 장점
                    </p>
                    <ul className="space-y-0.5">
                      {detail.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="text-xs text-emerald-700 flex items-start gap-1"
                        >
                          <span className="text-emerald-500 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      &#9660; 단점
                    </p>
                    <ul className="space-y-0.5">
                      {detail.cons.map((con, i) => (
                        <li
                          key={i}
                          className="text-xs text-red-600 flex items-start gap-1"
                        >
                          <span className="text-red-400 mt-0.5">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
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
                <ChevronRight className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StaffingPanel({
  results,
  orgUnits,
}: StaffingPanelProps) {
  const hiringResult = results.find((r) => r.result_title === "채용 요건");
  const workloadResult = results.find(
    (r) => r.result_title === "워크로드 분석"
  );
  const orgStructureResult = results.find(
    (r) => r.result_title === "조직 구조 제안"
  );

  if (!hiringResult || !workloadResult || !orgStructureResult) {
    throw new Error(
      "Missing required agent results for staffing. Expected: 채용 요건, 워크로드 분석, 조직 구조 제안"
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
        <span className="text-gray-900">조직/채용 Agent</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">조직/채용 Agent</h1>
        <p className="text-sm text-gray-500 mt-1">
          채용 요건 분석, 워크로드 분석, 조직 구조 제안
        </p>
      </div>

      {/* Agent Status Bar */}
      <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <Bot className="w-5 h-5 text-cyan-600" />
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
        <HiringRequirementsCard
          result={hiringResult}
          orgName={getOrgName(orgUnits, hiringResult.target_org)}
        />
        <WorkloadCard
          result={workloadResult}
          orgName={getOrgName(orgUnits, workloadResult.target_org)}
        />
        <OrgStructureCard
          result={orgStructureResult}
          orgName={getOrgName(orgUnits, orgStructureResult.target_org)}
        />
      </div>

      {/* Navigation */}
      <div className="mt-10 pt-6 border-t border-gray-100">
        <Link
          href="/pan-hr"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Pan HR로 돌아가기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
