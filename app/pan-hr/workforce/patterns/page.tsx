"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  Building2,
  ChevronRight,
  Database,
  Monitor,
  Smartphone,
  MapPin,
} from "lucide-react";
import {
  rawDataStats,
  tagSummary,
  patternData,
  clusterStats,
  CLUSTER_COLORS,
  computeBoxPlotStats,
  getTeamsByCluster,
  type ClusterType,
  type PatternData,
  type ClusterStats as ClusterStatsType,
} from "@/lib/data/workforce-patterns-data";

// ─── 숫자 포맷 유틸리티 ─────────────────────────────────────────────────────────

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

// ─── 커스텀 툴팁 ────────────────────────────────────────────────────────────────

interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PatternData;
  }>;
}

function ScatterTooltipContent({ active, payload }: ScatterTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
      <div className="font-semibold text-neutral-900 mb-1">{data.team}</div>
      <div className="text-neutral-500 text-xs mb-2">
        {data.center} &middot; {data.bu}
      </div>
      <div className="space-y-1 text-neutral-700">
        <div className="flex justify-between gap-4">
          <span>인원</span>
          <span className="font-medium">{data.employee_count}명</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>장비 사용</span>
          <span className="font-medium">{data.equipment_per_person}건/인</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>이동성 지수</span>
          <span className="font-medium">{data.movement_per_person}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Knox</span>
          <span className="font-medium">{data.knox_per_person}건/인</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>회의</span>
          <span className="font-medium">{data.meeting_per_person}건/인</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>신뢰도</span>
          <span className="font-medium">
            {(data.reliability_score * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-neutral-100">
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: CLUSTER_COLORS[data.cluster_type] }}
        >
          {data.cluster_type}
        </span>
      </div>
    </div>
  );
}

// ─── 커스텀 범례 ────────────────────────────────────────────────────────────────

function ClusterLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
        <div key={name} className="flex items-center gap-1.5 text-sm">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: color }}
          />
          <span className="text-neutral-700">{name}</span>
        </div>
      ))}
    </div>
  );
}

// ─── 박스 플롯 SVG 컴포넌트 ─────────────────────────────────────────────────────

interface BoxPlotChartProps {
  title: string;
  accessor: (d: PatternData) => number;
  maxY: number;
}

function BoxPlotChart({ title, accessor, maxY }: BoxPlotChartProps) {
  const clusterNames: ClusterType[] = [
    "시스템운영집중형",
    "현장이동활발형",
    "디지털협업중심형",
    "저활동형",
    "균형업무형",
  ];

  const boxData = clusterNames.map((name) => {
    const teams = getTeamsByCluster(name);
    const values = teams.map(accessor);
    return { name, stats: computeBoxPlotStats(values) };
  });

  const chartWidth = 500;
  const chartHeight = 320;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 80;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const scaleY = (v: number) => padTop + plotH - (v / maxY) * plotH;
  const boxWidth = 40;
  const gap = plotW / clusterNames.length;

  // Y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round((maxY / 4) * i)
  );

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-neutral-800 mb-3">{title}</h3>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
      >
        {/* Y-axis grid lines and labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padLeft}
              y1={scaleY(tick)}
              x2={chartWidth - padRight}
              y2={scaleY(tick)}
              stroke="#e5e5e5"
              strokeDasharray="3,3"
            />
            <text
              x={padLeft - 8}
              y={scaleY(tick) + 4}
              textAnchor="end"
              className="text-[10px] fill-neutral-400"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Box plots */}
        {boxData.map((d, i) => {
          const cx = padLeft + gap * i + gap / 2;
          const color = CLUSTER_COLORS[d.name];
          const { min, q1, median, q3, max } = d.stats;

          return (
            <g key={d.name}>
              {/* Whisker line (min to max) */}
              <line
                x1={cx}
                y1={scaleY(max)}
                x2={cx}
                y2={scaleY(min)}
                stroke={color}
                strokeWidth={1.5}
              />
              {/* Min cap */}
              <line
                x1={cx - boxWidth / 4}
                y1={scaleY(min)}
                x2={cx + boxWidth / 4}
                y2={scaleY(min)}
                stroke={color}
                strokeWidth={1.5}
              />
              {/* Max cap */}
              <line
                x1={cx - boxWidth / 4}
                y1={scaleY(max)}
                x2={cx + boxWidth / 4}
                y2={scaleY(max)}
                stroke={color}
                strokeWidth={1.5}
              />
              {/* Box (Q1 to Q3) */}
              <rect
                x={cx - boxWidth / 2}
                y={scaleY(q3)}
                width={boxWidth}
                height={scaleY(q1) - scaleY(q3)}
                fill={color}
                fillOpacity={0.2}
                stroke={color}
                strokeWidth={1.5}
                rx={2}
              />
              {/* Median line */}
              <line
                x1={cx - boxWidth / 2}
                y1={scaleY(median)}
                x2={cx + boxWidth / 2}
                y2={scaleY(median)}
                stroke={color}
                strokeWidth={2.5}
              />
              {/* Label */}
              <text
                x={cx}
                y={chartHeight - padBottom + 16}
                textAnchor="middle"
                className="text-[9px] fill-neutral-600"
              >
                {d.name.length > 6
                  ? d.name.slice(0, 6) + "..."
                  : d.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── 메인 페이지 ────────────────────────────────────────────────────────────────

export default function WorkforcePatternsPage() {
  const [expandedClusters, setExpandedClusters] = useState<
    Record<string, boolean>
  >({});

  const toggleCluster = (name: string) => {
    setExpandedClusters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // 클러스터 통계를 total_employees 기준 내림차순 정렬
  const sortedClusterStats = useMemo(
    () =>
      [...clusterStats].sort(
        (a, b) => b.total_employees - a.total_employees
      ),
    []
  );

  // 클러스터별 대표 팀 (인원 상위 2팀)
  const topTeamsByCluster = useMemo(() => {
    const result: Record<string, string> = {};
    for (const cs of clusterStats) {
      const teams = getTeamsByCluster(cs.cluster_name);
      const top = [...teams]
        .sort((a, b) => b.employee_count - a.employee_count)
        .slice(0, 2)
        .map((t) => t.team);
      result[cs.cluster_name] = top.join(", ");
    }
    return result;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* ═══ Breadcrumb ═══ */}
      <div className="mb-8">
        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
          <Link
            href="/pan-hr"
            className="hover:text-neutral-700 transition-colors"
          >
            Pan HR
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/pan-hr/workforce"
            className="hover:text-neutral-700 transition-colors"
          >
            인력관리
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium">근무 패턴분석</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            근무 패턴 분석
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            실시간 업무패턴 분석 및 근무 추정시간 모니터링
          </p>
        </div>
      </div>

      {/* ═══ Raw Data Scale Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* 전체 태그 데이터 */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              전체 태그 데이터
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {formatLargeNumber(rawDataStats.total_tag_records)}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            월 {formatLargeNumber(rawDataStats.monthly_tag_records)}건 수집
          </p>
        </div>

        {/* 장비 시스템 */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              장비 시스템
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {formatLargeNumber(rawDataStats.total_equipment_records)}
          </div>
          <p className="text-xs text-purple-600 mt-1">
            MES &middot; MDM &middot; EAM &middot; EQUIS
          </p>
        </div>

        {/* Knox 시스템 */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Knox 시스템
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {formatLargeNumber(rawDataStats.total_knox_records)}
          </div>
          <p className="text-xs text-orange-600 mt-1">모바일 활동 기록</p>
        </div>

        {/* 장소 유형 */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-700">
              장소 유형
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {rawDataStats.tag_location_types}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            태그 위치 분류 체계
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-5 py-3 mb-10 text-sm text-neutral-600">
        <span className="font-medium text-neutral-800">전체 데이터 규모:</span>{" "}
        {tagSummary.total_employees.toLocaleString()}명 &middot;{" "}
        {tagSummary.total_teams}개 팀 &middot; 태그{" "}
        {formatLargeNumber(rawDataStats.total_tag_records)}건 분석 기반
      </div>

      {/* ═══ Pattern Group Summary Table ═══ */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-neutral-500" />
          발견된 패턴 그룹
        </h2>
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    패턴 유형
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">
                    팀 수
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">
                    직원 수
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">
                    평균 Knox
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">
                    평균 장비
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">
                    주요 팀
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedClusterStats.map((cs) => (
                  <tr
                    key={cs.cluster_name}
                    className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block shrink-0"
                          style={{
                            backgroundColor:
                              CLUSTER_COLORS[cs.cluster_name],
                          }}
                        />
                        <span className="font-medium text-neutral-900">
                          {cs.cluster_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-700">
                      {cs.team_count}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900">
                      {cs.total_employees.toLocaleString()}명
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-700">
                      {cs.avg_knox_per_person.toFixed(0)}건/인
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-700">
                      {cs.avg_equipment_per_person.toFixed(0)}건/인
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">
                      {topTeamsByCluster[cs.cluster_name]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ Scatter Chart ═══ */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neutral-500" />
          업무 패턴 클러스터 분포
        </h2>
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
              margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                type="number"
                dataKey="equipment_per_person"
                name="시스템 사용"
                domain={[0, 700]}
                tick={{ fontSize: 12, fill: "#737373" }}
                label={{
                  value: "시스템 사용 (건/인)",
                  position: "insideBottomRight",
                  offset: -5,
                  style: { fontSize: 12, fill: "#525252" },
                }}
              />
              <YAxis
                type="number"
                dataKey="movement_per_person"
                name="이동성 지수"
                domain={[0, 250]}
                tick={{ fontSize: 12, fill: "#737373" }}
                label={{
                  value: "이동성 지수",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 12, fill: "#525252" },
                }}
              />
              <Tooltip
                content={<ScatterTooltipContent />}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter data={patternData} fill="#8884d8">
                {patternData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CLUSTER_COLORS[entry.cluster_type]}
                    fillOpacity={0.75}
                    r={Math.max(4, Math.sqrt(entry.employee_count / 5))}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <ClusterLegend />
        </div>
      </div>

      {/* ═══ Box Plots (Two Column) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <BoxPlotChart
          title="Knox 활동 분포 (클러스터별)"
          accessor={(d) => d.knox_per_person}
          maxY={800}
        />
        <BoxPlotChart
          title="장비 사용 분포 (클러스터별)"
          accessor={(d) => d.equipment_per_person}
          maxY={800}
        />
      </div>

      {/* ═══ Pattern Detail Sections (Accordion) ═══ */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-neutral-500" />
          패턴 상세 분석
        </h2>
        <div className="space-y-3">
          {sortedClusterStats.map((cs) => {
            const isExpanded = expandedClusters[cs.cluster_name] === true;
            const teams = getTeamsByCluster(cs.cluster_name);

            // 센터별 그룹핑
            const centerGroups: Record<string, PatternData[]> = {};
            for (const t of teams) {
              if (!centerGroups[t.center]) {
                centerGroups[t.center] = [];
              }
              centerGroups[t.center].push(t);
            }

            return (
              <div
                key={cs.cluster_name}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => toggleCluster(cs.cluster_name)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          CLUSTER_COLORS[cs.cluster_name],
                      }}
                    />
                    <div className="text-left">
                      <span className="font-semibold text-neutral-900">
                        {cs.cluster_name}
                      </span>
                      <span className="text-sm text-neutral-500 ml-3">
                        {cs.team_count}개 팀 &middot;{" "}
                        {cs.total_employees.toLocaleString()}명
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-neutral-100">
                    {/* 4-stat grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-5">
                      <StatCard
                        label="평균 Knox"
                        value={`${cs.avg_knox_per_person.toFixed(0)}건/인`}
                        icon={
                          <Smartphone className="w-4 h-4 text-neutral-400" />
                        }
                      />
                      <StatCard
                        label="평균 장비"
                        value={`${cs.avg_equipment_per_person.toFixed(0)}건/인`}
                        icon={
                          <Monitor className="w-4 h-4 text-neutral-400" />
                        }
                      />
                      <StatCard
                        label="평균 이동성"
                        value={`${cs.avg_movement_per_person.toFixed(0)}`}
                        icon={
                          <Activity className="w-4 h-4 text-neutral-400" />
                        }
                      />
                      <StatCard
                        label="평균 신뢰도"
                        value={`${(cs.avg_reliability * 100).toFixed(0)}%`}
                        icon={
                          <TrendingUp className="w-4 h-4 text-neutral-400" />
                        }
                      />
                    </div>

                    {/* Teams by center */}
                    {Object.entries(centerGroups).map(
                      ([centerName, centerTeams]) => (
                        <div key={centerName} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Building2 className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-700">
                              {centerName}
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-neutral-50">
                                  <th className="text-left px-3 py-2 font-medium text-neutral-500 text-xs">
                                    팀
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    인원
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    장비
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    이동성
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    Knox
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    회의
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    신뢰도
                                  </th>
                                  <th className="text-right px-3 py-2 font-medium text-neutral-500 text-xs">
                                    보정계수
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {centerTeams
                                  .sort(
                                    (a, b) =>
                                      b.employee_count - a.employee_count
                                  )
                                  .map((t) => (
                                    <tr
                                      key={t.team}
                                      className="border-t border-neutral-100"
                                    >
                                      <td className="px-3 py-2 text-neutral-800 font-medium">
                                        {t.team}
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {t.employee_count}명
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {t.equipment_per_person}
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {t.movement_per_person}
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {t.knox_per_person}
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {t.meeting_per_person}
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {(t.reliability_score * 100).toFixed(
                                          0
                                        )}
                                        %
                                      </td>
                                      <td className="px-3 py-2 text-right text-neutral-700">
                                        {t.correction_factor.toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 통계 카드 서브 컴포넌트 ────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-neutral-500">{label}</span>
      </div>
      <div className="text-sm font-semibold text-neutral-900">{value}</div>
    </div>
  );
}
