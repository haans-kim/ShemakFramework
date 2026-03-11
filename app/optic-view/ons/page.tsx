"use client";

import { useState, useMemo, useCallback } from "react";
import { BackButton } from "@/components/poc/back-button";
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
} from "recharts";
import {
  surveyMeta,
  indicators,
  surveyAreas,
  engagementTypes,
  shapFactors,
  orgs,
  typeColors,
  typeLabels,
  simBasePcts,
  simTypeEngScores,
} from "@/lib/data/ons-data";
import type { ShapFactor, OrgShapFactor, OrgData } from "@/lib/data/ons-data";

// ===========================================================================
// Constants
// ===========================================================================
const TC = typeColors;

// ===========================================================================
// Helpers
// ===========================================================================
function gapClass(val: number, grp: number) {
  return val >= grp ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold";
}

function gapText(val: number, grp: number) {
  const gap = Math.round((val - grp) * 10) / 10;
  const arrow = gap >= 0 ? "\u25B2" : "\u25BC";
  return `${arrow} ${gap > 0 ? "+" : ""}${gap}%p`;
}

function GapBadge({ val, grp }: { val: number; grp: number }) {
  return <span className={gapClass(val, grp)}>{gapText(val, grp)}</span>;
}

// ===========================================================================
// GaugeRow
// ===========================================================================
function GaugeRow({
  label, val, grp, labelWidth = "80px", positiveColor = "bg-blue-400", negativeColor = "bg-red-400",
  compLabel = "그룹",
}: {
  label: string; val: number; grp: number; labelWidth?: string;
  positiveColor?: string; negativeColor?: string; compLabel?: string;
}) {
  const isAbove = val >= grp;
  const barColor = isAbove ? positiveColor : negativeColor;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="text-[13px] font-medium text-gray-700 shrink-0" style={{ width: labelWidth }}>{label}</div>
      <div className="flex-1 relative h-6 bg-gray-100 rounded overflow-hidden">
        <div className={`h-full rounded ${barColor} opacity-30`} style={{ width: `${val}%` }} />
        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold ${isAbove ? "text-blue-600" : "text-red-600"}`}>
          {val}%
        </span>
      </div>
      <div className="w-[120px] text-right text-xs text-gray-500 shrink-0">
        {compLabel} {grp}% <GapBadge val={val} grp={grp} />
      </div>
    </div>
  );
}

// ===========================================================================
// DirectionBadge
// ===========================================================================
function DirectionBadge({ dir }: { dir: string }) {
  const style = dir === "집중개선"
    ? "bg-red-50 text-red-600 border-red-200"
    : dir === "개선"
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-green-50 text-green-600 border-green-200";
  return <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${style}`}>{dir}</span>;
}

// ===========================================================================
// SHAP What-If Simulator (supports both global & org-specific SHAP)
// ===========================================================================
function WhatIfSimulator({
  basePcts,
  baseEngagement,
  label,
  useOrgShap,
  orgShapFactors,
  orgBaseRates,
}: {
  basePcts: { high: number; general: number; caution: number; quiet: number };
  baseEngagement: number;
  label?: string;
  useOrgShap?: boolean;
  orgShapFactors?: OrgShapFactor[];
  orgBaseRates?: Record<string, number>;
}) {
  const factors = useOrgShap && orgShapFactors ? orgShapFactors : shapFactors;

  const getBaseRate = useCallback((f: ShapFactor | OrgShapFactor) => {
    if (useOrgShap) return f.baseRate;
    if (orgBaseRates && orgBaseRates[f.key] != null) return orgBaseRates[f.key];
    return f.baseRate;
  }, [useOrgShap, orgBaseRates]);

  const [vals, setVals] = useState<Record<string, number>>(
    Object.fromEntries(factors.map((f) => [f.key, getBaseRate(f)]))
  );

  const compute = useCallback((v: Record<string, number>) => {
    const types = ["high", "general", "caution", "quiet"] as const;
    const raw: Record<string, number> = {};

    if (useOrgShap && orgShapFactors) {
      // Org-specific: single shap importance value
      types.forEach((t) => {
        raw[t] = orgShapFactors.reduce((a, f) => {
          const delta = (v[f.key] - getBaseRate(f)) / 50;
          const sign = t === "caution" || t === "quiet" ? -1 : 1;
          return a + sign * delta * f.shap;
        }, 0);
      });
    } else {
      // Global: per-type shap values
      types.forEach((t) => {
        raw[t] = (factors as ShapFactor[]).reduce((a, f) => {
          const delta = (v[f.key] - getBaseRate(f)) / 50;
          const sign = t === "caution" || t === "quiet" ? -1 : 1;
          return a + sign * delta * (f.shap as Record<string, number>)[t];
        }, 0);
      });
    }

    const S = 2.5;
    const logits: Record<string, number> = {};
    types.forEach((t) => {
      const bp = Math.max(basePcts[t], 0.5) / 100;
      logits[t] = Math.log(bp / (1 - bp + 1e-6)) + raw[t] * S;
    });
    const mx = Math.max(...Object.values(logits));
    const ev: Record<string, number> = {};
    let es = 0;
    types.forEach((t) => { ev[t] = Math.exp(logits[t] - mx); es += ev[t]; });
    const r: Record<string, number> = {};
    types.forEach((t) => { r[t] = Math.round(ev[t] / es * 1000) / 10; });
    return r as { high: number; general: number; caution: number; quiet: number };
  }, [basePcts, useOrgShap, orgShapFactors, factors, getBaseRate]);

  const predicted = useMemo(() => compute(vals), [compute, vals]);

  const predEngagement = useMemo(() => {
    return Math.round(
      (predicted.high * simTypeEngScores.high +
        predicted.general * simTypeEngScores.general +
        predicted.caution * simTypeEngScores.caution +
        predicted.quiet * simTypeEngScores.quiet) / 100 * 10
    ) / 10;
  }, [predicted]);

  const delta = Math.round((predEngagement - baseEngagement) * 10) / 10;
  const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
  const deltaColor = delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-gray-400";

  const areaColors: Record<string, string> = {
    "경영철학": "#3b82f6", "리더": "#10b981", "인사제도": "#f59e0b", "일하는 방식": "#8b5cf6", "조직/프로세스": "#6b7280",
  };

  const onSlider = (key: string, value: number) => {
    setVals((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setVals(Object.fromEntries(factors.map((f) => [f.key, getBaseRate(f)])));
  };

  const chartData = [
    { name: "고몰입", value: predicted.high, fill: "#3b82f6" },
    { name: "일반", value: predicted.general, fill: "#10b981" },
    { name: "주의 필요", value: predicted.caution, fill: "#ef4444" },
    { name: "조용한 사직", value: predicted.quiet, fill: "#6b7280" },
  ];

  const typeKeys = ["high", "general", "caution", "quiet"] as const;
  const typeLabel: Record<string, string> = { high: "고몰입", general: "일반", caution: "주의 필요", quiet: "조용한 사직" };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        SHAP What-If 시뮬레이터 {label && <span className="text-blue-600">— {label}</span>}
        {useOrgShap ? (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-normal">조직 고유 SHAP</span>
        ) : label !== "전사" ? (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 font-normal">전사 SHAP 적용</span>
        ) : null}
      </div>
      <p className="text-xs text-gray-500 mb-4">
        주요 요인을 조절하면 몰입 유형 분포와 예측 몰입도가 어떻게 변화하는지 시뮬레이션합니다.
      </p>
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Sliders */}
        <div className="max-h-[560px] overflow-y-auto pr-2">
          {factors.map((f, i) => {
            const ac = Object.entries(areaColors).find(([k]) => f.area.includes(k));
            const cl = ac ? ac[1] : "#6b7280";
            const br = getBaseRate(f);
            return (
              <div key={f.key} className="mb-3 pb-3 border-b border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[13px] font-medium text-gray-700">
                    {f.label} <span className="text-[10px] ml-1" style={{ color: cl }}>{f.area}</span>
                  </label>
                  <span className="text-[13px] font-semibold text-blue-600">{vals[f.key]}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-300 w-6">0%</span>
                  <input
                    type="range" min={0} max={100} step={1} value={vals[f.key]}
                    onChange={(e) => onSlider(f.key, +e.target.value)}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-[10px] text-gray-300 w-8 text-right">100%</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  현재 긍정률 {br}% | {useOrgShap
                    ? `SHAP 중요도: ${(f as OrgShapFactor).shap.toFixed(4)} (#${i + 1})`
                    : `SHAP: 주의필요 ${(f as ShapFactor).shap.caution} / 고몰입 ${(f as ShapFactor).shap.high}`
                  }
                </div>
              </div>
            );
          })}
          <button
            onClick={reset}
            className="w-full mt-2 py-2 bg-gray-100 border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            초기화
          </button>
        </div>

        {/* Right: Results */}
        <div>
          {/* Current vs Predicted Engagement */}
          <div className="grid grid-cols-[1fr_40px_1fr] gap-2 items-center mb-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500">현재 몰입도</div>
              <div className="text-3xl font-bold text-gray-400">{baseEngagement}%</div>
            </div>
            <div className="text-center text-xl text-gray-300">&rarr;</div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500">예측 몰입도</div>
              <div className={`text-3xl font-bold ${deltaColor}`}>{predEngagement}%</div>
              <div className={`text-sm font-semibold ${deltaColor}`}>{deltaStr}%p</div>
            </div>
          </div>

          {/* Type comparison */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {typeKeys.map((t) => {
              const base = basePcts[t];
              const pred = predicted[t];
              const d = Math.round((pred - base) * 10) / 10;
              const ds = d >= 0 ? `+${d}` : `${d}`;
              const goodDir = t === "high" || t === "general" ? d > 0 : d < 0;
              return (
                <div key={t} className="text-center p-2.5 bg-gray-50 rounded-md">
                  <div className="text-[11px] font-semibold" style={{ color: TC[t] }}>{typeLabel[t]}</div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {base}% &rarr; <b className="text-gray-700">{pred}%</b>
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 ${goodDir ? "text-emerald-600" : "text-red-600"}`}>
                    {ds}%p
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, Math.max(70, Math.ceil(Math.max(basePcts.high, basePcts.caution, basePcts.general) / 10) * 10 + 10)]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" barSize={32} radius={[4, 4, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.fill} fillOpacity={0.4} stroke={d.fill} strokeWidth={1.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 bg-gray-50 rounded-md text-[11px] text-gray-400 leading-relaxed">
            ※ {useOrgShap ? "조직 고유 SHAP(C1/주의필요 회귀) 기반 Top 10 변수" : "전사 SHAP 가중치 기반"} 시뮬레이션.
            슬라이더 기본값은 {label ? `${label}의 ` : ""}현재 문항 긍정률(%)이며, 조절 시 유형 분포 변화를 통해 예측 몰입도를 산출합니다.
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Sub-team Table
// ===========================================================================
function SubTeamTable({ org }: { org: OrgData }) {
  if (!org.teams || org.teams.length === 0) return null;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        하위 팀 현황
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-normal">
          {org.teams.length}개 팀
        </span>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">팀명</th>
            <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">인원</th>
            <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">몰입도</th>
            <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium" style={{ width: "40%" }}>유형 분포</th>
            <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">주의필요</th>
          </tr>
        </thead>
        <tbody>
          {org.teams.map((t) => {
            const engGap = Math.round((t.engagement - org.engagement) * 10) / 10;
            const engColor = t.engagement >= org.engagement ? "text-blue-600" : "text-red-600";
            const gapCls = engGap >= 0 ? "text-emerald-600" : "text-red-600";
            const cautionBadge = (t.types.caution ?? 0) > 30
              ? "bg-red-50 text-red-600 border-red-200"
              : (t.types.caution ?? 0) > 20
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-green-50 text-green-600 border-green-200";
            return (
              <tr key={t.name} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 px-3 font-medium">{t.name}</td>
                <td className="py-2.5 px-3">{t.n}명</td>
                <td className="py-2.5 px-3">
                  <span className={`font-semibold ${engColor}`}>{t.engagement}%</span>
                  <span className={`text-[11px] ml-1 font-semibold ${gapCls}`}>
                    {engGap >= 0 ? "\u25B2" : "\u25BC"}{engGap > 0 ? "+" : ""}{engGap}%p
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex h-4 rounded overflow-hidden">
                    {(["high", "caution", "general", "quiet"] as const).map((tid) => (
                      <div
                        key={tid}
                        style={{ width: `${t.types[tid] ?? 0}%`, backgroundColor: TC[tid] }}
                        title={`${typeLabels[tid]} ${t.types[tid] ?? 0}%`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${cautionBadge}`}>
                    {t.types.caution ?? 0}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-2 flex gap-4 text-[11px] text-gray-400">
        {(["high", "caution", "general", "quiet"] as const).map((tid) => (
          <span key={tid} className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: TC[tid] }} />
            {typeLabels[tid]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Overview Tab
// ===========================================================================
function OverviewTab({ onOrgClick }: { onOrgClick: (idx: number) => void }) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const toggleType = (id: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const orgsSorted = useMemo(
    () => [...orgs].sort((a, b) => (b.types.caution ?? 0) - (a.types.caution ?? 0)),
    []
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">조직진단 Survey 분석 요약</h2>
      <p className="text-sm text-gray-500 mb-6">
        조직진단 설문 결과를 AI Modeling 하여 몰입 유형 예측하고 개선 과제를 도출 — 전사 {surveyMeta.totalRespondents.toLocaleString()}명
      </p>

      {/* 1. 몰입도 지표 요약 + Survey 응답 요약 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-900 mb-4">몰입도 지표 요약</div>
          <div className="text-center mb-4">
            <span className="text-[13px] text-gray-500">몰입도 평균</span>
            <span className="text-2xl font-bold text-blue-600 mx-2">{surveyMeta.engagementAvg}%</span>
            <span className="text-[13px]">
              <GapBadge val={surveyMeta.engagementAvg} grp={surveyMeta.engagementGroup} />
            </span>
          </div>
          {indicators.map((ind) => (
            <GaugeRow key={ind.name} label={ind.name} val={ind.val} grp={ind.grp} />
          ))}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-900 mb-4">Survey 응답 요약</div>
          {surveyAreas.map((area) => (
            <GaugeRow
              key={area.name} label={area.name} val={area.val} grp={area.grp}
              labelWidth="140px" positiveColor="bg-emerald-400" negativeColor="bg-amber-400"
            />
          ))}
        </div>
      </div>

      {/* 2. 전사 몰입 유형 예측 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          전사 몰입 유형 예측
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 font-normal">
            클릭하여 상세 보기
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {engagementTypes.map((t) => {
            const isExpanded = expandedTypes.has(t.id);
            return (
              <div
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={`rounded-lg p-5 border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${isExpanded ? "shadow-md" : ""}`}
                style={{
                  borderColor: isExpanded ? t.color : `${t.color}30`,
                  boxShadow: isExpanded ? `0 0 0 3px ${t.color}20` : undefined,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold" style={{ color: t.color }}>{t.label}</span>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium border"
                    style={{ color: t.color, borderColor: `${t.color}40`, backgroundColor: `${t.color}10` }}
                  >
                    {t.yoy}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold" style={{ color: t.color }}>{t.n}</span>
                  <span className="text-sm text-gray-500 ml-1">명 ({t.pct}%)</span>
                </div>
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {Object.entries(t.scores).map(([k, v]) => (
                    <div key={k} className="text-center">
                      <div className="text-sm font-semibold" style={{ color: t.color }}>{v}</div>
                      <div className="text-[10px] text-gray-400">{k}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  퇴직자 {t.turnover.n}명 ({t.turnover.pct}%)
                </div>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                    {t.desc.map((d, i) => (
                      <p key={i} className="text-[13px] text-gray-600 leading-relaxed">&bull; {d}</p>
                    ))}
                  </div>
                )}
                <div className="text-center mt-2 text-[11px] text-gray-400">
                  {isExpanded ? "\u25B2 접기" : "\u25BC 클릭하여 상세 보기"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 조직별 몰입 유형 비중 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          조직별 몰입 유형 비중
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 font-normal">
            클릭하여 조직 상세로 이동
          </span>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 px-4 py-2 text-[11px] text-gray-400 border-b border-gray-200 mb-1">
          <div className="w-[110px]">조직</div>
          <div className="flex-1 flex justify-between">
            <span style={{ color: TC.high }}>고몰입</span>
            <span style={{ color: TC.caution }}>주의 필요</span>
            <span style={{ color: TC.general }}>일반</span>
            <span style={{ color: TC.quiet }}>조용한 사직</span>
          </div>
          <div className="w-[50px] text-right">인원</div>
        </div>
        {orgsSorted.map((org, i) => (
          <div
            key={org.name}
            onClick={() => onOrgClick(i)}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-blue-50/50 rounded transition-colors"
          >
            <div className="w-[110px] text-[13px] font-medium shrink-0">{org.name}</div>
            <div className="flex-1 flex h-5 rounded overflow-hidden">
              {(["high", "caution", "general", "quiet"] as const).map((tid) => (
                <div key={tid} style={{ width: `${org.types[tid] ?? 0}%`, backgroundColor: TC[tid] }} />
              ))}
            </div>
            <div className="w-[50px] text-right text-xs text-gray-400 shrink-0">{org.n}명</div>
          </div>
        ))}
      </div>

      {/* 4. SHAP What-If 시뮬레이터 */}
      <WhatIfSimulator basePcts={simBasePcts} baseEngagement={surveyMeta.engagementAvg} label="전사" />
    </div>
  );
}

// ===========================================================================
// Team Detail Tab
// ===========================================================================
function TeamTab({ org }: { org: OrgData }) {
  const typeChartData = [
    { name: "고몰입", org: org.types.high ?? 0, comp: engagementTypes.find((t) => t.id === "high")?.pct ?? 0 },
    { name: "주의 필요", org: org.types.caution ?? 0, comp: engagementTypes.find((t) => t.id === "caution")?.pct ?? 0 },
    { name: "일반", org: org.types.general ?? 0, comp: engagementTypes.find((t) => t.id === "general")?.pct ?? 0 },
    { name: "조용한 사직", org: org.types.quiet ?? 0, comp: engagementTypes.find((t) => t.id === "quiet")?.pct ?? 0 },
  ];

  const cautionBadgeClass = (org.types.caution ?? 0) > 30
    ? "bg-red-50 text-red-600 border-red-200"
    : (org.types.caution ?? 0) > 20
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-green-50 text-green-600 border-green-200";

  const teamBasePcts = {
    high: org.types.high ?? 0,
    general: org.types.general ?? 0,
    caution: org.types.caution ?? 0,
    quiet: org.types.quiet ?? 0,
  };

  const useOrgShap = !!org.orgShapFactors;

  return (
    <div>
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-base font-semibold text-blue-800 mb-3">Executive Summary — {org.name}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">&bull; {org.execSummary}</p>
      </div>

      {/* Org header */}
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-semibold text-gray-900">{org.name}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{org.n}명</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cautionBadgeClass}`}>
          주의필요 {org.types.caution ?? 0}%
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        몰입도 평균 {org.engagement}% (전사 {surveyMeta.engagementAvg}%) <GapBadge val={org.engagement} grp={surveyMeta.engagementAvg} />
      </p>

      {/* 유형 분포 + 몰입도 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">몰입 유형 분포 (vs 전사)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 70]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="org" name={org.name} barSize={16}>
                {typeChartData.map((_, i) => (
                  <Cell key={i}
                    fill={[TC.high, TC.caution, TC.general, TC.quiet][i]}
                    fillOpacity={0.4}
                    stroke={[TC.high, TC.caution, TC.general, TC.quiet][i]}
                    strokeWidth={1.5}
                  />
                ))}
              </Bar>
              <Bar dataKey="comp" name="전사" fill="#9ca3af" fillOpacity={0.15} stroke="#9ca3af" strokeWidth={1} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            {(["high", "caution", "general", "quiet"] as const).map((tid) => (
              <span key={tid}>
                <span className="font-medium" style={{ color: TC[tid] }}>{typeLabels[tid]}</span>{" "}
                {org.typeN[tid] ?? 0}명({org.types[tid] ?? 0}%)
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">몰입도 (vs 전사)</div>
          {indicators.map((ind) => (
            <GaugeRow
              key={ind.name} label={ind.name}
              val={org.scores[ind.name] ?? 0} grp={ind.val}
              compLabel="전사"
            />
          ))}
        </div>
      </div>

      {/* Survey 영역별 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="text-sm font-semibold text-gray-900 mb-3">Survey 영역별 긍정률 (vs 전사)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={org.areas.map((a) => ({ area: a.area, org: a.rate, comp: a.comp }))}
            layout="vertical" margin={{ left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="area" width={130} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="org" name={org.name} fill="#3b82f6" fillOpacity={0.4} stroke="#3b82f6" strokeWidth={1.5} barSize={10} />
            <Bar dataKey="comp" name="전사" fill="#9ca3af" fillOpacity={0.15} stroke="#9ca3af" strokeWidth={1} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-team table */}
      <SubTeamTable org={org} />

      {/* 강화/개선 과제 */}
      {(org.strengthen.length > 0 || org.improve.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="text-sm font-semibold text-blue-600 mb-3">{"\u25B2"} 강화 과제</div>
            {org.strengthen.length === 0 ? (
              <p className="text-[13px] text-gray-400">해당 없음</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">키워드</th>
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">긍정률</th>
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">순위</th>
                  </tr>
                </thead>
                <tbody>
                  {org.strengthen.map((t) => (
                    <tr key={t.keyword} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 font-medium">{t.keyword}</td>
                      <td className="py-2 text-blue-600 font-semibold">{t.rate}</td>
                      <td className="py-2">{t.rank}위</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="text-sm font-semibold text-red-600 mb-3">{"\u25BC"} 개선 과제</div>
            {org.improve.length === 0 ? (
              <p className="text-[13px] text-gray-400">해당 없음</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">키워드</th>
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">긍정률</th>
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">순위</th>
                  </tr>
                </thead>
                <tbody>
                  {org.improve.map((t) => (
                    <tr key={t.keyword} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 font-medium">{t.keyword}</td>
                      <td className="py-2 text-red-600 font-semibold">{t.rate}</td>
                      <td className="py-2">{t.rank}위</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 영역별 개선 방향 */}
      {org.directions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-3">영역별 개선 방향</div>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(org.directions.length, 4)}, 1fr)` }}>
            {org.directions.map((d) => (
              <div key={d.area} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-gray-700">{d.area}</span>
                  <DirectionBadge dir={d.dir} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{d.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHAP What-If 시뮬레이터 (담당별) */}
      <WhatIfSimulator
        basePcts={teamBasePcts}
        baseEngagement={org.engagement}
        label={org.name}
        useOrgShap={useOrgShap}
        orgShapFactors={org.orgShapFactors}
        orgBaseRates={org.orgBaseRates}
      />
    </div>
  );
}

// ===========================================================================
// Main Page
// ===========================================================================
export default function OnsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const showPage = (idx: number) => {
    setActiveTab(idx);
  };

  // Tab 0 = overview, Tab 1~11 = org pages (by index in orgs array)
  const activeOrg = activeTab > 0 ? orgs[activeTab - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 flex items-center gap-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 py-4 shrink-0">
          <BackButton />
          <span className="text-lg font-bold text-gray-900">Optic <span className="text-blue-600">View</span></span>
        </div>
        <div className="flex items-center gap-0.5 overflow-x-auto">
          <button
            onClick={() => showPage(0)}
            className={`px-3.5 py-4 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 0 ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            전사 Overview
          </button>
          {orgs.map((org, i) => (
            <button
              key={org.name}
              onClick={() => showPage(i + 1)}
              className={`px-3.5 py-4 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i + 1 ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {org.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-[1400px] mx-auto p-8">
        {activeTab === 0 ? (
          <OverviewTab onOrgClick={(sortedIdx) => {
            const sorted = [...orgs].sort((a, b) => (b.types.caution ?? 0) - (a.types.caution ?? 0));
            const clickedOrg = sorted[sortedIdx];
            const realIdx = orgs.indexOf(clickedOrg);
            showPage(realIdx + 1);
          }} />
        ) : activeOrg ? (
          <TeamTab org={activeOrg} />
        ) : null}
      </div>
    </div>
  );
}
