"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Activity,
  Info,
} from "lucide-react";
import {
  aiInsights,
  imbalancedTeams,
  getRankColor,
  getCVColor,
  type AIInsight,
  type AlertSeverity,
  type ImbalancedTeam,
} from "@/lib/data/workforce-imbalance-data";

// ─── Severity 색상 매핑 ─────────────────────────────────────────────────────

const severityConfig: Record<
  AlertSeverity,
  { bg: string; border: string; badge: string; icon: string; text: string }
> = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-600 text-white",
    icon: "text-red-600",
    text: "text-red-800",
  },
  high: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-500 text-white",
    icon: "text-orange-500",
    text: "text-orange-800",
  },
  medium: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-500 text-white",
    icon: "text-yellow-600",
    text: "text-yellow-800",
  },
};

const severityIcons: Record<AlertSeverity, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: TrendingUp,
  medium: Activity,
};

const severityLabel: Record<AlertSeverity, string> = {
  critical: "긴급",
  high: "주의",
  medium: "관심",
};

// ─── Bubble Chart Constants ─────────────────────────────────────────────────

const CHART_WIDTH = 900;
const CHART_HEIGHT = 500;
const CHART_PADDING = { top: 40, right: 60, bottom: 60, left: 70 };
const PLOT_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const PLOT_HEIGHT = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

const X_MIN = 34;
const X_MAX = 43;
const Y_MIN = 48;
const Y_MAX = 68;

function scaleX(value: number): number {
  return CHART_PADDING.left + ((value - X_MIN) / (X_MAX - X_MIN)) * PLOT_WIDTH;
}

function scaleY(value: number): number {
  return CHART_PADDING.top + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * PLOT_HEIGHT;
}

function scaleBubbleRadius(headcount: number): number {
  const minR = 8;
  const maxR = 30;
  const minHC = 1;
  const maxHC = 200;
  const clamped = Math.max(minHC, Math.min(maxHC, headcount));
  return minR + ((clamped - minHC) / (maxHC - minHC)) * (maxR - minR);
}

const rankColorMap: Record<"red" | "yellow" | "green", string> = {
  red: "#ef4444",
  yellow: "#f59e0b",
  green: "#22c55e",
};

const rankColorFillMap: Record<"red" | "yellow" | "green", string> = {
  red: "rgba(239, 68, 68, 0.35)",
  yellow: "rgba(245, 158, 11, 0.35)",
  green: "rgba(34, 197, 94, 0.35)",
};

// ─── CV% 색상 헬퍼 (Tailwind) ───────────────────────────────────────────────

function cvBgClass(cv: number): string {
  if (cv > 55) return "bg-red-50 border-red-200";
  if (cv >= 50) return "bg-yellow-50 border-yellow-200";
  return "bg-green-50 border-green-200";
}

function cvTextClass(cv: number): string {
  if (cv > 55) return "text-red-700";
  if (cv >= 50) return "text-yellow-700";
  return "text-green-700";
}

function rankBadgeClass(rank: number): string {
  const color = getRankColor(rank);
  if (color === "red") return "bg-red-600 text-white";
  if (color === "yellow") return "bg-yellow-500 text-white";
  return "bg-green-600 text-white";
}

// ─── AI Insight Card ────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: AIInsight }) {
  const config = severityConfig[insight.severity];
  const IconComponent = severityIcons[insight.severity];
  const label = severityLabel[insight.severity];

  return (
    <div
      className={`rounded-lg border p-5 ${config.bg} ${config.border} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${config.icon}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${config.text}`}>
              {insight.title}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}
            >
              {label}
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed mb-3">
            {insight.description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`text-lg font-bold ${config.text}`}
            >
              {insight.affectedCount.toLocaleString()}
              <span className="text-xs font-normal ml-1">{insight.unit}</span>
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-200/60">
            <p className="text-xs text-neutral-500">
              <span className="font-medium">권고:</span>{" "}
              {insight.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bubble Chart ───────────────────────────────────────────────────────────

function BubbleChart({ teams }: { teams: ImbalancedTeam[] }) {
  const [hoveredTeam, setHoveredTeam] = useState<ImbalancedTeam | null>(null);

  const xTicks = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43];
  const yTicks = [48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full max-w-[900px] mx-auto"
        style={{ minWidth: 600 }}
      >
        {/* Grid lines */}
        {xTicks.map((tick) => (
          <line
            key={`x-${tick}`}
            x1={scaleX(tick)}
            y1={CHART_PADDING.top}
            x2={scaleX(tick)}
            y2={CHART_HEIGHT - CHART_PADDING.bottom}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}
        {yTicks.map((tick) => (
          <line
            key={`y-${tick}`}
            x1={CHART_PADDING.left}
            y1={scaleY(tick)}
            x2={CHART_WIDTH - CHART_PADDING.right}
            y2={scaleY(tick)}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}

        {/* Axes */}
        <line
          x1={CHART_PADDING.left}
          y1={CHART_HEIGHT - CHART_PADDING.bottom}
          x2={CHART_WIDTH - CHART_PADDING.right}
          y2={CHART_HEIGHT - CHART_PADDING.bottom}
          stroke="#6b7280"
          strokeWidth={1.5}
        />
        <line
          x1={CHART_PADDING.left}
          y1={CHART_PADDING.top}
          x2={CHART_PADDING.left}
          y2={CHART_HEIGHT - CHART_PADDING.bottom}
          stroke="#6b7280"
          strokeWidth={1.5}
        />

        {/* X-axis labels */}
        {xTicks.map((tick) => (
          <text
            key={`xl-${tick}`}
            x={scaleX(tick)}
            y={CHART_HEIGHT - CHART_PADDING.bottom + 20}
            textAnchor="middle"
            className="text-xs fill-neutral-500"
          >
            {tick}
          </text>
        ))}
        <text
          x={CHART_PADDING.left + PLOT_WIDTH / 2}
          y={CHART_HEIGHT - 10}
          textAnchor="middle"
          className="text-xs fill-neutral-600 font-medium"
        >
          주간 근무추정시간 (시간/주)
        </text>

        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={`yl-${tick}`}
            x={CHART_PADDING.left - 10}
            y={scaleY(tick) + 4}
            textAnchor="end"
            className="text-xs fill-neutral-500"
          >
            {tick}%
          </text>
        ))}
        <text
          x={15}
          y={CHART_PADDING.top + PLOT_HEIGHT / 2}
          textAnchor="middle"
          className="text-xs fill-neutral-600 font-medium"
          transform={`rotate(-90, 15, ${CHART_PADDING.top + PLOT_HEIGHT / 2})`}
        >
          변동계수 (CV%)
        </text>

        {/* Threshold line at CV 55% */}
        <line
          x1={CHART_PADDING.left}
          y1={scaleY(55)}
          x2={CHART_WIDTH - CHART_PADDING.right}
          y2={scaleY(55)}
          stroke="#ef4444"
          strokeWidth={1}
          strokeDasharray="6 3"
          opacity={0.5}
        />
        <text
          x={CHART_WIDTH - CHART_PADDING.right + 5}
          y={scaleY(55) + 4}
          className="text-[10px] fill-red-400"
        >
          위험
        </text>

        {/* Threshold line at CV 50% */}
        <line
          x1={CHART_PADDING.left}
          y1={scaleY(50)}
          x2={CHART_WIDTH - CHART_PADDING.right}
          y2={scaleY(50)}
          stroke="#f59e0b"
          strokeWidth={1}
          strokeDasharray="6 3"
          opacity={0.5}
        />
        <text
          x={CHART_WIDTH - CHART_PADDING.right + 5}
          y={scaleY(50) + 4}
          className="text-[10px] fill-yellow-500"
        >
          주의
        </text>

        {/* Bubbles */}
        {teams.map((team) => {
          const cx = scaleX(team.weeklyHours);
          const cy = scaleY(team.cvPercent);
          const r = scaleBubbleRadius(team.headcount);
          const color = getRankColor(team.rank);
          const isHovered = hoveredTeam?.rank === team.rank;

          return (
            <g
              key={team.teamCode}
              onMouseEnter={() => setHoveredTeam(team)}
              onMouseLeave={() => setHoveredTeam(null)}
              className="cursor-pointer"
            >
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? r + 3 : r}
                fill={rankColorFillMap[color]}
                stroke={rankColorMap[color]}
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-bold fill-neutral-800 pointer-events-none select-none"
              >
                {team.rank}
              </text>
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredTeam && (
          <g>
            <rect
              x={scaleX(hoveredTeam.weeklyHours) + scaleBubbleRadius(hoveredTeam.headcount) + 8}
              y={scaleY(hoveredTeam.cvPercent) - 32}
              width={160}
              height={64}
              rx={6}
              fill="white"
              stroke="#d1d5db"
              strokeWidth={1}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
            />
            <text
              x={scaleX(hoveredTeam.weeklyHours) + scaleBubbleRadius(hoveredTeam.headcount) + 16}
              y={scaleY(hoveredTeam.cvPercent) - 16}
              className="text-xs font-semibold fill-neutral-900"
            >
              #{hoveredTeam.rank} {hoveredTeam.teamName}
            </text>
            <text
              x={scaleX(hoveredTeam.weeklyHours) + scaleBubbleRadius(hoveredTeam.headcount) + 16}
              y={scaleY(hoveredTeam.cvPercent) + 0}
              className="text-[10px] fill-neutral-600"
            >
              CV {hoveredTeam.cvPercent}% | {hoveredTeam.headcount}명
            </text>
            <text
              x={scaleX(hoveredTeam.weeklyHours) + scaleBubbleRadius(hoveredTeam.headcount) + 16}
              y={scaleY(hoveredTeam.cvPercent) + 16}
              className="text-[10px] fill-neutral-500"
            >
              {hoveredTeam.centerName} | {hoveredTeam.weeklyHours}h/주
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Team Balance Card ──────────────────────────────────────────────────────

function TeamBalanceCard({ team }: { team: ImbalancedTeam }) {
  return (
    <div
      className={`rounded-lg border p-4 ${cvBgClass(team.cvPercent)} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${rankBadgeClass(team.rank)}`}
        >
          #{team.rank}
        </span>
        <span className="text-xs text-neutral-500">{team.centerName}</span>
      </div>
      <h4 className="font-semibold text-sm text-neutral-900 mb-2">
        {team.teamName}
      </h4>
      <div className="mb-3">
        <span className={`text-2xl font-bold ${cvTextClass(team.cvPercent)}`}>
          {team.cvPercent}
        </span>
        <span className={`text-sm ml-1 ${cvTextClass(team.cvPercent)}`}>
          %
        </span>
        <span className="text-xs text-neutral-400 ml-1">CV</span>
      </div>
      <div className="flex items-center justify-between text-xs text-neutral-600">
        <span>{team.headcount}명</span>
        <span>{team.weeklyHours}h/주</span>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function WorkforceImbalancePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
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
          <span className="text-neutral-900 font-medium">근무 불균형</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            근무 불균형 - 전사 대시보드
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            10,517명 조직 모니터링
          </p>
        </div>
      </div>

      {/* AI Insights Section */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">
          AI Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      {/* Bubble Chart Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-800">
            근무 불균형 상위 24개 팀
          </h2>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <BubbleChart teams={imbalancedTeams} />

          {/* Info box */}
          <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                  <span className="font-semibold">변동계수(CV)</span> =
                  (표준편차 / 평균) x 100. 팀 내 구성원 간 근무시간 편차를
                  백분율로 나타냅니다. CV가 높을수록 팀 내 업무량 분배가
                  불균등합니다.
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    1~6위 (위험)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    7~18위 (주의)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                    19~24위 (관심)
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    원 크기 = 인원수
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Balance Grid */}
      <section>
        <h2 className="text-base font-semibold text-neutral-800 mb-4">
          팀별 근무 균형도 분석
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {imbalancedTeams.map((team) => (
            <TeamBalanceCard key={team.teamCode} team={team} />
          ))}
        </div>
      </section>
    </div>
  );
}
