"use client";

import { BackButton } from "@/components/poc/back-button";
import { KpiCard } from "@/components/poc/kpi-card";
import { SectionHeader } from "@/components/poc/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import {
  kpiData,
  clusterData,
  trajectoryChartData,
  heatmapData,
  earlyWarningCategories,
  earlyWarningSignalData,
  keyCategoryTrajectoryData,
  leaderReplacementData,
  attritionData,
  overallAttritionRate,
  rankDistribution,
  leadershipRadarData,
  comparisonData,
  shortTermActions,
  midTermActions,
} from "@/lib/data/da-data";

// ---------------------------------------------------------------------------
// Heatmap color helper
// ---------------------------------------------------------------------------
function heatmapColor(value: number): string {
  if (value <= -0.8) return "bg-red-600 text-white";
  if (value <= -0.5) return "bg-red-400 text-white";
  if (value <= -0.2) return "bg-red-200 text-red-900";
  if (value < 0.2) return "bg-gray-100 text-gray-700";
  if (value < 0.5) return "bg-green-200 text-green-900";
  if (value < 0.8) return "bg-green-400 text-white";
  return "bg-green-600 text-white";
}

// ---------------------------------------------------------------------------
// Section method callout component
// ---------------------------------------------------------------------------
function MethodNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg border-l-4 border-l-gray-300 bg-gray-50 p-4">
      <p className="text-xs text-gray-500 leading-relaxed">{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Finding callout component
// ---------------------------------------------------------------------------
function FindingBox({
  title,
  children,
  variant = "amber",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "amber" | "red" | "blue" | "green";
}) {
  const colors = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    red: "border-red-200 bg-red-50 text-red-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    green: "border-green-200 bg-green-50 text-green-900",
  };
  const subColors = {
    amber: "text-amber-800",
    red: "text-red-700",
    blue: "text-blue-700",
    green: "text-green-700",
  };
  return (
    <div className={`mt-4 rounded-lg border-2 p-4 ${colors[variant]}`}>
      <p className="text-sm font-semibold mb-1">{title}</p>
      <p className={`text-xs ${subColors[variant]}`}>{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom Tooltip Components
// ---------------------------------------------------------------------------
function TrajectoryTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold mb-1">{label}년</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
}

function ComparisonTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value > 0 ? "+" : ""}
          {entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
}

// ===========================================================================
// Page Component
// ===========================================================================
export default function DaCasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* ----------------------------------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------------------------------- */}
        <BackButton />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            조직 리스크 조기탐지 대시보드
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            파*** | 671명 | 2023-2025 3개년 분석
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Executive Message */}
        {/* ----------------------------------------------------------------- */}
        <div className="mb-8 rounded-lg border-2 border-amber-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
          <p className="text-lg font-semibold text-amber-900">
            24년에 리스크 신호는 이미 감지 가능했다
          </p>
          <p className="text-sm text-amber-700 mt-1">
            C1 리스크군은 23년부터 지속 하락 추세이며, 9개 영역에서 조기경보
            기준을 초과하는 변화가 관측되었습니다.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* KPI Cards */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {kpiData.map((kpi, i) => (
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
        {/* Section 01: 조기경보 신호 탐지 (FULL-WIDTH + finding) */}
        {/* ================================================================= */}
        <SectionHeader
          title="01. 조기경보 신호 탐지"
          subtitle="'24년에 선제 예방이 가능했는가?"
        />
        <MethodNote>
          23→24년 구간에서 C1 리스크군과 C0 안정군 사이의 격차 변화량을 추적하여,
          유의미한(p&lt;0.05) 변화가 발생한 9개 영역을 조기경보 신호로 식별했습니다.
          격차가 급격히 축소된 영역일수록 C1이 빠르게 하락한 것을 의미합니다.
        </MethodNote>
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>
              C1 리스크군 vs C0 안정군 격차 변화 (9개 조기경보 영역)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={earlyWarningSignalData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 0.8]}
                  tickFormatter={(v: number) => v.toFixed(1)}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={75}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)}`,
                    name,
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="gap23"
                  name="23년 C1-C0 격차"
                  fill="#FFB74D"
                  barSize={12}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="gap24"
                  name="24년 C1-C0 격차"
                  fill="#ef4444"
                  barSize={12}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <FindingBox title="23년에는 C1이 C0보다 높은 점수 (격차 0.47~0.72)" variant="amber">
              24년에 격차가 급격히 축소 (0.15~0.25) -- C1이 빠르게 하락하면서
              9개 영역에서 유의미한(p&lt;0.05) 변화 감지. 전년 대비 변화율
              기반으로 선제 탐지가 가능했던 신호입니다.
            </FindingBox>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* Section 02: 군집 분석 개요 (2-COL: donut + line, NO finding) */}
        {/* ================================================================= */}
        <SectionHeader
          title="02. 리스크 군집 분포"
          subtitle="K-Means 기반 3개 군집별 인원 및 3개년 궤적"
        />
        <MethodNote>
          671명의 3개년 설문 응답을 기반으로 K-Means 군집분석을 수행하여,
          유사한 변화 패턴을 보이는 3개 군집(안정/리스크/개선)으로 분류했습니다.
          종합만족도 궤적으로 각 군집의 추이를 확인합니다.
        </MethodNote>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">군집 인원 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clusterData.map((c) => ({
                      name: c.name,
                      value: c.count,
                      fill: c.color,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    label={(props) =>
                      `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(1)}%`
                    }
                    labelLine={true}
                  >
                    {clusterData.map((c) => (
                      <Cell key={c.id} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}명`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {clusterData.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name} ({c.count}명)
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trajectory Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">3개년 종합만족도 궤적</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trajectoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[2.5, 4.0]} />
                  <Tooltip content={<TrajectoryTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="C0"
                    name="C0 안정군"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="C1"
                    name="C1 리스크군"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="C2"
                    name="C2 개선군"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">
                C1 리스크군: 3.76 → 3.38 → 3.06 (지속 하락) | C2 개선군: 2.83 →
                3.29 → 3.68 (지속 상승)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* Section 03: 22개 중분류 히트맵 (FULL-WIDTH + finding) */}
        {/* ================================================================= */}
        <SectionHeader
          title="03. 22개 중분류 변화량 히트맵"
          subtitle="2023 → 2025 변화량 | 빨간색 = 악화, 초록색 = 개선"
        />
        <MethodNote>
          22개 중분류별로 2023년 대비 2025년 변화량을 산출하여, 군집별 악화/개선 패턴을
          시각화합니다. 조기경보 기준(23→24 구간에서 C1 격차 급격 확대)에 해당하는 9개
          영역에 경보 플래그를 표시합니다.
        </MethodNote>
        <Card className="mb-4 overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 border-b-2 border-gray-300 font-semibold text-gray-700 sticky left-0 bg-white min-w-[120px]">
                    중분류
                  </th>
                  <th className="text-center py-2 px-3 border-b-2 border-gray-300 font-semibold text-gray-700 w-24">
                    <span className="flex items-center justify-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: "#ef4444" }}
                      />
                      C1
                    </span>
                  </th>
                  <th className="text-center py-2 px-3 border-b-2 border-gray-300 font-semibold text-gray-700 w-24">
                    <span className="flex items-center justify-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: "#10b981" }}
                      />
                      C0
                    </span>
                  </th>
                  <th className="text-center py-2 px-3 border-b-2 border-gray-300 font-semibold text-gray-700 w-24">
                    <span className="flex items-center justify-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: "#3b82f6" }}
                      />
                      C2
                    </span>
                  </th>
                  <th className="text-center py-2 px-3 border-b-2 border-gray-300 font-semibold text-gray-700 w-20">
                    경보
                  </th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => {
                  const isWarning = earlyWarningCategories.includes(
                    row.category
                  );
                  return (
                    <tr
                      key={row.category}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3 font-medium text-gray-800 sticky left-0 bg-white">
                        {row.category}
                      </td>
                      <td className="py-1 px-2 text-center">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-mono font-semibold min-w-[60px] ${heatmapColor(row.C1)}`}
                        >
                          {row.C1 > 0 ? "+" : ""}
                          {row.C1.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-1 px-2 text-center">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-mono font-semibold min-w-[60px] ${heatmapColor(row.C0)}`}
                        >
                          {row.C0 > 0 ? "+" : ""}
                          {row.C0.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-1 px-2 text-center">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-mono font-semibold min-w-[60px] ${heatmapColor(row.C2)}`}
                        >
                          {row.C2 > 0 ? "+" : ""}
                          {row.C2.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-1 px-2 text-center">
                        {isWarning ? (
                          <Badge variant="warning">▲ 경보</Badge>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">
              ※ 경보: 23→24년 구간에서 C1 군집의 격차가 유의미하게 확대된 9개
              영역 + 전략목표
            </p>
          </CardContent>
        </Card>
        <FindingBox title="C1 리스크군: 22개 중 20개 중분류 악화" variant="red">
          C1은 다양성(+0.02)을 제외한 전 영역에서 하락. 특히 윤리(-1.04), 인력운영(-0.95),
          의사소통(-0.93), 보상제도(-0.92)가 최대 악화 영역. 반면 C2 개선군은 전 영역에서 +0.45~+0.90 상승하여
          정반대의 개선 패턴을 보입니다.
        </FindingBox>
        <div className="mb-10" />

        {/* ================================================================= */}
        {/* Section 04: 리스크군 vs 안정군 비교 (FULL-WIDTH, NO finding) */}
        {/* ================================================================= */}
        <SectionHeader
          title="04. 리스크군 vs 안정군 비교"
          subtitle="C1 리스크군과 C0 안정군의 23→25 변화량 비교"
        />
        <MethodNote>
          22개 전체 중분류에 대해 C1 리스크군과 C0 안정군의 2023→2025 변화량을
          직접 비교합니다. C1은 전반적 하락, C0는 소폭 변동으로 두 군집 간 격차가
          벌어지는 구조적 패턴을 확인합니다.
        </MethodNote>
        <Card className="mb-10">
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={comparisonData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[-1.2, 0.4]} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={90}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<ComparisonTooltip />} />
                <Legend />
                <Bar
                  dataKey="C1"
                  name="C1 리스크군"
                  fill="#ef4444"
                  barSize={10}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="C0"
                  name="C0 안정군"
                  fill="#10b981"
                  barSize={10}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* Section 05: 핵심 중분류 3개년 궤적 (FULL-WIDTH + finding) */}
        {/* ================================================================= */}
        <SectionHeader
          title="05. 핵심 중분류 3개년 궤적"
          subtitle="점진적 악화 패턴 -- C1 리스크군의 6개 핵심 영역 추이"
        />
        <MethodNote>
          C1 리스크군에서 하락 폭이 큰 6개 핵심 중분류(인력운영, 의사소통, 보상제도,
          휴념, 교육, 몰입도)의 3개년 점수 추이를 추적하여, 특정 사건이 아닌
          구조적/환경적 요인에 의한 점진적 악화 패턴을 확인합니다.
        </MethodNote>
        {/* Small multiples legend */}
        <Card className="mb-4">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center justify-center gap-6 text-xs mb-4">
              <span className="text-sm font-medium text-gray-700">핵심 중분류 3개년 궤적</span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 inline-block bg-[#ef4444]" /> 리스크군(C1)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 inline-block bg-[#10b981]" /> 안정군(C0)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 inline-block bg-[#3b82f6]" /> 개선군(C2)
              </span>
            </div>
            {/* 2×3 small multiples grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {keyCategoryTrajectoryData.map((cat) => (
                <div key={cat.category} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-800 text-center mb-1">
                    {cat.category}
                  </p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={cat.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis
                        domain={[
                          Math.floor(Math.min(...cat.data.flatMap((d) => [d.C0, d.C1, d.C2])) * 10) / 10 - 0.1,
                          Math.ceil(Math.max(...cat.data.flatMap((d) => [d.C0, d.C1, d.C2])) * 10) / 10 + 0.1,
                        ]}
                        tick={{ fontSize: 10 }}
                        width={35}
                      />
                      <Tooltip
                        formatter={(value, name) => [`${Number(value).toFixed(2)}`, name]}
                      />
                      <Line type="monotone" dataKey="C1" name="C1 리스크군" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="C0" name="C0 안정군" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="C2" name="C2 개선군" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <FindingBox title="점진적 구조적 악화" variant="amber">
          C1의 악화는 23→24→25 전 구간에서 일관되게 진행. 20/22개 중분류가 지속악화 패턴.
          이는 특정 사건이 아닌 구조적/환경적 요인에 의한 것으로 판단.
        </FindingBox>
        <div className="mb-10" />

        {/* ================================================================= */}
        {/* Section 06: 퇴사율 + 직급분포 (2-COL + finding BELOW) */}
        {/* ================================================================= */}
        <SectionHeader
          title="06. 퇴사율 + 직급분포"
          subtitle="군집별 이직률 및 직급 구성 비교"
        />
        <MethodNote>
          군집별 퇴사율과 직급 분포를 비교하여, 리스크군의 인구통계학적 특성과
          이탈 경향을 확인합니다. L1 직급 집중 현상은 신규 매니저 대상 개입의
          근거가 됩니다.
        </MethodNote>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          {/* Attrition Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">군집별 퇴사율</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={attritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cluster" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 20]}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`]} />
                  <Bar dataKey="rate" name="퇴사율" barSize={40} radius={[4, 4, 0, 0]}>
                    {attritionData.map((entry) => (
                      <Cell key={entry.cluster} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  전체 퇴사율: <span className="font-bold">{overallAttritionRate}%</span>
                </p>
                <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                  {attritionData.map((d) => (
                    <span key={d.cluster}>
                      {d.cluster}: {d.count}명
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank Distribution Stacked Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">군집별 직급 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={rankDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`]} />
                  <Legend />
                  <Bar dataKey="C0" name="C0 안정군" stackId="stack" fill="#10b981" />
                  <Bar dataKey="C1" name="C1 리스크군" stackId="stack" fill="#ef4444" />
                  <Bar dataKey="C2" name="C2 개선군" stackId="stack" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <FindingBox title="C1 리스크군 퇴사율 14.6% (전사 11.1% 대비 +3.5%p)" variant="amber">
          C1 리스크군의 L1 비율 48%로 가장 높아 신규 매니저에 리스크가 집중.
          L1 직급 대상 온보딩/멘토링 강화가 시급합니다.
        </FindingBox>
        <div className="mb-10" />

        {/* ================================================================= */}
        {/* Section 07: 리더십 역설 (2-COL: radar LEFT, table+findings RIGHT) */}
        {/* ================================================================= */}
        <SectionHeader
          title="07. 리더십 역설"
          subtitle="C1 리스크군이 리더십 평가에서 오히려 가장 높은 점수 -- 기대와 실망의 역학"
        />
        <MethodNote>
          2023년 리더십 역량 8개 축 평가 결과와 리더 교체 이력을 교차 분석하여,
          리스크군의 하락이 리더 교체에 의한 것인지, 구조적 요인에 의한 것인지를
          검증합니다.
        </MethodNote>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* LEFT: Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">2023년 리더십 역량 평가 (8개 축)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart data={leadershipRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[3.5, 4.5]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="C0 안정군"
                    dataKey="C0"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Radar
                    name="C1 리스크군"
                    dataKey="C1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Radar
                    name="C2 개선군"
                    dataKey="C2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* RIGHT: Leader replacement table + findings */}
          <div className="space-y-4">
            {/* Cluster interpretation cards */}
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800 mb-1">
                ▲ C1 리스크군 평균: 4.32
              </p>
              <p className="text-xs text-red-700">
                모든 리더십 축에서 가장 높은 점수를 기록했으나, 조직
                만족도는 가장 낮은 역설적 패턴
              </p>
            </div>
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800 mb-1">
                ● C0 안정군 평균: 4.05
              </p>
              <p className="text-xs text-green-700">
                적절한 기대 수준과 안정적인 만족도 유지
              </p>
            </div>
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-800 mb-1">
                ▼ C2 개선군 평균: 3.79
              </p>
              <p className="text-xs text-blue-700">
                낮은 리더십 기대가 개선 여지를 만든 구조
              </p>
            </div>

            {/* Leader replacement table */}
            <Card className="border-l-4 border-l-amber-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  리더 교체 이력 검증
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm border-collapse mb-3">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-1.5 px-3 font-semibold text-gray-700 text-xs">
                        군집
                      </th>
                      <th className="text-center py-1.5 px-3 font-semibold text-gray-700 text-xs">
                        24→25 교체율
                      </th>
                      <th className="text-center py-1.5 px-3 font-semibold text-gray-700 text-xs">
                        23→24 교체율
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderReplacementData.map((row) => (
                      <tr
                        key={row.cluster}
                        className="border-b border-gray-100"
                      >
                        <td className="py-1.5 px-3 text-xs font-medium">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: row.color }}
                            />
                            {row.cluster}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-center font-mono text-xs">
                          {row.rate2425}%
                        </td>
                        <td className="py-1.5 px-3 text-center font-mono text-xs">
                          {row.rate2324}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="rounded bg-gray-100 p-2 mb-2">
                  <p className="text-xs text-gray-600 font-mono text-center">
                    Chi-squared p=0.61 → 군집 간 유의미한 차이 없음
                  </p>
                </div>
                <p className="text-xs text-amber-800 font-semibold">
                  결론: 리더가 바뀌어서가 아니라, 구조적 요인이 리스크의 핵심 원인
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Section 08: 컨설팅 제언 (2-COL finding boxes, NO charts) */}
        {/* ================================================================= */}
        <SectionHeader
          title="08. 컨설팅 제언"
          subtitle="조기탐지 기반 실행 과제"
        />
        <MethodNote>
          분석 결과를 종합하여, 즉시 시행 가능한 단기 조치와
          구조적 개선이 필요한 중기 과제로 구분하여 제언합니다.
        </MethodNote>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Short-term Actions */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle>
                즉시 조치 (Short-term)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shortTermActions.map((action, i) => (
                  <div key={action.title} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mid-term Actions */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle>
                구조적 개선 (Mid-term)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {midTermActions.map((action, i) => (
                  <div key={action.title} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
