"use client";

import { BackButton } from "@/components/poc/back-button";
import { SectionHeader } from "@/components/poc/section-header";
import { KpiCard } from "@/components/poc/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Cell,
} from "recharts";
import {
  kpiData,
  orgRiskData,
  engagementIndicators,
  engagementByTier,
  heatmapIndicators,
  heatmapData,
  companyAverage,
  shapData,
  simulationData,
  currentEngagement,
  recommendations,
  orgInsights,
  tierColors,
  tierLabels,
} from "@/lib/data/ra-data";
import type { RiskTier } from "@/lib/data/ra-data";

function getHeatmapColor(value: number): string {
  if (value < 2.5) return "bg-red-200 text-red-900";
  if (value < 3.0) return "bg-amber-200 text-amber-900";
  if (value < 3.3) return "bg-yellow-100 text-yellow-900";
  return "bg-green-200 text-green-900";
}

function getTierBadgeVariant(tier: RiskTier): "danger" | "warning" | "success" {
  if (tier === "high") return "danger";
  if (tier === "caution") return "warning";
  return "success";
}

// Section method callout component
function MethodNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg border-l-4 border-l-gray-300 bg-gray-50 p-4">
      <p className="text-xs text-gray-500 leading-relaxed">{children}</p>
    </div>
  );
}

// Build grouped bar chart data for engagement by tier
const engagementChartData = engagementIndicators.map((indicator, idx) => ({
  indicator,
  ...Object.fromEntries(
    engagementByTier.map((t) => [t.tier, t.values[idx]])
  ),
}));

// Build simulation line chart data
const simulationChartData = simulationData.map((scenario) => ({
  name: scenario.id,
  label: scenario.label,
  predicted: scenario.predicted,
}));

const recBorderColors = [
  "border-l-red-500",
  "border-l-blue-500",
  "border-l-red-500",
  "border-l-amber-500",
  "border-l-purple-500",
];

export default function RaCasePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <BackButton />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          인력수준 위험 진단 및 조직몰입도 개선 예측
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          K-Means 군집분석 · SHAP 피처 중요도 · OLS 회귀 기반 What-If 시뮬레이션 | 제*** | 15개 조직, 1,203명
        </p>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {kpiData.map((kpi, idx) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            status={kpi.status}
          />
        ))}
      </div>

      {/* ================================================================= */}
      {/* Section 01: 군집 분석 결과 */}
      {/* ================================================================= */}
      <SectionHeader
        title="01. 군집 분석 결과"
        subtitle="K-Means 기반 15개 조직 위험등급 분류 및 몰입도 검증"
      />
      <MethodNote>
        직원들이 응답한 인력수준·인사제도 관련 29개 설문 문항을 기반으로,
        비슷한 특성을 가진 조직끼리 자동으로 묶는 K-Means 군집분석을 수행했습니다.
        각 조직의 위험점수는 핵심 인력 문항 응답 평균이 낮을수록 높게 산출되며,
        군집 결과와 몰입도 수준, 약점 항목 수를 종합하여 고위험(3개)·저위험(6개)·양호(6개)
        3등급으로 분류했습니다.
      </MethodNote>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* 01-1: 조직별 인력 위험점수 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">조직별 인력 위험점수 (높은 순)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={orgRiskData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[1.4, 3]} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={110}
                />
                <Tooltip
                  formatter={(value, _name, props) => [
                    `${Number(value).toFixed(2)} (${tierLabels[(props?.payload as { tier: RiskTier })?.tier]})`,
                    "위험점수",
                  ]}
                />
                <Bar dataKey="riskScore" radius={[0, 4, 4, 0]}>
                  {orgRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={tierColors[entry.tier]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-2 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="text-xs text-neutral-600">고위험 (3개)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="text-xs text-neutral-600">저위험 (6개)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-neutral-600">양호 (6개)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 01-2: 위험등급별 몰입도 지표 비교 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">위험등급별 몰입도 지표 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={engagementChartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="indicator" tick={{ fontSize: 11 }} />
                <YAxis domain={[2.8, 4.2]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="고위험" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="저위험" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="양호" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Section 02: 핵심 인력지표 히트맵 */}
      {/* ================================================================= */}
      <SectionHeader
        title="02. 핵심 인력지표 히트맵"
        subtitle="15개 조직 x 9개 인력 지표 (전사 평균 대비)"
      />
      <MethodNote>
        15개 조직별로 인력수준과 직결되는 9개 핵심 지표의 평균 점수를 한눈에 비교합니다.
        셀 색상이 빨간색에 가까울수록 낮은 점수(취약), 초록색에 가까울수록 높은 점수(양호)를
        의미하며, 맨 위 전사 평균 행과 비교하면 각 조직이 어떤 지표에서 뒤처지는지 빠르게
        파악할 수 있습니다.
      </MethodNote>
      <div className="rounded-lg border-2 border-gray-300 p-0 bg-white shadow-sm overflow-x-auto mb-10">
        <table className="w-full text-xs" style={{ minWidth: 900 }}>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[140px]">
                조직
              </th>
              {heatmapIndicators.map((ind) => (
                <th
                  key={ind}
                  className="text-center py-3 px-2 font-semibold text-gray-700 bg-gray-50 min-w-[72px]"
                >
                  {ind}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Company Average Row */}
            <tr className="border-b-2 border-gray-400 bg-gray-50 font-semibold">
              <td className="py-2 px-3 sticky left-0 z-10 bg-gray-50 text-gray-900">
                전사 평균
              </td>
              {companyAverage.map((val, idx) => (
                <td
                  key={`avg-${idx}`}
                  className="text-center py-2 px-2 font-bold text-gray-900"
                >
                  {val.toFixed(2)}
                </td>
              ))}
            </tr>
            {/* Organization Rows */}
            {heatmapData.map((org) => (
              <tr key={org.name} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="py-2 px-3 sticky left-0 z-10 bg-white text-gray-800 font-medium">
                  {org.name}
                </td>
                {org.values.map((val, idx) => (
                  <td
                    key={`${org.name}-${idx}`}
                    className={`text-center py-2 px-2 font-medium ${getHeatmapColor(val)}`}
                  >
                    {val.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================================= */}
      {/* Section 03: SHAP 피처 중요도 & What-if 시뮬레이션 */}
      {/* ================================================================= */}
      <SectionHeader
        title="03. SHAP 피처 중요도 & 전사 몰입도 개선 예측"
        subtitle="어떤 문항이 몰입도에 가장 큰 영향을 미치는가 + 개선 시 예측"
      />
      <MethodNote>
        SHAP 분석 — AI 모델(Random Forest)이 몰입도를 예측할 때 각 문항이 기여하는 정도를
        SHAP 값으로 분해하여 상위 10개를 표시했습니다.
        What-If 시뮬레이션 — SHAP에서 가장 영향력이 큰 WLB·인재유지 인식을 0.5점씩
        끌어올리는 4가지 시나리오별 전사 몰입도 변화를 회귀분석(OLS)으로 추정했습니다.
      </MethodNote>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* 03-1: SHAP Top 10 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">SHAP 피처 중요도 Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={shapData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fontSize: 11 }}
                  width={95}
                />
                <Tooltip
                  formatter={(value) => [Number(value).toFixed(4), "SHAP Value"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {shapData.map((_entry, index) => (
                    <Cell
                      key={`shap-${index}`}
                      fill={index < 2 ? "#ef4444" : index < 4 ? "#f59e0b" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 03-2: 시나리오별 몰입도 변화 예측 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">시나리오별 전사 몰입도 점수 변화</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart
                data={simulationChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[3.5, 4.1]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [Number(value).toFixed(3), "예측 몰입도"]}
                  labelFormatter={(label) => `시나리오: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine
                  y={currentEngagement}
                  stroke="#94a3b8"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  label={{
                    value: `현재 (${currentEngagement.toFixed(2)})`,
                    position: "right",
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="개선 후 예측값"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#fff", stroke: "#059669", strokeWidth: 2.5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Scenario summary cards */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {simulationData.map((s) => (
                <div key={s.id} className="rounded-md border border-gray-200 p-2.5 bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="info">{s.id}</Badge>
                    <span className="text-xs font-semibold text-green-600">
                      {s.delta}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{s.label}</p>
                  <p className="text-xs text-gray-500">
                    {currentEngagement.toFixed(2)} → <span className="font-semibold text-blue-700">{s.predicted.toFixed(3)}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Section 04: 조직별 핵심 인사이트 */}
      {/* ================================================================= */}
      <SectionHeader
        title="04. 조직별 핵심 인사이트"
        subtitle="위험등급·몰입도·시뮬레이션 종합 조직별 진단"
      />
      <MethodNote>
        각 조직의 설문 응답 평균을 전사 평균과 비교하여, 전사보다 뚜렷하게 높은 항목은 강점,
        뚜렷하게 낮은 항목은 약점으로 도출했습니다. 위험등급·몰입도 수준·시뮬레이션 예측
        결과를 종합하여 조직별 핵심 이슈와 맞춤형 개선 방향을 정리했습니다.
      </MethodNote>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {orgInsights.map((org) => {
          const badgeVariant = getTierBadgeVariant(org.tier);
          return (
            <div
              key={org.name}
              className={`rounded-lg border-2 border-gray-300 border-l-4 shadow-sm bg-gradient-to-br to-white ${
                org.tier === "high"
                  ? "border-l-red-500 from-red-50"
                  : org.tier === "caution"
                    ? "border-l-amber-500 from-amber-50"
                    : "border-l-green-500 from-green-50"
              }`}
            >
              {/* Header */}
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{org.name}</h3>
                    <p className="text-xs text-gray-500">{org.n}명 | 위험점수 {org.riskScore.toFixed(2)}</p>
                  </div>
                  <Badge variant={badgeVariant}>{tierLabels[org.tier]}</Badge>
                </div>
                {/* Commitment bar */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">몰입도</span>
                  <span className="text-sm font-bold text-gray-900">{org.commitment.toFixed(2)}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(org.commitment / 5) * 100}%`,
                        backgroundColor: tierColors[org.tier],
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">/ 전사 {currentEngagement.toFixed(2)}</span>
                </div>
              </div>
              {/* Weak/Strong */}
              <div className="px-4 pb-2">
                {org.weaknesses.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-red-700 mb-1">약점 (전사평균 대비)</p>
                    <div className="flex flex-wrap gap-1">
                      {org.weaknesses.map((w) => (
                        <span key={w} className="inline-block text-xs bg-red-100 text-red-700 rounded px-1.5 py-0.5">{w}</span>
                      ))}
                    </div>
                  </div>
                )}
                {org.strengths.length > 0 ? (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-green-700 mb-1">강점</p>
                    <div className="flex flex-wrap gap-1">
                      {org.strengths.map((s) => (
                        <span key={s} className="inline-block text-xs bg-green-100 text-green-700 rounded px-1.5 py-0.5">{s}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-400 mb-1">강점</p>
                    <span className="inline-block text-xs bg-gray-100 text-gray-400 rounded px-1.5 py-0.5">해당 없음</span>
                  </div>
                )}
              </div>
              {/* Simulation + Insight */}
              <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs text-gray-500">S3 예측:</span>
                  <span className="text-sm font-bold text-green-700">{org.s3.toFixed(2)}</span>
                </div>
                <div className="rounded-md border-l-2 border-l-gray-300 bg-gray-50 p-2">
                  <p className="text-xs text-gray-600 leading-relaxed">{org.insight}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* Section 05: 핵심 권고사항 */}
      {/* ================================================================= */}
      <SectionHeader
        title="05. 핵심 권고사항"
        subtitle="데이터 분석 종합 기반 우선순위별 실행 과제"
      />
      <MethodNote>
        위의 모든 분석 결과 — 위험등급 분류, 영향력 높은 문항(SHAP), 개선 시뮬레이션,
        조직별 진단 — 를 종합하여 도출한 실행 과제입니다. 위험이 크고 개선 효과가 높은
        영역일수록 높은 우선순위를 부여했습니다.
      </MethodNote>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`rounded-lg border-2 border-gray-300 border-l-4 ${recBorderColors[idx]} shadow-sm bg-white p-5 relative`}
          >
            <span className="absolute top-3 right-4 text-4xl font-black text-gray-100">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <Badge variant={rec.priorityVariant} className="mb-3">
              {rec.priority}
            </Badge>
            <p className="text-sm font-semibold text-gray-800 relative z-10">
              {rec.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
