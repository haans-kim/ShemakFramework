"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  Activity,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CenterMetrics {
  centerCode: string;
  centerName: string;
  headcount: number;
  avgEfficiency: number;
  avgWorkHours: number;
  overtimeRatio: number;
}

export interface TeamMetrics {
  orgCode: string;
  orgName: string;
  parentCenterCode: string;
  parentCenterName: string;
  headcount: number;
  avgEfficiency: number;
  avgWorkHours: number;
  overtimeRatio: number;
  burnoutRiskLevel: string;
}

export interface CompanyTotals {
  totalHeadcount: number;
  avgEfficiency: number;
  avgWorkHours: number;
  avgOvertimeRatio: number;
}

interface Thresholds {
  low: number;
  high: number;
}

interface MetricConfig {
  label: string;
  key: keyof Pick<CenterMetrics, "avgEfficiency" | "avgWorkHours" | "overtimeRatio" | "headcount">;
  teamKey: keyof Pick<TeamMetrics, "avgEfficiency" | "avgWorkHours" | "overtimeRatio" | "headcount">;
  companyKey: keyof Pick<CompanyTotals, "avgEfficiency" | "avgWorkHours" | "avgOvertimeRatio" | "totalHeadcount">;
  format: (v: number) => string;
  /** true = higher value is worse (overtime, hours) */
  higherIsWorse: boolean;
}

const METRIC_CONFIGS: MetricConfig[] = [
  {
    label: "효율성(%)",
    key: "avgEfficiency",
    teamKey: "avgEfficiency",
    companyKey: "avgEfficiency",
    format: (v) => `${v.toFixed(1)}%`,
    higherIsWorse: false,
  },
  {
    label: "주간 근무시간(h)",
    key: "avgWorkHours",
    teamKey: "avgWorkHours",
    companyKey: "avgWorkHours",
    format: (v) => `${v.toFixed(1)}h`,
    higherIsWorse: true,
  },
  {
    label: "초과근무율(%)",
    key: "overtimeRatio",
    teamKey: "overtimeRatio",
    companyKey: "avgOvertimeRatio",
    format: (v) => `${v.toFixed(1)}%`,
    higherIsWorse: true,
  },
  {
    label: "인원(명)",
    key: "headcount",
    teamKey: "headcount",
    companyKey: "totalHeadcount",
    format: (v) => `${v}명`,
    higherIsWorse: false,
  },
];

// ─── Threshold Calculation ───────────────────────────────────────────────────

function calculateThresholds(values: number[]): Thresholds {
  if (values.length === 0) {
    throw new Error("Cannot calculate thresholds from empty array");
  }
  const sorted = [...values].sort((a, b) => a - b);
  const p20Index = Math.floor(sorted.length * 0.2);
  const p80Index = Math.floor(sorted.length * 0.8);
  return {
    low: sorted[p20Index],
    high: sorted[p80Index],
  };
}

function getIndicatorBand(
  value: number,
  thresholds: Thresholds
): "high" | "mid" | "low" {
  if (value >= thresholds.high) return "high";
  if (value <= thresholds.low) return "low";
  return "mid";
}

// ─── MetricIndicator ─────────────────────────────────────────────────────────

interface MetricIndicatorProps {
  value: number;
  thresholds: Thresholds | null;
  format: (v: number) => string;
  higherIsWorse: boolean;
  isCompanyAvg?: boolean;
}

function MetricIndicator({
  value,
  thresholds,
  format,
  higherIsWorse,
  isCompanyAvg,
}: MetricIndicatorProps) {
  if (isCompanyAvg) {
    return (
      <div className="px-3 py-2 rounded-lg text-center bg-neutral-100 border border-neutral-300">
        <span className="text-lg font-bold text-neutral-700">
          {format(value)}
        </span>
      </div>
    );
  }

  if (!thresholds) {
    return (
      <div className="px-3 py-2 rounded-lg text-center bg-neutral-50 border border-neutral-200">
        <span className="text-lg font-bold text-neutral-600">
          {format(value)}
        </span>
      </div>
    );
  }

  const band = getIndicatorBand(value, thresholds);

  // For metrics where higher is worse (overtime, hours):
  //   high band = bad (red), low band = good (blue)
  // For metrics where higher is better (efficiency):
  //   high band = good (blue), low band = bad (red)
  let bgColor: string;
  let borderColor: string;
  let textColor: string;
  let indicator: string;
  let indicatorColor: string;

  if (higherIsWorse) {
    if (band === "high") {
      bgColor = "bg-red-50";
      borderColor = "border-red-400";
      textColor = "text-red-800";
      indicator = "▲";
      indicatorColor = "text-red-600";
    } else if (band === "low") {
      bgColor = "bg-blue-50";
      borderColor = "border-blue-400";
      textColor = "text-blue-800";
      indicator = "▼";
      indicatorColor = "text-blue-600";
    } else {
      bgColor = "bg-green-50";
      borderColor = "border-green-400";
      textColor = "text-green-800";
      indicator = "●";
      indicatorColor = "text-green-600";
    }
  } else {
    // Higher is better (efficiency)
    if (band === "high") {
      bgColor = "bg-blue-50";
      borderColor = "border-blue-400";
      textColor = "text-blue-800";
      indicator = "▲";
      indicatorColor = "text-blue-600";
    } else if (band === "low") {
      bgColor = "bg-red-50";
      borderColor = "border-red-400";
      textColor = "text-red-800";
      indicator = "▼";
      indicatorColor = "text-red-600";
    } else {
      bgColor = "bg-green-50";
      borderColor = "border-green-400";
      textColor = "text-green-800";
      indicator = "●";
      indicatorColor = "text-green-600";
    }
  }

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg text-center border transition-all",
        bgColor,
        borderColor
      )}
    >
      <span className={cn("text-lg font-bold", textColor)}>
        {format(value)}
      </span>
      <span className={cn("text-sm ml-1 font-bold", indicatorColor)}>
        {indicator}
      </span>
    </div>
  );
}

// ─── Team-level MetricCell ───────────────────────────────────────────────────

interface TeamMetricCellProps {
  value: number;
  thresholds: Thresholds | null;
  format: (v: number) => string;
  higherIsWorse: boolean;
}

function TeamMetricCell({
  value,
  thresholds,
  format,
  higherIsWorse,
}: TeamMetricCellProps) {
  if (!thresholds) {
    return (
      <td className="px-3 py-2 text-center text-sm font-medium text-neutral-700">
        {format(value)}
      </td>
    );
  }

  const band = getIndicatorBand(value, thresholds);

  let textColor: string;
  let indicator: string;
  let indicatorColor: string;

  if (higherIsWorse) {
    if (band === "high") {
      textColor = "text-red-700";
      indicator = "▲";
      indicatorColor = "text-red-500";
    } else if (band === "low") {
      textColor = "text-blue-700";
      indicator = "▼";
      indicatorColor = "text-blue-500";
    } else {
      textColor = "text-green-700";
      indicator = "●";
      indicatorColor = "text-green-500";
    }
  } else {
    if (band === "high") {
      textColor = "text-blue-700";
      indicator = "▲";
      indicatorColor = "text-blue-500";
    } else if (band === "low") {
      textColor = "text-red-700";
      indicator = "▼";
      indicatorColor = "text-red-500";
    } else {
      textColor = "text-green-700";
      indicator = "●";
      indicatorColor = "text-green-500";
    }
  }

  return (
    <td className="px-3 py-2 text-center">
      <span className={cn("text-sm font-semibold", textColor)}>
        {format(value)}
      </span>
      <span className={cn("text-xs ml-1 font-bold", indicatorColor)}>
        {indicator}
      </span>
    </td>
  );
}

// ─── Burnout Badge ───────────────────────────────────────────────────────────

function BurnoutBadge({ level }: { level: string }) {
  if (level === "high") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
        <Flame className="w-3 h-3" />
        HIGH
      </span>
    );
  }
  if (level === "medium") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
        MEDIUM
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
      LOW
    </span>
  );
}

// ─── ThresholdLegend (SummaryCards) ──────────────────────────────────────────

function ThresholdLegend() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Upper 20% */}
      <div className="rounded-lg p-4 bg-gradient-to-br from-red-50 to-white border-2 border-neutral-200 border-l-4 border-l-red-500 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-red-500 text-xl font-bold">▲</span>
          <div>
            <h3 className="font-semibold text-neutral-900">상위 20%</h3>
            <p className="text-sm text-neutral-500 mt-1">
              80th 백분위 이상 -- 초과근무/시간은 위험, 효율은 우수
            </p>
          </div>
        </div>
      </div>

      {/* Middle 60% */}
      <div className="rounded-lg p-4 bg-gradient-to-br from-green-50 to-white border-2 border-neutral-200 border-l-4 border-l-green-500 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-green-500 text-xl font-bold">●</span>
          <div>
            <h3 className="font-semibold text-neutral-900">중위 60%</h3>
            <p className="text-sm text-neutral-500 mt-1">
              20th ~ 80th 백분위 -- 정상 범위
            </p>
          </div>
        </div>
      </div>

      {/* Lower 20% */}
      <div className="rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-neutral-200 border-l-4 border-l-blue-500 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-xl font-bold">▼</span>
          <div>
            <h3 className="font-semibold text-neutral-900">하위 20%</h3>
            <p className="text-sm text-neutral-500 mt-1">
              20th 백분위 이하 -- 초과근무/시간은 양호, 효율은 관심 필요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StatsSummaryCards ────────────────────────────────────────────────────────

interface StatsSummaryCardsProps {
  companyTotals: CompanyTotals;
  teams: TeamMetrics[];
}

function StatsSummaryCards({ companyTotals, teams }: StatsSummaryCardsProps) {
  const sortedByEfficiency = [...teams].sort(
    (a, b) => b.avgEfficiency - a.avgEfficiency
  );
  const bestTeam = sortedByEfficiency[0];
  const worstTeam = sortedByEfficiency[sortedByEfficiency.length - 1];

  if (!bestTeam || !worstTeam) {
    throw new Error("Cannot determine best/worst team from empty team list");
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white border border-neutral-200 border-l-4 border-l-blue-500 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-neutral-500 font-medium">총 인원</span>
        </div>
        <p className="text-2xl font-bold text-neutral-900">
          {companyTotals.totalHeadcount}
          <span className="text-sm font-normal text-neutral-500 ml-1">명</span>
        </p>
      </div>

      <div className="rounded-lg p-4 bg-gradient-to-br from-emerald-50 to-white border border-neutral-200 border-l-4 border-l-emerald-500 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-neutral-500 font-medium">
            전사 평균 효율
          </span>
        </div>
        <p className="text-2xl font-bold text-neutral-900">
          {companyTotals.avgEfficiency.toFixed(1)}
          <span className="text-sm font-normal text-neutral-500 ml-1">%</span>
        </p>
      </div>

      <div className="rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white border border-neutral-200 border-l-4 border-l-blue-500 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-neutral-500 font-medium">
            최고 효율 팀
          </span>
        </div>
        <p className="text-lg font-bold text-neutral-900">
          {bestTeam.orgName}
        </p>
        <p className="text-sm text-blue-600 font-semibold">
          {bestTeam.avgEfficiency.toFixed(1)}%
        </p>
      </div>

      <div className="rounded-lg p-4 bg-gradient-to-br from-red-50 to-white border border-neutral-200 border-l-4 border-l-red-500 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown className="w-4 h-4 text-red-600" />
          <span className="text-xs text-neutral-500 font-medium">
            최저 효율 팀
          </span>
        </div>
        <p className="text-lg font-bold text-neutral-900">
          {worstTeam.orgName}
        </p>
        <p className="text-sm text-red-600 font-semibold">
          {worstTeam.avgEfficiency.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface CenterLevelGridProps {
  centers: CenterMetrics[];
  teams: TeamMetrics[];
  companyTotals: CompanyTotals;
}

export function CenterLevelGrid({
  centers,
  teams,
  companyTotals,
}: CenterLevelGridProps) {
  // Pre-calculate thresholds for each metric across ALL team values
  const teamThresholds: Record<string, Thresholds | null> = {};

  for (const config of METRIC_CONFIGS) {
    if (config.key === "headcount") {
      teamThresholds[config.key] = null;
      continue;
    }
    const teamValues = teams.map((t) => t[config.teamKey] as number);
    if (teamValues.length >= 3) {
      teamThresholds[config.key] = calculateThresholds(teamValues);
    } else {
      teamThresholds[config.key] = null;
    }
  }

  // Center-level thresholds (calculated from center aggregated values)
  const centerThresholds: Record<string, Thresholds | null> = {};

  for (const config of METRIC_CONFIGS) {
    if (config.key === "headcount") {
      centerThresholds[config.key] = null;
      continue;
    }
    const centerValues = centers.map((c) => c[config.key] as number);
    if (centerValues.length >= 3) {
      centerThresholds[config.key] = calculateThresholds(centerValues);
    } else {
      centerThresholds[config.key] = null;
    }
  }

  // Group teams by center
  const centerCodes = centers.map((c) => c.centerCode);
  const teamsByCenter: Record<string, TeamMetrics[]> = {};
  for (const code of centerCodes) {
    teamsByCenter[code] = teams.filter((t) => t.parentCenterCode === code);
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <StatsSummaryCards companyTotals={companyTotals} teams={teams} />

      {/* Threshold Legend */}
      <ThresholdLegend />

      {/* ═══ CENTER MATRIX TABLE ═══ */}
      <div className="bg-white rounded-xl border-2 border-neutral-300 shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-neutral-50 border-b-2 border-neutral-300">
          <h2 className="text-lg font-bold text-neutral-900">
            센터별 주요 지표 매트릭스
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            센터 단위 집계 -- 동적 백분위 기반 색상 표시
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-300">
                <th className="px-4 py-3 text-left text-sm font-bold text-neutral-600 bg-neutral-50 w-[140px]">
                  구분
                </th>
                {centers.map((center) => (
                  <th
                    key={center.centerCode}
                    className="px-4 py-3 text-center text-sm font-bold text-neutral-700 bg-neutral-50 min-w-[140px]"
                  >
                    {center.centerName}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-bold text-neutral-600 bg-neutral-100 min-w-[140px]">
                  전사 평균
                </th>
              </tr>
            </thead>
            <tbody>
              {METRIC_CONFIGS.map((config, rowIdx) => (
                <tr
                  key={config.key}
                  className={cn(
                    "border-b border-neutral-200",
                    rowIdx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"
                  )}
                >
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-700 bg-neutral-50 whitespace-nowrap">
                    {config.label}
                  </td>
                  {centers.map((center) => (
                    <td key={center.centerCode} className="px-3 py-2">
                      <MetricIndicator
                        value={center[config.key] as number}
                        thresholds={centerThresholds[config.key]}
                        format={config.format}
                        higherIsWorse={config.higherIsWorse}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 bg-neutral-50">
                    <MetricIndicator
                      value={companyTotals[config.companyKey] as number}
                      thresholds={null}
                      format={config.format}
                      higherIsWorse={config.higherIsWorse}
                      isCompanyAvg
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ TEAM DETAIL TABLE ═══ */}
      <div className="bg-white rounded-xl border-2 border-neutral-300 shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-neutral-50 border-b-2 border-neutral-300">
          <h2 className="text-lg font-bold text-neutral-900">
            팀별 상세 현황
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            8개 팀 -- 센터별 그룹핑 -- 동적 임계값 기반 ▲●▼ 표시
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-300 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider w-[120px]">
                  팀
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  인원
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  효율성(%)
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  근무시간(h)
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  초과근무(%)
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  번아웃 위험
                </th>
              </tr>
            </thead>
            {centerCodes.map((centerCode) => {
              const center = centers.find(
                (c) => c.centerCode === centerCode
              );
              if (!center) {
                throw new Error(
                  `Center not found for code: ${centerCode}`
                );
              }
              const centerTeams = teamsByCenter[centerCode];
              if (!centerTeams) {
                throw new Error(
                  `Teams not found for center: ${centerCode}`
                );
              }

              return (
                <tbody key={centerCode}>
                  {/* Center header row */}
                  <tr className="border-t-2 border-neutral-300 bg-neutral-100">
                    <td
                      colSpan={6}
                      className="px-4 py-2 text-sm font-bold text-neutral-800"
                    >
                      {center.centerName} ({center.headcount}명)
                    </td>
                  </tr>

                  {/* Team rows */}
                  {centerTeams.map((team) => {
                    const isB11 = team.orgCode === "B-1-1";
                    return (
                      <tr
                        key={team.orgCode}
                        className={cn(
                          "border-b border-neutral-100 transition-colors",
                          isB11
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-neutral-50"
                        )}
                      >
                        <td
                          className={cn(
                            "px-4 py-2 text-sm font-semibold",
                            isB11
                              ? "text-red-800"
                              : "text-neutral-800"
                          )}
                        >
                          {team.orgName}
                        </td>
                        <td className="px-3 py-2 text-center text-sm font-medium text-neutral-700">
                          {team.headcount}명
                        </td>
                        <TeamMetricCell
                          value={team.avgEfficiency}
                          thresholds={teamThresholds["avgEfficiency"]}
                          format={(v) => `${v.toFixed(1)}%`}
                          higherIsWorse={false}
                        />
                        <TeamMetricCell
                          value={team.avgWorkHours}
                          thresholds={teamThresholds["avgWorkHours"]}
                          format={(v) => `${v.toFixed(1)}h`}
                          higherIsWorse={true}
                        />
                        <TeamMetricCell
                          value={team.overtimeRatio}
                          thresholds={teamThresholds["overtimeRatio"]}
                          format={(v) => `${v.toFixed(1)}%`}
                          higherIsWorse={true}
                        />
                        <td className="px-3 py-2 text-center">
                          <BurnoutBadge level={team.burnoutRiskLevel} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
