"use client";

import { BackButton } from "@/components/poc/back-button";
import { KpiCard } from "@/components/poc/kpi-card";
import { SectionHeader } from "@/components/poc/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  surveyMeta,
  kpiData,
  keyFindings,
  energyClusters,
  takTckClusterComparison,
  jobTypeClusterData,
  orgRiskData,
  cultureRadarData,
  cultureGapSummary,
  cultureDimensionDescriptions,
  energyProfile,
  lifeWageData,
  compensationStrategy,
  wageAnalysis,
  proxyMetrics,
  anomalyData,
  shapData,
  methodologySteps,
  analysisTechniques,
  autoMLData,
  dataSources,
  quickWinRecommendations,
  longTermRecommendations,
} from "@/lib/data/ga-data";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getQqRiskColor(risk: string): string {
  if (risk === "high") return "#ef4444";
  if (risk === "medium") return "#f59e0b";
  return "#10b981";
}

function getQqRiskSymbol(risk: string): string {
  if (risk === "high") return "▲";
  if (risk === "medium") return "●";
  return "▼";
}

function getSeverityStyle(severity: string) {
  if (severity === "high")
    return { border: "border-l-red-500", bg: "from-red-50", text: "text-red-600", symbol: "▲" };
  if (severity === "medium")
    return { border: "border-l-amber-500", bg: "from-amber-50", text: "text-amber-600", symbol: "●" };
  return { border: "border-l-blue-500", bg: "from-blue-50", text: "text-blue-600", symbol: "▼" };
}

function FindingBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg p-4 border border-gray-200 ${className ?? ""}`}>
      {children}
    </div>
  );
}

function MethodNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-xs text-blue-800 leading-relaxed">{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GaCasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            M&A 문화통합 리스크 진단
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {surveyMeta.client} ({surveyMeta.subtitle}) |{" "}
            {surveyMeta.totalRespondents.toLocaleString()}명 | 분석 기법{" "}
            {surveyMeta.analysisMethods}종 | {surveyMeta.period}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <KpiCard
            title={kpiData.totalRespondents.title}
            value={kpiData.totalRespondents.value}
            subtitle={kpiData.totalRespondents.subtitle}
            status={kpiData.totalRespondents.status}
          />
          <KpiCard
            title={kpiData.cultureDistance.title}
            value={kpiData.cultureDistance.value}
            subtitle={kpiData.cultureDistance.subtitle}
            status={kpiData.cultureDistance.status}
          />
          <KpiCard
            title={kpiData.attritionRisk.title}
            value={kpiData.attritionRisk.value}
            subtitle={kpiData.attritionRisk.subtitle}
            status={kpiData.attritionRisk.status}
          />
          <KpiCard
            title={kpiData.earlySignal.title}
            value={kpiData.earlySignal.value}
            subtitle={kpiData.earlySignal.subtitle}
            status={kpiData.earlySignal.status}
          />
        </div>

        {/* ================================================================= */}
        {/* 01. 핵심 발견 사항 Top 5                                          */}
        {/* ================================================================= */}
        <SectionHeader
          title="01. 핵심 발견 사항 (Top 5)"
          subtitle="데이터 분석 기반 주요 리스크 및 기회 요인"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {keyFindings.map((f) => {
            const s = getSeverityStyle(f.severity);
            return (
              <div
                key={f.rank}
                className={`rounded-lg p-4 border border-gray-200 border-l-4 ${s.border} shadow-sm bg-gradient-to-br ${s.bg} to-white`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xl font-bold ${s.text}`}>{s.symbol}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      #{f.rank} {f.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* 02. 구성원 유형 (4 클러스터)                                       */}
        {/* ================================================================= */}
        <SectionHeader
          title="02. 구성원 유형 분류"
          subtitle="t-SNE 2차원 압축 후 K-Means(k=4) 클러스터링 | Silhouette Score = 0.1075"
        />

        {/* 4 Cluster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {energyClusters.map((c) => (
            <div
              key={c.id}
              className="rounded-lg p-5 border-2 shadow-sm bg-gradient-to-br to-white"
              style={{
                borderColor: c.color,
                background: `linear-gradient(to bottom right, ${c.color}10, white)`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-2xl font-bold" style={{ color: c.color }}>
                    {c.id}
                  </span>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.nameEn}</p>
                </div>
                <div className="text-right">
                  <Badge variant={c.risk === "high" ? "danger" : c.risk === "medium" ? "warning" : "success"}>
                    {c.risk === "high" ? "▲ HIGH" : c.risk === "low" ? "▼ LOW" : "● MED"}
                  </Badge>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{c.percentage}%</p>
                  <p className="text-xs text-gray-500">{c.count}명</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">{c.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">생산적 에너지</p>
                  <p className="text-lg font-bold text-gray-900">{c.productiveEnergy}</p>
                </div>
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">냉소적 에너지</p>
                  <p className="text-lg font-bold text-gray-900">{c.cynicalEnergy}</p>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-white/70 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">문화 갭</p>
                  <p className="text-sm font-bold text-gray-800">{c.cultureGapValue.toFixed(3)}</p>
                </div>
                <div className="flex-1 bg-white/70 rounded-lg p-2">
                  <p className="text-xs text-gray-500 mb-1">T** 비중</p>
                  <div className="flex gap-1 items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${c.takPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{c.takPct}%</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">권고 조치:</span>{" "}
                  {c.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* T** vs T** 클러스터 분포 비교 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <FindingBox className="bg-red-50 border-red-200 text-center">
            <p className="text-xs text-gray-500">T** 냉소이탈형(C3)</p>
            <p className="text-xl font-bold text-red-600">{takTckClusterComparison["T**"].C3}%</p>
            <p className="text-xs text-gray-500 mt-0.5">vs T** {takTckClusterComparison.TCK.C3}%</p>
          </FindingBox>
          <FindingBox className="bg-green-50 border-green-200 text-center">
            <p className="text-xs text-gray-500">T** 몰입형충성자(C2)</p>
            <p className="text-xl font-bold text-green-600">{takTckClusterComparison.TCK.C2}%</p>
            <p className="text-xs text-gray-500 mt-0.5">vs T** {takTckClusterComparison["T**"].C2}%</p>
          </FindingBox>
          <FindingBox className="bg-blue-50 border-blue-200 text-center">
            <p className="text-xs text-gray-500">T** 안정적응형(C0)</p>
            <p className="text-xl font-bold text-blue-600">{takTckClusterComparison["T**"].C0}%</p>
            <p className="text-xs text-gray-500 mt-0.5">vs T** {takTckClusterComparison.TCK.C0}%</p>
          </FindingBox>
          <FindingBox className="bg-amber-50 border-amber-200 text-center">
            <p className="text-xs text-gray-500">변화갈망형(C1) 양사 유사</p>
            <p className="text-xl font-bold text-amber-600">17%</p>
            <p className="text-xs text-gray-500 mt-0.5">T** {takTckClusterComparison["T**"].C1}% | T** {takTckClusterComparison.TCK.C1}%</p>
          </FindingBox>
        </div>

        {/* 직종별 클러스터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {jobTypeClusterData.map((jt) => (
            <div key={jt.type} className="rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4">
              <h4 className="text-sm font-bold text-gray-800 mb-2">{jt.type} ({jt.count}명)</h4>
              <div className="space-y-1.5">
                {jt.clusters.map((cl) => (
                  <div key={cl.id} className="flex justify-between text-xs">
                    <span className="text-gray-600">{cl.name}({cl.id})</span>
                    <span className={`font-semibold ${cl.id === "C3" ? "text-red-600" : cl.id === "C1" ? "text-amber-600" : cl.id === "C2" ? "text-blue-600" : "text-gray-900"}`}>
                      {cl.count}명 ({cl.pct}%)
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                생산적 에너지: {jt.productiveEnergy} | 문화 갭: {jt.cultureGap}
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================= */}
        {/* 03. 조직별 진단 (30개 조직 QQ Risk)                               */}
        {/* ================================================================= */}
        <SectionHeader
          title="03. 조직별 QQ Risk 진단"
          subtitle="30개 조직 Quiet Quitting 위험 지수 | 산출식: (안정에너지 − 생산에너지 + (5−유해에너지)×0.3) ×20"
        />

        <MethodNote>
          QQ Risk(Quiet Quitting 위험 지수)는 겉으로 편안해 보이지만(높은 안정에너지) 실제 몰입·도전의식(생산에너지)이 낮은 상태를 탐지합니다.
          ≥7% 고위험 | 5~7% 주의 | &lt;5% 양호
        </MethodNote>

        {/* Org Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {orgRiskData.map((org) => {
            const riskColor = getQqRiskColor(org.risk);
            const borderColor = org.risk === "high" ? "border-red-400" : org.risk === "medium" ? "border-amber-400" : "border-green-400";
            const bgColor = org.risk === "high" ? "from-red-50" : org.risk === "medium" ? "from-amber-50" : "from-green-50";
            return (
              <div
                key={org.organization}
                className={`rounded-lg p-4 border ${borderColor} bg-gradient-to-br ${bgColor} to-white shadow-sm`}
              >
                <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                  {org.organization}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: riskColor }} className="font-bold">
                    {getQqRiskSymbol(org.risk)}
                  </span>
                  <span className="text-xs text-gray-500">{org.count}명</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-gray-500">생산 에너지</div>
                  <div className="font-mono font-semibold text-gray-800 text-right">
                    {org.productiveEnergy.toFixed(2)}
                  </div>
                  <div className="text-gray-500">QQ Risk</div>
                  <div className="font-mono font-semibold text-right" style={{ color: riskColor }}>
                    {org.qqRisk}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QQ Risk Bar Chart */}
        <Card className="mb-10">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">전체 30개 조직 QQ Risk 순위</h3>
            <ResponsiveContainer width="100%" height={700}>
              <BarChart
                data={orgRiskData}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 12]} tickFormatter={(v: number) => `${v}%`} fontSize={12} />
                <YAxis type="category" dataKey="organization" width={160} fontSize={11} tick={{ fill: "#374151" }} />
                <Tooltip formatter={(value) => [`${value}%`, "QQ Risk"]} />
                <Bar dataKey="qqRisk" radius={[0, 4, 4, 0]}>
                  {orgRiskData.map((entry, index) => (
                    <Cell key={`risk-${index}`} fill={getQqRiskColor(entry.risk)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* 04. 문화 & 에너지                                                  */}
        {/* ================================================================= */}
        <SectionHeader
          title="04. 문화 & 에너지 분석"
          subtitle="8개 문화 차원 As-is/To-be 비교 및 T** vs T** 에너지 프로파일"
        />

        {/* Radar Chart + 문화 차원 설명 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">8개 문화 차원 레이더 차트</h3>
                <ResponsiveContainer width="100%" height={420}>
                  <RadarChart data={cultureRadarData} cx="50%" cy="50%" outerRadius="72%">
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="dimension" fontSize={11} tick={{ fill: "#374151" }} />
                    <PolarRadiusAxis angle={90} domain={[2, 4.2]} tick={{ fontSize: 10 }} tickCount={5} />
                    <Radar name="T** As-is" dataKey="takAsIs" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="T** To-be" dataKey="takToBe" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={2} strokeDasharray="6 3" />
                    <Radar name="T** As-is" dataKey="tckAsIs" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="T** To-be" dataKey="tckToBe" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={2} strokeDasharray="6 3" />
                    <Legend wrapperStyle={{ fontSize: 12 }} iconType="line" />
                    <Tooltip formatter={(value) => Number(value).toFixed(3)} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">8개 문화 차원 설문 문항</h4>
            {Object.entries(cultureDimensionDescriptions).map(([dim, desc], i) => (
              <div key={dim} className="text-xs p-2 rounded bg-gray-50 border border-gray-100">
                <span className="font-semibold text-blue-700">D{i + 1}. {dim}</span>
                <br />
                <span className="text-gray-500">&quot;{desc}&quot;</span>
              </div>
            ))}
          </div>
        </div>

        {/* 갭 분석 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <FindingBox className="bg-red-50 border-red-200 text-center">
            <p className="text-xs text-gray-600">최대 갭 차원</p>
            <p className="text-base font-bold text-red-600">{cultureGapSummary.maxGapDimension}</p>
            <p className="text-sm text-gray-700">전체 갭 {cultureGapSummary.maxGapValue} ({cultureGapSummary.maxGapDetail})</p>
          </FindingBox>
          <FindingBox className="bg-amber-50 border-amber-200 text-center">
            <p className="text-xs text-gray-600">문화적 거리</p>
            <p className="text-base font-bold text-amber-600">As-is {cultureGapSummary.distanceAsIs} → To-be {cultureGapSummary.distanceToBe}</p>
            <p className="text-sm text-gray-700">통합 후 T**·T** 문화 방향 더 벌어짐</p>
          </FindingBox>
          <FindingBox className="bg-blue-50 border-blue-200 text-center">
            <p className="text-xs text-gray-600">유일 역방향 갭</p>
            <p className="text-base font-bold text-blue-600">{cultureGapSummary.reverseGapDimension}</p>
            <p className="text-sm text-gray-700">전체 갭 {cultureGapSummary.reverseGapValue} ({cultureGapSummary.reverseGapDetail})</p>
          </FindingBox>
        </div>

        {/* 에너지 프로파일 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <FindingBox className="bg-orange-50 border-orange-200 text-center">
            <p className="text-xs text-gray-500">T** 생산적 에너지</p>
            <p className="text-xl font-bold text-orange-600">{energyProfile["T**"].productive}</p>
          </FindingBox>
          <FindingBox className="bg-teal-50 border-teal-200 text-center">
            <p className="text-xs text-gray-500">T** 생산적 에너지</p>
            <p className="text-xl font-bold text-teal-600">{energyProfile.TCK.productive}</p>
          </FindingBox>
          <FindingBox className="bg-orange-50 border-orange-200 text-center">
            <p className="text-xs text-gray-500">T** 냉소적 에너지</p>
            <p className="text-xl font-bold text-orange-600">{energyProfile["T**"].resigned}</p>
          </FindingBox>
          <FindingBox className="bg-teal-50 border-teal-200 text-center">
            <p className="text-xs text-gray-500">T** 냉소적 에너지</p>
            <p className="text-xl font-bold text-teal-600">{energyProfile.TCK.resigned}</p>
          </FindingBox>
        </div>

        <FindingBox className="bg-gray-50 border-gray-200 mb-10">
          <p className="text-xs font-semibold text-gray-700 mb-1">시사점</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            T**가 생산적 에너지 소폭 높음(+0.157). T**는 냉소적 에너지가 더 높아 동기부여 저하 상태.
            PMI 초기 T** 구성원 대상 우선 개입 필요.
          </p>
          <div className="flex gap-4 mt-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">T** 통합위험</p>
              <p className="text-lg font-bold text-red-600">52.2</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">T** 통합위험</p>
              <p className="text-lg font-bold text-amber-600">44.4</p>
            </div>
            <p className="text-xs text-gray-600 self-center ml-2">T**의 통합 위험이 유의미하게 높음</p>
          </div>
        </FindingBox>

        {/* Culture Radar Detail Table */}
        <Card className="mb-10">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">차원별 As-is → To-be 상세</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 pr-4 font-medium">차원</th>
                    <th className="pb-2 pr-4 font-medium text-right">T** As-is</th>
                    <th className="pb-2 pr-4 font-medium text-right">T** To-be</th>
                    <th className="pb-2 pr-4 font-medium text-right">T** Gap</th>
                    <th className="pb-2 pr-4 font-medium text-right">T** As-is</th>
                    <th className="pb-2 pr-4 font-medium text-right">T** To-be</th>
                    <th className="pb-2 font-medium text-right">T** Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {cultureRadarData.map((row) => {
                    const takGap = row.takToBe - row.takAsIs;
                    const tckGap = row.tckToBe - row.tckAsIs;
                    return (
                      <tr key={row.dimension} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium text-gray-900">{row.dimension}</td>
                        <td className="py-2 pr-4 text-right text-blue-600">{row.takAsIs.toFixed(3)}</td>
                        <td className="py-2 pr-4 text-right text-blue-800 font-semibold">{row.takToBe.toFixed(3)}</td>
                        <td className="py-2 pr-4 text-right">
                          <span className={takGap > 0 ? "text-amber-600" : "text-green-600"}>
                            {takGap > 0 ? "+" : ""}{takGap.toFixed(3)}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right text-red-500">{row.tckAsIs.toFixed(3)}</td>
                        <td className="py-2 pr-4 text-right text-red-700 font-semibold">{row.tckToBe.toFixed(3)}</td>
                        <td className="py-2 text-right">
                          <span className={tckGap > 0 ? "text-amber-600" : "text-green-600"}>
                            {tckGap > 0 ? "+" : ""}{tckGap.toFixed(3)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* 05. 보상 & 인사제도                                                */}
        {/* ================================================================= */}
        <SectionHeader
          title="05. 보상 & 인사제도 분석"
          subtitle="성과등급별 생애 임금 시뮬레이션 및 기능직 임금 실태"
        />

        {/* 생애 임금 시뮬레이션 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {lifeWageData.grades.map((g) => (
            <div
              key={g.grade}
              className="rounded-lg p-4 text-center border-2"
              style={{
                borderColor: g.color,
                background: `linear-gradient(to bottom right, ${g.color}10, white)`,
              }}
            >
              <p className="text-xs text-gray-500 font-semibold">{g.label}</p>
              <p className="text-2xl font-bold" style={{ color: g.color }}>
                {g.cumulative20yr}
              </p>
              <p className="text-xs text-gray-500">20년 누적</p>
            </div>
          ))}
        </div>

        <FindingBox className="bg-red-50 border-red-200 mb-6">
          <p className="text-xs font-semibold text-red-700 mb-1">핵심 시사점</p>
          <p className="text-xs text-gray-700 leading-relaxed">
            S등급과 C등급의 20년 누적 임금 격차{" "}
            <span className="font-bold text-red-600">{lifeWageData.gapSminusC} ({lifeWageData.gapPct})</span>.
            성과 차등이 장기 인재 유지와 동기부여에 결정적 영향.
          </p>
        </FindingBox>

        {/* 성과 인상률 + 보상 전략 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">현행 성과 인상률</h3>
            <div className="space-y-2">
              {lifeWageData.raiseRates.map((r) => (
                <div key={r.grade} className="flex items-center gap-3">
                  <span className={`w-8 text-center py-1 text-xs font-bold rounded ${
                    r.grade === "S" ? "bg-yellow-100 text-yellow-700" :
                    r.grade === "A" ? "bg-blue-100 text-blue-700" :
                    r.grade === "B" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{r.grade}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center pl-2 ${
                        r.grade === "S" ? "bg-yellow-400" :
                        r.grade === "A" ? "bg-blue-400" :
                        r.grade === "B" ? "bg-green-400" :
                        "bg-gray-400"
                      }`}
                      style={{ width: `${(r.rate / 6) * 80}%` }}
                    >
                      <span className="text-xs font-bold text-white">{r.rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">보상 전략 권고</h3>
            {compensationStrategy.map((s, i) => {
              const colors = ["bg-green-50 border-green-200", "bg-blue-50 border-blue-200", "bg-gray-50 border-gray-200"];
              const textColors = ["text-green-700", "text-blue-700", "text-gray-700"];
              return (
                <div key={i} className={`rounded-lg border p-3 ${colors[i]}`}>
                  <p className={`text-xs font-semibold ${textColors[i]} mb-1`}>{s.phase}: {s.label}</p>
                  <p className="text-xs text-gray-600">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 기능직 임금 분석 */}
        <Card className="mb-10">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              기능직 개인 임금 실태 분석
            </h3>
            <p className="text-xs text-gray-500 mb-4">2,768개 개인별 임금 레코드 분석 (T** 1,630건 / T** 1,138건)</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <FindingBox className="bg-blue-50 border-blue-200 text-center">
                <p className="text-xs text-gray-500">T** 평균 통상임금</p>
                <p className="text-lg font-bold text-blue-700">{wageAnalysis.summary.takAvg.toLocaleString()}</p>
                <p className="text-xs text-gray-400">원/월</p>
              </FindingBox>
              <FindingBox className="bg-indigo-50 border-indigo-200 text-center">
                <p className="text-xs text-gray-500">T** 평균 통상임금</p>
                <p className="text-lg font-bold text-indigo-700">{wageAnalysis.summary.tckAvg.toLocaleString()}</p>
                <p className="text-xs text-gray-400">원/월</p>
              </FindingBox>
              <FindingBox className="bg-red-50 border-red-200 text-center">
                <p className="text-xs text-gray-500">T**-T** 격차</p>
                <p className="text-lg font-bold text-red-600">{wageAnalysis.summary.gapPct}</p>
                <p className="text-xs text-gray-400">T**가 높음 ({wageAnalysis.summary.gapAmount})</p>
              </FindingBox>
              <FindingBox className="bg-amber-50 border-amber-200 text-center">
                <p className="text-xs text-gray-500">연간급여 격차</p>
                <p className="text-lg font-bold text-amber-700">{wageAnalysis.summary.annualGap}</p>
                <p className="text-xs text-gray-400">T** {wageAnalysis.summary.annualTak} vs T** {wageAnalysis.summary.annualTck}</p>
              </FindingBox>
            </div>

            <h4 className="text-xs font-semibold text-gray-700 mb-3">직급명별 평균 통상임금 비교 (T** vs T**)</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-3 py-2 font-semibold text-gray-600 text-center">직급명</th>
                    <th className="px-3 py-2 font-semibold text-blue-700 text-center">T** 평균 (원)</th>
                    <th className="px-3 py-2 font-semibold text-indigo-700 text-center">T** 평균 (원)</th>
                    <th className="px-3 py-2 font-semibold text-red-600 text-center">격차</th>
                    <th className="px-3 py-2 font-semibold text-gray-600 text-center">T** 인원</th>
                    <th className="px-3 py-2 font-semibold text-gray-600 text-center">T** 인원</th>
                  </tr>
                </thead>
                <tbody>
                  {wageAnalysis.byGrade.map((row) => (
                    <tr key={row.grade} className={`border-b border-gray-100 hover:bg-gray-50 ${row.highlight ? "bg-amber-50" : ""}`}>
                      <td className="px-3 py-2 font-semibold text-center">{row.grade}{row.highlight ? " *" : ""}</td>
                      <td className="px-3 py-2 text-blue-700 font-medium text-center">{row.takAvg}</td>
                      <td className="px-3 py-2 text-indigo-700 font-medium text-center">{row.tckAvg}</td>
                      <td className="px-3 py-2 text-red-600 font-bold text-center">{row.gap}</td>
                      <td className="px-3 py-2 text-gray-500 text-center">{row.takCount}</td>
                      <td className="px-3 py-2 text-gray-500 text-center">{row.tckCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FindingBox className="bg-red-50 border-red-200">
                <p className="text-xs font-semibold text-red-700 mb-1">핵심 시사점: 구조적 급여 격차</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  J4에서 17.6%, J5에서 22.3% 격차. 통합 후 동일 직급명에서 급여 불형평 인식이 가장 강하게 나타날 수 있는 구간. 합병 초기 형평성 조정 필요.
                </p>
              </FindingBox>
              <FindingBox className="bg-amber-50 border-amber-200">
                <p className="text-xs font-semibold text-amber-700 mb-1">J4 집중 체류 문제 (T** 65.2%)</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  T** 기능직의 65.2%가 J4에 집중. J5 비중(7.2%)이 T**(11.9%)보다 낮음. 승진 병목이 체류와 체념으로 연결될 위험. 승진 기준 재검토 권고.
                </p>
              </FindingBox>
            </div>
          </CardContent>
        </Card>

        {/* ================================================================= */}
        {/* 06. 통합 인사이트                                                  */}
        {/* ================================================================= */}
        <SectionHeader
          title="06. 통합 인사이트"
          subtitle="문화 통합 위험, Proxy 지표, 이탈 전조 신호, 핵심 요인 분석"
        />

        {/* 문화 통합 위험 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <MethodNote>
              <span className="font-semibold">문화적 거리(Cultural Distance)란?</span>{" "}
              T**와 T**의 8개 문화 차원 평균값 벡터 간 유클리드 거리입니다.
              값이 클수록 두 조직의 문화 지향이 다르며, 0.5 이상이면 통합 위험 구간으로 간주합니다.
              As-is=0.43(주의)이나 To-be=0.66(위험)으로 방치 시 합병 후 문화 분열이 심화됩니다.
            </MethodNote>

            {/* Proxy Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FindingBox className="border-gray-200">
                <h4 className="text-xs font-semibold text-gray-600 mb-3">QQ Risk Score</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">T**</span><span className="font-bold text-red-600">{proxyMetrics.qqRisk["T**"]}%</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-400 rounded-full" style={{ width: `${proxyMetrics.qqRisk["T**"] * 10}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">T**</span><span className="font-bold text-amber-600">{proxyMetrics.qqRisk.TCK}%</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${proxyMetrics.qqRisk.TCK * 10}%` }} /></div>
                  </div>
                </div>
              </FindingBox>
              <FindingBox className="border-gray-200">
                <h4 className="text-xs font-semibold text-gray-600 mb-3">변화 준비도</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">T**</span><span className="font-bold text-amber-600">{proxyMetrics.changeReady["T**"]}%</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${proxyMetrics.changeReady["T**"] * 4}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">T**</span><span className="font-bold text-green-600">{proxyMetrics.changeReady.TCK}%</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-400 rounded-full" style={{ width: `${proxyMetrics.changeReady.TCK * 4}%` }} /></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{proxyMetrics.changeReady.note}</p>
              </FindingBox>
              <FindingBox className="border-gray-200">
                <h4 className="text-xs font-semibold text-gray-600 mb-3">통합 위험 지수</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">T**</span><span className="font-bold text-red-600">{proxyMetrics.integrationRisk["T**"]}</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${proxyMetrics.integrationRisk["T**"] * 1.2}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">T**</span><span className="font-bold text-amber-600">{proxyMetrics.integrationRisk.TCK}</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${proxyMetrics.integrationRisk.TCK * 1.2}%` }} /></div>
                  </div>
                </div>
                <p className="text-xs text-red-600 font-semibold mt-2">{proxyMetrics.integrationRisk.note}</p>
              </FindingBox>
            </div>
          </div>
          <div className="space-y-3">
            <FindingBox className="bg-red-50 border-red-200 text-center">
              <p className="text-xs text-gray-500 mb-1">문화적 거리 (As-is)</p>
              <p className="text-3xl font-bold text-orange-600">{cultureGapSummary.distanceAsIs}</p>
              <p className="text-xs text-gray-500">현재 T**·T** 문화 거리</p>
            </FindingBox>
            <FindingBox className="bg-red-100 border-red-300 text-center">
              <p className="text-xs text-gray-500 mb-1">문화적 거리 (To-be)</p>
              <p className="text-3xl font-bold text-red-600">{cultureGapSummary.distanceToBe}</p>
              <p className="text-xs text-red-700 font-semibold">{cultureGapSummary.distanceChange} 악화 예상</p>
            </FindingBox>
            <FindingBox className="bg-gray-50 border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                양사가 지향하는 미래 문화 방향이 다름. PMI 없이 방치 시 문화적 분열 심화. 공통 To-be 비전 수립 워크숍 <span className="font-semibold text-red-600">즉각 필요</span>.
              </p>
            </FindingBox>
          </div>
        </div>

        {/* 이탈 전조 신호 */}
        <h3 className="text-sm font-semibold text-gray-900 mb-3">이탈 전조 신호 분석 (Isolation Forest)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <FindingBox className="bg-red-50 border-red-200 text-center">
            <p className="text-xs text-gray-500">전체 이상치</p>
            <p className="text-3xl font-bold text-red-600">{anomalyData.total}명</p>
            <p className="text-xs text-gray-500">{anomalyData.rate}%</p>
          </FindingBox>
          <FindingBox className="bg-orange-50 border-orange-200 text-center">
            <p className="text-xs text-gray-500">T** 이상치</p>
            <p className="text-3xl font-bold text-orange-600">{anomalyData.takCount}명</p>
            <p className="text-xs text-gray-500">전체의 {anomalyData.takPct}%</p>
          </FindingBox>
          <FindingBox className="bg-amber-50 border-amber-200 text-center">
            <p className="text-xs text-gray-500">T** 이상치</p>
            <p className="text-3xl font-bold text-amber-600">{anomalyData.tckCount}명</p>
            <p className="text-xs text-gray-500">전체의 {anomalyData.tckPct}%</p>
          </FindingBox>
          <FindingBox className="bg-gray-50 border-gray-200 text-center">
            <p className="text-xs text-gray-500">이상치 생산 에너지</p>
            <p className="text-3xl font-bold text-gray-600">{anomalyData.anomalyProductiveEnergy}</p>
            <p className="text-xs text-gray-500">전체 {anomalyData.overallProductiveEnergy}와 유사</p>
          </FindingBox>
        </div>
        <FindingBox className="bg-red-50 border-red-200 mb-6">
          <p className="text-xs font-semibold text-red-700 mb-1">해석</p>
          <p className="text-xs text-gray-700 leading-relaxed">{anomalyData.interpretation}</p>
        </FindingBox>

        {/* GBM Feature Importance */}
        <h3 className="text-sm font-semibold text-gray-900 mb-3">몰입 결정 핵심 요인 (GBM Feature Importance)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={shapData}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 0.25]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} fontSize={12} />
                  <YAxis type="category" dataKey="feature" width={50} fontSize={12} tick={{ fill: "#374151" }} />
                  <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(2)}%`, "중요도"]} />
                  <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {shapData.map((_, index) => (
                      <Cell key={`shap-${index}`} fill={index === 0 ? "#3b82f6" : "#93c5fd"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-2 px-3 text-xs font-semibold text-gray-600">순위</th>
                  <th className="py-2 px-3 text-xs font-semibold text-gray-600">문항</th>
                  <th className="py-2 px-3 text-xs font-semibold text-gray-600">차원</th>
                  <th className="py-2 px-3 text-xs font-semibold text-gray-600">중요도</th>
                </tr>
              </thead>
              <tbody>
                {shapData.map((s) => (
                  <tr key={s.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-1.5 px-3 text-xs font-mono text-gray-500">{String(s.rank).padStart(2, "0")}</td>
                    <td className="py-1.5 px-3 text-xs font-semibold text-gray-900">{s.feature}</td>
                    <td className="py-1.5 px-3 text-xs text-gray-700">{s.dimension}</td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(s.importance / 0.2325) * 60}px`, minWidth: "4px" }} />
                        <span className="text-xs font-mono text-gray-700">{s.importance.toFixed(4)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <FindingBox className="bg-blue-50 border-blue-200 mt-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">핵심 시사점</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                &apos;협업과 신뢰&apos;(Q_1) 중요도 23.25%로 압도적 1위. 이 단일 문항이 구성원 몰입 수준을 가장 강하게 설명.
                혁신과 학습(Q_3, 11.78%)이 2위. PMI 초기 문화 정렬 프로그램은 이 두 차원에 집중해야 ROI 극대화.
              </p>
            </FindingBox>
          </div>
        </div>
        <div className="mb-10" />

        {/* ================================================================= */}
        {/* 07. 방법론                                                         */}
        {/* ================================================================= */}
        <SectionHeader
          title="07. 분석 방법론"
          subtitle="6단계 프로세스, 11가지 분석 기법, AutoML 성능 비교"
        />

        {/* 프로세스 */}
        <div className="flex flex-wrap gap-0 mb-6">
          {methodologySteps.map((step, i) => (
            <div key={step.step} className="flex items-center">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-3 text-center min-w-[100px]">
                <p className="text-xs font-bold text-blue-700">Step {step.step}</p>
                <p className="text-xs text-gray-700 mt-0.5">{step.title}</p>
              </div>
              {i < methodologySteps.length - 1 && (
                <span className="text-gray-400 text-lg px-1">&rarr;</span>
              )}
            </div>
          ))}
        </div>

        {/* 11가지 분석 기법 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {analysisTechniques.map((t) => (
            <div key={t.id} className="rounded-lg border border-gray-200 p-3 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-start gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold rounded px-1.5 py-0.5 flex-none">
                  {String(t.id).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AutoML */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">AutoML 분류기 성능 비교</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={autoMLData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[60, 100]} tickFormatter={(v: number) => `${v}%`} fontSize={12} />
                  <YAxis type="category" dataKey="model" width={140} fontSize={11} tick={{ fill: "#374151" }} />
                  <Tooltip formatter={(value) => [`${value}%`, "정확도"]} />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                    {autoMLData.map((entry, index) => (
                      <Cell key={`ml-${index}`} fill={entry.best ? "#22c55e" : "#d1d5db"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="py-2 px-3 text-xs font-semibold text-gray-600">모델</th>
                      <th className="py-2 px-3 text-xs font-semibold text-gray-600">정확도</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autoMLData.map((m) => (
                      <tr key={m.model} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm font-medium text-gray-900">
                          {m.model}
                          {m.best && (
                            <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                              Best
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 rounded-full ${m.best ? "bg-green-500" : "bg-gray-300"}`}
                              style={{ width: `${m.accuracy}%`, maxWidth: "120px", minWidth: "4px" }}
                            />
                            <span className={`text-sm font-bold ${m.best ? "text-green-700" : "text-gray-700"}`}>
                              {m.accuracy}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <FindingBox className="bg-green-50 border-green-200 mt-3">
                  <p className="text-xs text-green-700 leading-relaxed">
                    Logistic Regression이 97.2% 정확도로 최고 성능. 클러스터가 선형적으로 구분 가능함을 시사.
                    고차원 모델(GBM, RF) 대비 단순 모델 우세 — 설문 데이터의 구조적 패턴 명확.
                  </p>
                </FindingBox>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 데이터 소스 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {dataSources.map((ds) => (
            <div key={ds.name} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-800">{ds.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{ds.desc}</p>
            </div>
          ))}
        </div>

        {/* ================================================================= */}
        {/* 08. 전략 로드맵                                                    */}
        {/* ================================================================= */}
        <SectionHeader
          title="08. 전략 로드맵"
          subtitle="Quick Win vs Long-term Strategy"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Quick Win */}
          <div className="rounded-lg border-2 border-green-400 bg-gradient-to-br from-green-50 to-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-600 font-bold text-lg">●</span>
              <h3 className="font-bold text-gray-900">Quick Win (0~6개월)</h3>
            </div>
            <ul className="space-y-2">
              {quickWinRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">▶</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term */}
          <div className="rounded-lg border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600 font-bold text-lg">▼</span>
              <h3 className="font-bold text-gray-900">Long-term Strategy (6개월~2년)</h3>
            </div>
            <ul className="space-y-2">
              {longTermRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">▶</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
